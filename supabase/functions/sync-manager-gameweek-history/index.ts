/**
 * EDGE FUNCTION: sync-manager-gameweek-history
 *
 * PURPOSE:
 * Sync gameweek history/statistics for all FPL KINO managers.
 *
 * SOURCE:
 * GET /api/entry/{manager_id}/history/
 *
 * SOURCE DATA:
 * response.current[]
 *
 * TARGET TABLE:
 * - manager_gameweek_stats
 *
 * WRITE STRATEGY:
 * UPSERT
 *
 * CONFLICT KEY:
 * - manager_id
 * - gw_number
 *
 * NOTES:
 * - Reads all manager IDs from the managers table.
 * - Inserts new Gameweek history rows.
 * - Updates existing Gameweek history rows.
 * - Does NOT delete existing data.
 * - Does NOT sync picks, transfers, or chips.
 * - Does NOT write to fpl_sync_logs yet.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FPL_API_BASE =
  "https://fantasy.premierleague.com/api";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY",
);

if (!SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY environment variable",
  );
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

async function fetchManagerHistory(
  managerId: number,
) {
  const response = await fetch(
    `${FPL_API_BASE}/entry/${managerId}/history/`,
    {
      headers: {
        "User-Agent": "FPL-KINO-Supabase-Sync/1.0",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `FPL API request failed for manager ${managerId}: ` +
      `${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return jsonResponse(
        {
          success: false,
          error: "Method not allowed. Use POST.",
        },
        405,
      );
    }

    const syncedAt = new Date().toISOString();

    console.log(
      "[sync-manager-gameweek-history] Starting sync...",
    );

    // Get all managers
    const { data: managers, error: managersError } =
      await supabase
        .from("managers")
        .select("manager_id");

    if (managersError) {
      throw new Error(
        `Failed to fetch managers: ${managersError.message}`,
      );
    }

    if (!managers || managers.length === 0) {
      throw new Error(
        "No managers found in managers table",
      );
    }

    console.log(
      `[sync-manager-gameweek-history] Managers found: ${managers.length}`,
    );

    const allStats: Record<string, unknown>[] = [];
    const failedManagers: {
      manager_id: number;
      error: string;
    }[] = [];

    // Fetch history for every manager
    for (const manager of managers) {
      const managerId = Number(manager.manager_id);

      try {
        const history =
          await fetchManagerHistory(managerId);

        const currentHistory =
          Array.isArray(history.current)
            ? history.current
            : [];

        console.log(
          `[sync-manager-gameweek-history] Manager ${managerId}: ${currentHistory.length} GW rows`,
        );

        for (const gameweek of currentHistory) {
          // Ignore invalid history rows
          if (gameweek.event == null) {
            continue;
          }

          allStats.push({
            manager_id: managerId,
            gw_number: gameweek.event,

            points: gameweek.points ?? null,
            total_points: gameweek.total_points ?? null,
            rank: gameweek.rank ?? null,
            overall_rank:
              gameweek.overall_rank ?? null,

            bank: gameweek.bank ?? null,
            value: gameweek.value ?? null,

            event_transfers:
              gameweek.event_transfers ?? null,

            event_transfers_cost:
              gameweek.event_transfers_cost ?? null,

            points_on_bench:
              gameweek.points_on_bench ?? null,

            updated_at: syncedAt,
          });
        }
      } catch (managerError) {
        const errorMessage =
          managerError instanceof Error
            ? managerError.message
            : String(managerError);

        console.error(
          `[sync-manager-gameweek-history] Failed manager ${managerId}: ${errorMessage}`,
        );

        failedManagers.push({
          manager_id: managerId,
          error: errorMessage,
        });
      }
    }

    if (allStats.length === 0) {
      throw new Error(
        "No manager gameweek history data was retrieved",
      );
    }

    console.log(
      `[sync-manager-gameweek-history] Total rows prepared: ${allStats.length}`,
    );

    // UPSERT to manager_gameweek_stats
    const { error: upsertError } =
      await supabase
        .from("manager_gameweek_stats")
        .upsert(allStats, {
          onConflict: "manager_id,gw_number",
        });

    if (upsertError) {
      throw new Error(
        `Failed to sync manager_gameweek_stats: ${upsertError.message}`,
      );
    }

    const result = {
      success: true,
      function_name:
        "sync-manager-gameweek-history",

      rows_affected: {
        manager_gameweek_stats:
          allStats.length,
      },

      managers_processed:
        managers.length,

      managers_failed:
        failedManagers.length,

      failed_managers: failedManagers,

      synced_at: syncedAt,
    };

    console.log(
      "[sync-manager-gameweek-history] Completed successfully",
      result,
    );

    return jsonResponse(result, 200);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error);

    console.error(
      "[sync-manager-gameweek-history] Failed:",
      errorMessage,
    );

    return jsonResponse(
      {
        success: false,
        function_name:
          "sync-manager-gameweek-history",
        error: errorMessage,
      },
      500,
    );
  }
});
