import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── CORS HEADERS ─────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// ─── DETECTOR REGISTRY (ALL 28 CANONICAL DETECTORS) ───────────────────────────
export interface DetectorDefinition {
  id: string;
  name: string;
  category: string;
  status: "MVP_ENABLED" | "FUTURE_DISABLED";
  isMvp: boolean;
}

export const DETECTOR_REGISTRY: DetectorDefinition[] = [
  // Category 1: Performance Stories (3)
  { id: "DET_PERF_WEEKLY_CHAMPION", name: "Manager of the Week", category: "Performance Stories", status: "MVP_ENABLED", isMvp: true },
  { id: "DET_PERF_WEEKLY_FLOOR", name: "Gameweek Disaster / Floor Score", category: "Performance Stories", status: "MVP_ENABLED", isMvp: true },
  { id: "DET_PERF_LEAGUE_OUTLIER", name: "League Outlier", category: "Performance Stories", status: "MVP_ENABLED", isMvp: true },
  
  // Category 2: Ranking Drama (4)
  { id: "DET_RANK_TITLE_CHANGE", name: "Title Race Shift / New League Leader", category: "Ranking Drama", status: "MVP_ENABLED", isMvp: true },
  { id: "DET_RANK_FREEFALL", name: "Freefall Warning / Biggest Rank Drop", category: "Ranking Drama", status: "MVP_ENABLED", isMvp: true },
  { id: "DET_RANK_CLIMBER", name: "Climber of the Week / Biggest Rank Gain", category: "Ranking Drama", status: "MVP_ENABLED", isMvp: true },
  { id: "DET_RANK_CUTOFF_DANGER", name: "Cup Cutoff Battle / Qualification Edge", category: "Ranking Drama", status: "FUTURE_DISABLED", isMvp: false },

  // Category 3: Bench Disasters (3)
  { id: "DET_BENCH_EXPLOSION", name: "Benched Explosion / High Bench Score", category: "Bench Disasters", status: "MVP_ENABLED", isMvp: true },
  { id: "DET_BENCH_OUTSCORES_STARTERS", name: "Bench Beats Starters", category: "Bench Disasters", status: "FUTURE_DISABLED", isMvp: false },
  { id: "DET_BENCH_GK_DILEMMA", name: "Goalkeeper Bench Regret", category: "Bench Disasters", status: "FUTURE_DISABLED", isMvp: false },

  // Category 4: Captain Drama (3)
  { id: "DET_CAPT_MASTERCLASS", name: "Captain Masterclass / Explosive Captain", category: "Captain Drama", status: "FUTURE_DISABLED", isMvp: false },
  { id: "DET_CAPT_BLANK_DISASTER", name: "Captain Blank / Vice-Captain Betrayal", category: "Captain Drama", status: "MVP_ENABLED", isMvp: true },
  { id: "DET_CAPT_DIFFERENTIAL_HERO", name: "Differential Captain Hero", category: "Captain Drama", status: "FUTURE_DISABLED", isMvp: false },

  // Category 5: Transfer Stories (3)
  { id: "DET_XFER_MASTERSTROKE", name: "Masterstroke Transfer / Instant Haul", category: "Transfer Stories", status: "MVP_ENABLED", isMvp: true },
  { id: "DET_XFER_NIGHTMARE", name: "Transfer Nightmare / Red Card / Injury", category: "Transfer Stories", status: "MVP_ENABLED", isMvp: true },
  { id: "DET_XFER_HIT_GAMBIT", name: "Points Hit Gambit / Heavy Hit ROI", category: "Transfer Stories", status: "MVP_ENABLED", isMvp: true },

  // Category 6: Chip Stories (3)
  { id: "DET_CHIP_BENCH_BOOST_RESULT", name: "Bench Boost Activation & Impact", category: "Chip Stories", status: "FUTURE_DISABLED", isMvp: false },
  { id: "DET_CHIP_FREE_HIT_DELTA", name: "Free Hit Delta Score", category: "Chip Stories", status: "FUTURE_DISABLED", isMvp: false },
  { id: "DET_CHIP_WILDCARD_IMPACT", name: "Wildcard Debut Performance", category: "Chip Stories", status: "FUTURE_DISABLED", isMvp: false },

  // Category 7: Rivalry Stories (2)
  { id: "DET_RIVAL_DERBY_CLASH", name: "H2H Derby Clash", category: "Rivalry Stories", status: "FUTURE_DISABLED", isMvp: false },
  { id: "DET_RIVAL_PHOTO_FINISH", name: "Photo Finish / 1-Point Margin", category: "Rivalry Stories", status: "FUTURE_DISABLED", isMvp: false },

  // Category 8: Historical Stories (2)
  { id: "DET_HIST_ALLTIME_HIGH", name: "All-Time League High Score Record", category: "Historical Stories", status: "FUTURE_DISABLED", isMvp: false },
  { id: "DET_HIST_STREAK_MASTER", name: "Consistency Streak", category: "Historical Stories", status: "FUTURE_DISABLED", isMvp: false },

  // Category 9: Fun Facts (2)
  { id: "DET_FUN_UNUSUAL_FORMATION", name: "Tactical Oddity / Unusual Formation", category: "Fun Facts", status: "FUTURE_DISABLED", isMvp: false },
  { id: "DET_FUN_AUTOSUB_MIRACLE", name: "Auto-Sub Miracle", category: "Fun Facts", status: "FUTURE_DISABLED", isMvp: false },

  // Category 10: Rare / Insane Events (3)
  { id: "DET_RARE_CLEANSHEET_SWEEP", name: "Clean Sheet Wall / Defense Masterclass", category: "Rare / Insane Events", status: "FUTURE_DISABLED", isMvp: false },
  { id: "DET_RARE_RED_CARD_PARTY", name: "Red Card Catastrophe", category: "Rare / Insane Events", status: "FUTURE_DISABLED", isMvp: false },
  { id: "DET_RARE_MIRROR_SCORE", name: "Mirror Score / Identical GW Points", category: "Rare / Insane Events", status: "FUTURE_DISABLED", isMvp: false },
];

