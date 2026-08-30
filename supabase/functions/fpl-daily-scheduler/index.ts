const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY",
);

if (!SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL");
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

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

async function invokeFunction(
  functionName: string,
) {
  console.log(
    `[fpl-daily-scheduler] Running ${functionName}...`,
  );

  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "apikey": SUPABASE_SERVICE_ROLE_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const responseText = await response.text();
  let responseData: unknown;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    responseData = responseText;
  }

  if (!response.ok) {
    const errorDetails =
      typeof responseData === "object" && responseData !== null
        ? JSON.stringify(responseData)
        : String(responseData);
    throw new Error(
      `[${functionName}] HTTP ${response.status} failed: ${errorDetails}`,
    );
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData &&
    (responseData as { success?: boolean }).success === false
  ) {
    throw new Error(
      `[${functionName}] returned success=false: ${JSON.stringify(responseData)}`,
    );
  }

  return responseData;
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

    const syncedAt =
      new Date().toISOString();

    console.log(
      "[fpl-daily-scheduler] Starting...",
    );

    /*
     * =====================================================
     * STEP 1
     * Sync FPL master/current state
     * =====================================================
     */

    const currentState =
      await invokeFunction(
        "sync-fpl-current-state",
      );

    /*
     * =====================================================
     * STEP 2
     * Sync fixtures
     * =====================================================
     *
     * Must happen after current-state because
     * fixtures depend on Gameweek/team reference data.
     */

    const fixtures =
      await invokeFunction(
        "sync-fpl-fixtures",
      );

    /*
     * =====================================================
     * STEP 3
     * Sync manager Gameweek history
     * =====================================================
     */

    const managerHistory =
      await invokeFunction(
        "sync-manager-gameweek-history",
      );

    /*
     * =====================================================
     * STEP 4
     * Sync manager transfers
     * =====================================================
     */

    const managerTransfers =
      await invokeFunction(
        "sync-manager-transfers",
      );

    /*
     * =====================================================
     * STEP 5
     * Sync manager Gameweek picks
     * =====================================================
     */

    const managerPicks =
      await invokeFunction(
        "sync-manager-gameweek-picks",
      );

    /*
     * =====================================================
     * COMPLETE
     * =====================================================
     */

    const result = {
      success: true,

      function_name:
        "fpl-daily-scheduler",

      steps: {
        sync_fpl_current_state:
          currentState,

        sync_fpl_fixtures:
          fixtures,

        sync_manager_gameweek_history:
          managerHistory,

        sync_manager_transfers:
          managerTransfers,

        sync_manager_gameweek_picks:
          managerPicks,
      },

      synced_at: syncedAt,
    };

    console.log(
      "[fpl-daily-scheduler] Completed.",
    );

    return jsonResponse(
      result,
      200,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error);

    console.error(
      "[fpl-daily-scheduler] Failed:",
      errorMessage,
    );

    return jsonResponse(
      {
        success: false,

        function_name:
          "fpl-daily-scheduler",

        error: errorMessage,

        synced_at:
          new Date().toISOString(),
      },
      500,
    );
  }
});
