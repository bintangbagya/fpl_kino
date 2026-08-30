// sync-fpl-reference-data/index.ts
// Phase 1: Sync fpl_teams, fpl_element_types, fpl_phases, fpl_chips
// Source: https://fantasy.premierleague.com/api/bootstrap-static/
//
// - UPSERT only. No DELETE, no TRUNCATE.
// - Does NOT sync fpl_players or fpl_gameweeks.
// - Does NOT write to fpl_sync_logs (Phase 2).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Types matching bootstrap-static API response ─────────────────────────────

interface ApiChip {
  id: number;
  name: string;
  number: number;
  start_event: number;
  stop_event: number;
  chip_type: string;
}

interface ApiElementType {
  id: number;
  singular_name: string;
  singular_name_short: string;
  plural_name: string;
  plural_name_short: string;
  squad_select: number | null;
  squad_min_play: number | null;
  squad_max_play: number | null;
  ui_shirt_specific: boolean;
}

interface ApiPhase {
  id: number;
  name: string;
  start_event: number;
  stop_event: number;
  highest_score: number | null;
  // Note: highest_scoring_entry is NOT returned in phases from bootstrap-static
}

interface ApiTeam {
  id: number;
  name: string;
  short_name: string;
  code: number;
  strength: number | null;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
  pulse_id: number;
}

interface BootstrapStaticResponse {
  chips: ApiChip[];
  element_types: ApiElementType[];
  phases: ApiPhase[];
  teams: ApiTeam[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const results: Record<string, { upserted: number; error: string | null }> = {
    fpl_teams: { upserted: 0, error: null },
    fpl_element_types: { upserted: 0, error: null },
    fpl_phases: { upserted: 0, error: null },
    fpl_chips: { upserted: 0, error: null },
  };

  try {
    // ── 1. Fetch bootstrap-static from FPL API ──────────────────────────────
    console.log("[sync-fpl-reference-data] Fetching bootstrap-static...");
    const fplRes = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; FPLKinoHub/1.0; +https://fpl-kino-hub.vercel.app)",
        },
      },
    );

    if (!fplRes.ok) {
      throw new Error(
        `FPL API returned ${fplRes.status}: ${fplRes.statusText}`,
      );
    }

    const bootstrap: BootstrapStaticResponse = await fplRes.json();
    console.log(
      `[sync-fpl-reference-data] Fetched: ${bootstrap.teams?.length ?? 0} teams, ` +
        `${bootstrap.element_types?.length ?? 0} element_types, ` +
        `${bootstrap.phases?.length ?? 0} phases, ` +
        `${bootstrap.chips?.length ?? 0} chips`,
    );

    // ── 2. UPSERT fpl_teams ─────────────────────────────────────────────────
    // PK: team_id
    // API field → DB column:
    //   id → team_id, name → team_name, short_name, code, strength,
    //   strength_overall_home/away, strength_attack_home/away,
    //   strength_defence_home/away, pulse_id
    {
      const rows = (bootstrap.teams ?? []).map((t: ApiTeam) => ({
        team_id: t.id,
        team_name: t.name,
        short_name: t.short_name,
        code: t.code,
        strength: t.strength ?? null,
        strength_overall_home: t.strength_overall_home,
        strength_overall_away: t.strength_overall_away,
        strength_attack_home: t.strength_attack_home,
        strength_attack_away: t.strength_attack_away,
        strength_defence_home: t.strength_defence_home,
        strength_defence_away: t.strength_defence_away,
        pulse_id: t.pulse_id,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("fpl_teams")
        .upsert(rows, { onConflict: "team_id" });

      if (error) {
        console.error("[sync-fpl-reference-data] fpl_teams error:", error);
        results.fpl_teams.error = error.message;
      } else {
        results.fpl_teams.upserted = rows.length;
        console.log(`[sync-fpl-reference-data] fpl_teams: upserted ${rows.length} rows`);
      }
    }

    // ── 3. UPSERT fpl_element_types ─────────────────────────────────────────
    // PK: element_type_id
    // API field → DB column:
    //   id → element_type_id, singular_name, singular_name_short,
    //   plural_name, plural_name_short, squad_select, squad_min_play,
    //   squad_max_play, ui_shirt_specific
    {
      const rows = (bootstrap.element_types ?? []).map((et: ApiElementType) => ({
        element_type_id: et.id,
        singular_name: et.singular_name,
        singular_name_short: et.singular_name_short,
        plural_name: et.plural_name,
        plural_name_short: et.plural_name_short,
        squad_select: et.squad_select ?? null,
        squad_min_play: et.squad_min_play ?? null,
        squad_max_play: et.squad_max_play ?? null,
        ui_shirt_specific: et.ui_shirt_specific,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("fpl_element_types")
        .upsert(rows, { onConflict: "element_type_id" });

      if (error) {
        console.error("[sync-fpl-reference-data] fpl_element_types error:", error);
        results.fpl_element_types.error = error.message;
      } else {
        results.fpl_element_types.upserted = rows.length;
        console.log(
          `[sync-fpl-reference-data] fpl_element_types: upserted ${rows.length} rows`,
        );
      }
    }

    // ── 4. UPSERT fpl_phases ────────────────────────────────────────────────
    // PK: phase_id
    // API field → DB column:
    //   id → phase_id, name, start_event, stop_event, highest_score
    // Note: highest_scoring_entry is NOT in bootstrap phases — leave as-is (no update).
    {
      const rows = (bootstrap.phases ?? []).map((p: ApiPhase) => ({
        phase_id: p.id,
        name: p.name,
        start_event: p.start_event,
        stop_event: p.stop_event,
        highest_score: p.highest_score ?? null,
        // highest_scoring_entry intentionally omitted — not available from bootstrap phases
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("fpl_phases")
        .upsert(rows, { onConflict: "phase_id" });

      if (error) {
        console.error("[sync-fpl-reference-data] fpl_phases error:", error);
        results.fpl_phases.error = error.message;
      } else {
        results.fpl_phases.upserted = rows.length;
        console.log(`[sync-fpl-reference-data] fpl_phases: upserted ${rows.length} rows`);
      }
    }

    // ── 5. UPSERT fpl_chips ─────────────────────────────────────────────────
    // PK: chip_id
    // API field → DB column:
    //   id → chip_id, name, number, start_event, stop_event, chip_type
    {
      const rows = (bootstrap.chips ?? []).map((c: ApiChip) => ({
        chip_id: c.id,
        name: c.name,
        number: c.number,
        start_event: c.start_event,
        stop_event: c.stop_event,
        chip_type: c.chip_type,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("fpl_chips")
        .upsert(rows, { onConflict: "chip_id" });

      if (error) {
        console.error("[sync-fpl-reference-data] fpl_chips error:", error);
        results.fpl_chips.error = error.message;
      } else {
        results.fpl_chips.upserted = rows.length;
        console.log(`[sync-fpl-reference-data] fpl_chips: upserted ${rows.length} rows`);
      }
    }

    // ── 6. Build summary ────────────────────────────────────────────────────
    const errors = Object.entries(results)
      .filter(([, v]) => v.error !== null)
      .map(([table, v]) => ({ table, error: v.error }));

    const allSuccess = errors.length === 0;

    console.log(
      `[sync-fpl-reference-data] Done. Success: ${allSuccess}. Results:`,
      JSON.stringify(results),
    );

    return jsonResponse({
      success: allSuccess,
      message: allSuccess
        ? "All 4 reference tables synced successfully."
        : `Completed with ${errors.length} error(s). See 'results' for details.`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sync-fpl-reference-data] Fatal error:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
});