// ─── INTERFACES ───────────────────────────────────────────────────────────────
interface StoryCandidate {
  cluster_key: string;
  story_type: string;
  story_category: string;
  primary_detector: string;
  primary_manager_id: number;
  involved_managers_json: number[];
  involved_players_json: number[];
  triggered_detectors_json: string[];
  verified_fact_sheet_json: Record<string, any>;
  fpl_source_references_json: Record<string, any>;
  recommended_tier: string;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse Request Body
    let body: { gw_number?: number } = {};
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch (_e) {
        // empty body ok
      }
    }

    // Determine target Gameweek
    let targetGw = body.gw_number;
    if (!targetGw) {
      // Fetch latest completed GW or max GW from manager_gameweek_stats
      const { data: maxGwData } = await supabase
        .from("manager_gameweek_stats")
        .select("gw_number")
        .order("gw_number", { ascending: false })
        .limit(1);

      if (maxGwData && maxGwData.length > 0) {
        targetGw = maxGwData[0].gw_number;
      } else {
        targetGw = 1;
      }
    }

    console.log(`[generate-newsletter-stories] Processing Gameweek ${targetGw}...`);

    // ─── 1. FETCH RAW FPL DATA ────────────────────────────────────────────────
    // Managers lookup map
    const { data: managersData, error: managersErr } = await supabase
      .from("managers")
      .select("manager_id, team_name, manager_name");

    if (managersErr) throw new Error(`Failed to fetch managers: ${managersErr.message}`);

    const managerMap = new Map<number, { team_name: string; manager_name: string }>();
    (managersData || []).forEach((m) => {
      managerMap.set(m.manager_id, {
        team_name: m.team_name,
        manager_name: m.manager_name,
      });
    });

    // Current GW Stats
    const { data: currStatsData, error: currStatsErr } = await supabase
      .from("manager_gameweek_stats")
      .select("*")
      .eq("gw_number", targetGw);

    if (currStatsErr) throw new Error(`Failed to fetch current GW stats: ${currStatsErr.message}`);
    if (!currStatsData || currStatsData.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `No manager stats found for GW${targetGw}. Make sure sync has completed.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Previous GW Stats (if targetGw > 1)
    let prevStatsData: any[] = [];
    if (targetGw > 1) {
      const { data: prevData } = await supabase
        .from("manager_gameweek_stats")
        .select("*")
        .eq("gw_number", targetGw - 1);
      prevStatsData = prevData || [];
    }

    // Picks for Current GW
    const { data: picksData, error: picksErr } = await supabase
      .from("manager_gameweek_picks")
      .select("manager_id, gw_number, player_id, position, multiplier, is_captain, is_vice_captain")
      .eq("gw_number", targetGw);

    if (picksErr) console.warn("Picks fetch warning:", picksErr.message);

    // Transfers for Current GW
    const { data: transfersData, error: transfersErr } = await supabase
      .from("manager_transfers")
      .select("manager_id, gw_number, player_in_id, player_out_id, transfer_time")
      .eq("gw_number", targetGw);

    if (transfersErr) console.warn("Transfers fetch warning:", transfersErr.message);

    // Players lookup
    const { data: playersData, error: playersErr } = await supabase
      .from("fpl_players")
      .select("player_id, web_name, first_name, second_name, event_points, red_cards, minutes, own_goals, penalties_missed, element_type");

    if (playersErr) console.warn("Players fetch warning:", playersErr.message);

    const playerMap = new Map<number, any>();
    (playersData || []).forEach((p) => {
      playerMap.set(p.player_id, p);
    });

    // ─── 2. CALCULATE KINO LEAGUE INTERNAL STANDINGS ──────────────────────────
    // Kino Participant Count
    const kinoParticipantCount = currStatsData.length;

    // Kino League Current GW Internal Standings (Deterministic sort: total_points DESC, manager_id ASC)
    const currKinoStandings = [...currStatsData].sort((a, b) => {
      if (b.total_points !== a.total_points) return b.total_points - a.total_points;
      return a.manager_id - b.manager_id;
    });

    const currKinoRankMap = new Map<number, number>();
    currKinoStandings.forEach((item, index) => {
      currKinoRankMap.set(item.manager_id, index + 1);
    });

    // Kino League Previous GW Internal Standings
    const prevKinoStandings = [...prevStatsData].sort((a, b) => {
      if (b.total_points !== a.total_points) return b.total_points - a.total_points;
      return a.manager_id - b.manager_id;
    });

    const prevKinoRankMap = new Map<number, number>();
    prevKinoStandings.forEach((item, index) => {
      prevKinoRankMap.set(item.manager_id, index + 1);
    });

    // Kino League Average GW Points
    const totalGwPoints = currStatsData.reduce((acc, curr) => acc + (curr.points || 0), 0);
    const leagueAveragePoints = Number((totalGwPoints / kinoParticipantCount).toFixed(2));

    // ─── 3. EXECUTE 11 MVP DETECTORS ──────────────────────────────────────────
    const candidates: StoryCandidate[] = [];

    // --- DETECTOR 1: DET_PERF_WEEKLY_CHAMPION ---
    const maxPoints = Math.max(...currStatsData.map((s) => s.points || 0));
    const champions = currStatsData.filter((s) => (s.points || 0) === maxPoints);
    const championTieCount = champions.length;

    champions.forEach((champ) => {
      const mInfo = managerMap.get(champ.manager_id);
      candidates.push({
        cluster_key: `GW${targetGw}_DET_PERF_WEEKLY_CHAMPION_${champ.manager_id}`,
        story_type: "WEEKLY_CHAMPION",
        story_category: "Performance Stories",
        primary_detector: "DET_PERF_WEEKLY_CHAMPION",
        primary_manager_id: champ.manager_id,
        involved_managers_json: [champ.manager_id],
        involved_players_json: [],
        triggered_detectors_json: ["DET_PERF_WEEKLY_CHAMPION"],
        verified_fact_sheet_json: {
          gw_number: targetGw,
          manager_id: champ.manager_id,
          manager_name: mInfo?.manager_name || "Unknown",
          team_name: mInfo?.team_name || "Unknown",
          gw_points: champ.points,
          total_points: champ.total_points,
          kino_weekly_rank: 1,
          kino_participant_count: kinoParticipantCount,
          tie_count: championTieCount,
          is_tie: championTieCount > 1,
        },
        fpl_source_references_json: {
          table: "manager_gameweek_stats",
          manager_id: champ.manager_id,
          gw_number: targetGw,
        },
        recommended_tier: "TIER 1",
      });
    });

    // --- DETECTOR 2: DET_PERF_WEEKLY_FLOOR ---
    const minPoints = Math.min(...currStatsData.map((s) => s.points || 0));
    const floorManagers = currStatsData.filter((s) => (s.points || 0) === minPoints);
    const floorTieCount = floorManagers.length;

    floorManagers.forEach((floorM) => {
      const mInfo = managerMap.get(floorM.manager_id);
      candidates.push({
        cluster_key: `GW${targetGw}_DET_PERF_WEEKLY_FLOOR_${floorM.manager_id}`,
        story_type: "WEEKLY_FLOOR",
        story_category: "Performance Stories",
        primary_detector: "DET_PERF_WEEKLY_FLOOR",
        primary_manager_id: floorM.manager_id,
        involved_managers_json: [floorM.manager_id],
        involved_players_json: [],
        triggered_detectors_json: ["DET_PERF_WEEKLY_FLOOR"],
        verified_fact_sheet_json: {
          gw_number: targetGw,
          manager_id: floorM.manager_id,
          manager_name: mInfo?.manager_name || "Unknown",
          team_name: mInfo?.team_name || "Unknown",
          gw_points: floorM.points,
          total_points: floorM.total_points,
          kino_weekly_floor_rank: kinoParticipantCount,
          kino_participant_count: kinoParticipantCount,
          tie_count: floorTieCount,
          is_tie: floorTieCount > 1,
        },
        fpl_source_references_json: {
          table: "manager_gameweek_stats",
          manager_id: floorM.manager_id,
          gw_number: targetGw,
        },
        recommended_tier: "TIER 2",
      });
    });

    // --- DETECTOR 3: DET_PERF_LEAGUE_OUTLIER ---
    // Rule: points >= league_average_points + 25
    currStatsData.forEach((s) => {
      const pts = s.points || 0;
      if (pts >= leagueAveragePoints + 25) {
        const mInfo = managerMap.get(s.manager_id);
        const delta = Number((pts - leagueAveragePoints).toFixed(2));
        candidates.push({
          cluster_key: `GW${targetGw}_DET_PERF_LEAGUE_OUTLIER_${s.manager_id}`,
          story_type: "LEAGUE_OUTLIER",
          story_category: "Performance Stories",
          primary_detector: "DET_PERF_LEAGUE_OUTLIER",
          primary_manager_id: s.manager_id,
          involved_managers_json: [s.manager_id],
          involved_players_json: [],
          triggered_detectors_json: ["DET_PERF_LEAGUE_OUTLIER"],
          verified_fact_sheet_json: {
            gw_number: targetGw,
            manager_id: s.manager_id,
            manager_name: mInfo?.manager_name || "Unknown",
            team_name: mInfo?.team_name || "Unknown",
            gw_points: pts,
            league_average_points: leagueAveragePoints,
            outlier_delta: delta,
            threshold: 25,
            kino_participant_count: kinoParticipantCount,
          },
          fpl_source_references_json: {
            table: "manager_gameweek_stats",
            manager_id: s.manager_id,
            gw_number: targetGw,
          },
          recommended_tier: "TIER 2",
        });
      }
    });

    // --- DETECTOR 4: DET_RANK_TITLE_CHANGE ---
    if (targetGw > 1 && prevKinoStandings.length > 0 && currKinoStandings.length > 0) {
      const prevLeader = prevKinoStandings[0];
      const currLeader = currKinoStandings[0];

      if (prevLeader.manager_id !== currLeader.manager_id) {
        const currLeaderInfo = managerMap.get(currLeader.manager_id);
        const prevLeaderInfo = managerMap.get(prevLeader.manager_id);
        const gap = currLeader.total_points - prevLeader.total_points;

        candidates.push({
          cluster_key: `GW${targetGw}_DET_RANK_TITLE_CHANGE_${currLeader.manager_id}`,
          story_type: "TITLE_CHANGE",
          story_category: "Ranking Drama",
          primary_detector: "DET_RANK_TITLE_CHANGE",
          primary_manager_id: currLeader.manager_id,
          involved_managers_json: [currLeader.manager_id, prevLeader.manager_id],
          involved_players_json: [],
          triggered_detectors_json: ["DET_RANK_TITLE_CHANGE"],
          verified_fact_sheet_json: {
            gw_number: targetGw,
            new_leader_id: currLeader.manager_id,
            new_leader_name: currLeaderInfo?.manager_name || "Unknown",
            new_leader_team: currLeaderInfo?.team_name || "Unknown",
            new_leader_total_points: currLeader.total_points,
            new_leader_gw_points: currLeader.points,
            prev_leader_id: prevLeader.manager_id,
            prev_leader_name: prevLeaderInfo?.manager_name || "Unknown",
            prev_leader_team: prevLeaderInfo?.team_name || "Unknown",
            prev_leader_total_points: prevLeader.total_points,
            prev_leader_gw_points: prevLeader.points,
            point_gap: gap,
            kino_participant_count: kinoParticipantCount,
          },
          fpl_source_references_json: {
            table: "manager_gameweek_stats",
            new_leader_id: currLeader.manager_id,
            prev_leader_id: prevLeader.manager_id,
            gw_number: targetGw,
          },
          recommended_tier: "TIER 1",
        });
      }
    }

    // --- DETECTOR 5: DET_RANK_FREEFALL & DETECTOR 6: DET_RANK_CLIMBER ---
    if (targetGw > 1 && prevKinoRankMap.size > 0) {
      currStatsData.forEach((s) => {
        const currRank = currKinoRankMap.get(s.manager_id);
        const prevRank = prevKinoRankMap.get(s.manager_id);

        if (currRank && prevRank) {
          // Freefall: rank_drop = currRank - prevRank >= 5
          const rankDrop = currRank - prevRank;
          if (rankDrop >= 5) {
            const mInfo = managerMap.get(s.manager_id);
            candidates.push({
              cluster_key: `GW${targetGw}_DET_RANK_FREEFALL_${s.manager_id}`,
              story_type: "RANK_FREEFALL",
              story_category: "Ranking Drama",
              primary_detector: "DET_RANK_FREEFALL",
              primary_manager_id: s.manager_id,
              involved_managers_json: [s.manager_id],
              involved_players_json: [],
              triggered_detectors_json: ["DET_RANK_FREEFALL"],
              verified_fact_sheet_json: {
                gw_number: targetGw,
                manager_id: s.manager_id,
                manager_name: mInfo?.manager_name || "Unknown",
                team_name: mInfo?.team_name || "Unknown",
                prev_rank: prevRank,
                curr_rank: currRank,
                positions_dropped: rankDrop,
                gw_points: s.points,
                total_points: s.total_points,
                kino_participant_count: kinoParticipantCount,
              },
              fpl_source_references_json: {
                table: "manager_gameweek_stats",
                manager_id: s.manager_id,
                gw_number: targetGw,
              },
              recommended_tier: "TIER 2",
            });
          }

          // Climber: rank_gain = prevRank - currRank >= 5
          const rankGain = prevRank - currRank;
          if (rankGain >= 5) {
            const mInfo = managerMap.get(s.manager_id);
            candidates.push({
              cluster_key: `GW${targetGw}_DET_RANK_CLIMBER_${s.manager_id}`,
              story_type: "RANK_CLIMBER",
              story_category: "Ranking Drama",
              primary_detector: "DET_RANK_CLIMBER",
              primary_manager_id: s.manager_id,
              involved_managers_json: [s.manager_id],
              involved_players_json: [],
              triggered_detectors_json: ["DET_RANK_CLIMBER"],
              verified_fact_sheet_json: {
                gw_number: targetGw,
                manager_id: s.manager_id,
                manager_name: mInfo?.manager_name || "Unknown",
                team_name: mInfo?.team_name || "Unknown",
                prev_rank: prevRank,
                curr_rank: currRank,
                positions_gained: rankGain,
                gw_points: s.points,
                total_points: s.total_points,
                kino_participant_count: kinoParticipantCount,
              },
              fpl_source_references_json: {
                table: "manager_gameweek_stats",
                manager_id: s.manager_id,
                gw_number: targetGw,
              },
              recommended_tier: "TIER 2",
            });
          }
        }
      });
    }

    // --- DETECTOR 7: DET_BENCH_EXPLOSION ---
    // Rule: multiplier = 0 AND event_points >= 10
    if (picksData && picksData.length > 0) {
      picksData.forEach((pick) => {
        if (pick.multiplier === 0) {
          const player = playerMap.get(pick.player_id);
          const pts = player?.event_points || 0;
          if (pts >= 10) {
            const mInfo = managerMap.get(pick.manager_id);
            candidates.push({
              cluster_key: `GW${targetGw}_DET_BENCH_EXPLOSION_${pick.manager_id}_${pick.player_id}`,
              story_type: "BENCH_EXPLOSION",
              story_category: "Bench Disasters",
              primary_detector: "DET_BENCH_EXPLOSION",
              primary_manager_id: pick.manager_id,
              involved_managers_json: [pick.manager_id],
              involved_players_json: [pick.player_id],
              triggered_detectors_json: ["DET_BENCH_EXPLOSION"],
              verified_fact_sheet_json: {
                gw_number: targetGw,
                manager_id: pick.manager_id,
                manager_name: mInfo?.manager_name || "Unknown",
                team_name: mInfo?.team_name || "Unknown",
                player_id: pick.player_id,
                player_name: player?.web_name || "Unknown Player",
                player_event_points: pts,
                bench_position: pick.position,
              },
              fpl_source_references_json: {
                table: "manager_gameweek_picks",
                manager_id: pick.manager_id,
                player_id: pick.player_id,
                gw_number: targetGw,
              },
              recommended_tier: "TIER 2",
            });
          }
        }
      });
    }

    // --- DETECTOR 8: DET_CAPT_BLANK_DISASTER ---
    // Rule: captain raw points <= 2 AND vice captain raw points >= 10
    if (picksData && picksData.length > 0) {
      // Group picks by manager
      const managerPicksMap = new Map<number, any[]>();
      picksData.forEach((p) => {
        if (!managerPicksMap.has(p.manager_id)) {
          managerPicksMap.set(p.manager_id, []);
        }
        managerPicksMap.get(p.manager_id)!.push(p);
      });

      managerPicksMap.forEach((mPicks, managerId) => {
        const captainPick = mPicks.find((p) => p.is_captain);
        const vicePick = mPicks.find((p) => p.is_vice_captain);

        if (captainPick && vicePick) {
          const captPlayer = playerMap.get(captainPick.player_id);
          const vicePlayer = playerMap.get(vicePick.player_id);

          const captRawPts = captPlayer?.event_points || 0;
          const viceRawPts = vicePlayer?.event_points || 0;

          if (captRawPts <= 2 && viceRawPts >= 10) {
            const mInfo = managerMap.get(managerId);
            candidates.push({
              cluster_key: `GW${targetGw}_DET_CAPT_BLANK_DISASTER_${managerId}`,
              story_type: "CAPTAIN_BLANK_DISASTER",
              story_category: "Captain Drama",
              primary_detector: "DET_CAPT_BLANK_DISASTER",
              primary_manager_id: managerId,
              involved_managers_json: [managerId],
              involved_players_json: [captainPick.player_id, vicePick.player_id],
              triggered_detectors_json: ["DET_CAPT_BLANK_DISASTER"],
              verified_fact_sheet_json: {
                gw_number: targetGw,
                manager_id: managerId,
                manager_name: mInfo?.manager_name || "Unknown",
                team_name: mInfo?.team_name || "Unknown",
                captain_id: captainPick.player_id,
                captain_name: captPlayer?.web_name || "Unknown",
                captain_raw_points: captRawPts,
                vice_captain_id: vicePick.player_id,
                vice_captain_name: vicePlayer?.web_name || "Unknown",
                vice_captain_raw_points: viceRawPts,
              },
              fpl_source_references_json: {
                table: "manager_gameweek_picks",
                manager_id: managerId,
                gw_number: targetGw,
              },
              recommended_tier: "TIER 2",
            });
          }
        }
      });
    }

    // --- DETECTOR 9: DET_XFER_MASTERSTROKE & DETECTOR 10: DET_XFER_NIGHTMARE ---
    if (transfersData && transfersData.length > 0) {
      transfersData.forEach((xfer) => {
        if (xfer.player_in_id) {
          const pIn = playerMap.get(xfer.player_in_id);
          const pts = pIn?.event_points || 0;
          const redCards = pIn?.red_cards || 0;
          const minutes = pIn?.minutes || 0;
          const ownGoals = pIn?.own_goals || 0;
          const penMissed = pIn?.penalties_missed || 0;
          const mInfo = managerMap.get(xfer.manager_id);

          // Masterstroke: transferred-in player event_points >= 10
          if (pts >= 10) {
            candidates.push({
              cluster_key: `GW${targetGw}_DET_XFER_MASTERSTROKE_${xfer.manager_id}_${xfer.player_in_id}`,
              story_type: "XFER_MASTERSTROKE",
              story_category: "Transfer Stories",
              primary_detector: "DET_XFER_MASTERSTROKE",
              primary_manager_id: xfer.manager_id,
              involved_managers_json: [xfer.manager_id],
              involved_players_json: [xfer.player_in_id],
              triggered_detectors_json: ["DET_XFER_MASTERSTROKE"],
              verified_fact_sheet_json: {
                gw_number: targetGw,
                manager_id: xfer.manager_id,
                manager_name: mInfo?.manager_name || "Unknown",
                team_name: mInfo?.team_name || "Unknown",
                player_id: xfer.player_in_id,
                player_name: pIn?.web_name || "Unknown",
                event_points: pts,
              },
              fpl_source_references_json: {
                table: "manager_transfers",
                manager_id: xfer.manager_id,
                player_in_id: xfer.player_in_id,
                gw_number: targetGw,
              },
              recommended_tier: "TIER 2",
            });
          }

          // Nightmare: redCards > 0 OR negative points (<0) OR played (>0 min) with zero points & disaster stats
          const isRedCardDisaster = redCards > 0;
          const isNegativePointsDisaster = pts < 0;
          const isDisastrousZeroPts = minutes > 0 && pts <= 0 && (ownGoals > 0 || penMissed > 0);

          if (isRedCardDisaster || isNegativePointsDisaster || isDisastrousZeroPts) {
            let disasterType = "NEGATIVE_POINTS";
            if (isRedCardDisaster) disasterType = "RED_CARD";
            else if (isDisastrousZeroPts) disasterType = "OWN_GOAL_OR_PENALTY_MISS";

            candidates.push({
              cluster_key: `GW${targetGw}_DET_XFER_NIGHTMARE_${xfer.manager_id}_${xfer.player_in_id}`,
              story_type: "XFER_NIGHTMARE",
              story_category: "Transfer Stories",
              primary_detector: "DET_XFER_NIGHTMARE",
              primary_manager_id: xfer.manager_id,
              involved_managers_json: [xfer.manager_id],
              involved_players_json: [xfer.player_in_id],
              triggered_detectors_json: ["DET_XFER_NIGHTMARE"],
              verified_fact_sheet_json: {
                gw_number: targetGw,
                manager_id: xfer.manager_id,
                manager_name: mInfo?.manager_name || "Unknown",
                team_name: mInfo?.team_name || "Unknown",
                player_id: xfer.player_in_id,
                player_name: pIn?.web_name || "Unknown",
                event_points: pts,
                red_cards: redCards,
                own_goals: ownGoals,
                penalties_missed: penMissed,
                minutes: minutes,
                disaster_type: disasterType,
              },
              fpl_source_references_json: {
                table: "manager_transfers",
                manager_id: xfer.manager_id,
                player_in_id: xfer.player_in_id,
                gw_number: targetGw,
              },
              recommended_tier: "TIER 2",
            });
          }
        }
      });
    }

    // --- DETECTOR 11: DET_XFER_HIT_GAMBIT ---
    // Rule: event_transfers_cost > 0
    currStatsData.forEach((s) => {
      const hitCost = s.event_transfers_cost || 0;
      if (hitCost > 0) {
        const mInfo = managerMap.get(s.manager_id);
        const mTransfers = (transfersData || []).filter((t) => t.manager_id === s.manager_id);

        let ptsIn = 0;
        let ptsOut = 0;
        const playersInList: number[] = [];
        const playersOutList: number[] = [];

        mTransfers.forEach((t) => {
          if (t.player_in_id) {
            playersInList.push(t.player_in_id);
            const pIn = playerMap.get(t.player_in_id);
            ptsIn += pIn?.event_points || 0;
          }
          if (t.player_out_id) {
            playersOutList.push(t.player_out_id);
            const pOut = playerMap.get(t.player_out_id);
            ptsOut += pOut?.event_points || 0;
          }
        });

        const netOutcome = ptsIn - ptsOut - hitCost;

        candidates.push({
          cluster_key: `GW${targetGw}_DET_XFER_HIT_GAMBIT_${s.manager_id}`,
          story_type: "XFER_HIT_GAMBIT",
          story_category: "Transfer Stories",
          primary_detector: "DET_XFER_HIT_GAMBIT",
          primary_manager_id: s.manager_id,
          involved_managers_json: [s.manager_id],
          involved_players_json: [...playersInList, ...playersOutList],
          triggered_detectors_json: ["DET_XFER_HIT_GAMBIT"],
          verified_fact_sheet_json: {
            gw_number: targetGw,
            manager_id: s.manager_id,
            manager_name: mInfo?.manager_name || "Unknown",
            team_name: mInfo?.team_name || "Unknown",
            hit_cost: hitCost,
            transfer_count: mTransfers.length || Math.abs(hitCost / 4),
            points_in: ptsIn,
            points_out: ptsOut,
            net_transfer_outcome: netOutcome,
            is_profitable: netOutcome > 0,
          },
          fpl_source_references_json: {
            table: "manager_gameweek_stats",
            manager_id: s.manager_id,
            gw_number: targetGw,
          },
          recommended_tier: "TIER 2",
        });
      }
    });

    console.log(`[generate-newsletter-stories] Total candidates detected: ${candidates.length}`);

    // ─── 4. PERSIST CANDIDATES TO newsletter_story_clusters (IDEMPOTENT) ──────
    let savedCount = 0;

    for (const c of candidates) {
      // Check if cluster_key already exists for this gw_number
      const { data: existingRecords } = await supabase
        .from("newsletter_story_clusters")
        .select("id")
        .eq("gw_number", targetGw)
        .eq("cluster_key", c.cluster_key)
        .limit(1);

      const recordPayload = {
        gw_number: targetGw,
        cluster_key: c.cluster_key,
        story_type: c.story_type,
        story_category: c.story_category,
        primary_manager_id: c.primary_manager_id,
        impact_score: 0,
        rarity_score: 0,
        drama_score: 0,
        historical_context_score: 0,
        rivalry_score: 0,
        entertainment_score: 0,
        recommended_tier: c.recommended_tier,
        processing_status: "DETECTED",
        involved_managers_json: c.involved_managers_json,
        involved_players_json: c.involved_players_json,
        triggered_detectors_json: c.triggered_detectors_json,
        verified_fact_sheet_json: c.verified_fact_sheet_json,
        fpl_source_references_json: c.fpl_source_references_json,
        updated_at: new Date().toISOString(),
      };

      if (existingRecords && existingRecords.length > 0) {
        // UPDATE existing record for idempotency
        const { error: updateErr } = await supabase
          .from("newsletter_story_clusters")
          .update(recordPayload)
          .eq("id", existingRecords[0].id);

        if (!updateErr) savedCount++;
        else console.warn(`Update error for ${c.cluster_key}:`, updateErr.message);
      } else {
        // INSERT new record
        const { error: insertErr } = await supabase
          .from("newsletter_story_clusters")
          .insert({
            ...recordPayload,
            created_at: new Date().toISOString(),
          });

        if (!insertErr) savedCount++;
        else console.warn(`Insert error for ${c.cluster_key}:`, insertErr.message);
      }
    }

    // ─── 5. SUMMARY BY DETECTOR ───────────────────────────────────────────────
    const summaryByDetector: Record<string, number> = {};
    candidates.forEach((c) => {
      summaryByDetector[c.primary_detector] = (summaryByDetector[c.primary_detector] || 0) + 1;
    });

    return new Response(
      JSON.stringify({
        success: true,
        gw_number: targetGw,
        kino_participant_count: kinoParticipantCount,
        league_average_points: leagueAveragePoints,
        enabled_detectors_count: 11,
        future_disabled_detectors_count: 17,
        total_candidates_detected: candidates.length,
        total_candidates_saved: savedCount,
        summary_by_detector: summaryByDetector,
        candidates: candidates.map((c) => ({
          detector: c.primary_detector,
          story_type: c.story_type,
          manager_id: c.primary_manager_id,
          fact_sheet: c.verified_fact_sheet_json,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err: any) {
    console.error("[generate-newsletter-stories] Internal Error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "Internal server error",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
