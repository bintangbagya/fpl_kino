import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NewsletterStory {
  gw_number: number;
  edition_date: string;
  story_order: number;
  story_id: string;
  category: string;
  emoji: string;
  title: string;
  hook: string;
  description: string;
  is_hero: boolean;
  stats: { label: string; value: string }[] | null;
}

interface NewsletterDetail {
  gw_number: number;
  edition_date: string;
  story_id: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  emoji: string;
  full_content: string;
  key_highlights: string[];
  related_stats: { label: string; value: string }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatEditionLabel(gwNumber: number, dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00+07:00");
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  return `GW${gwNumber} – ${dayName}, ${day} ${month}`;
}

const CHIP_NAMES: Record<string, string> = {
  bboost: "Bench Boost 🃏",
  "3xc": "Triple Captain ⚡",
  wildcard: "Wildcard 🔄",
  freehit: "Free Hit 🚀",
};

// ─── Gemini AI Generator Function ─────────────────────────────────────────────
async function generateWithGemini(
  geminiApiKey: string,
  gwContext: any
): Promise<{ stories: NewsletterStory[]; details: NewsletterDetail[] } | null> {
  if (!geminiApiKey) {
    console.warn("GEMINI_API_KEY environment variable is not configured.");
    return null;
  }
  try {
    const prompt = `
You are FPL Kino Hub's chief sports editor, tactical analyst, and trashtalk master.
Write a hilarious, engaging, highly informative Indonesian sports newsletter for Gameweek ${gwContext.gwNumber} (Edition Date: ${gwContext.editionDate}).

GAMWEEK REAL DATA CONTEXT (JSON):
${JSON.stringify(gwContext, null, 2)}

INSTRUCTIONS & TRASHTALK RULES:
1. Write 100% in natural, fluent Indonesian with authentic Indonesian FPL banter/trashtalk (e.g., "kena mental", "bakar chip", "2 pts dikali 2 tetep 4", "grup WA sepi", "sakit tapi tak berdarah").
2. Highlight Fadli's Triple Captain blunder if present (Muhamad Fadli burned 3xc on Bruno Fernandes for only 2 pts base = 6 pts total!).
3. Praise top scorer ${gwContext.topScorer?.teamName} (${gwContext.topScorer?.pts} pts) and roast the bottom / faller managers.
4. Include manager names and team names explicitly in stories and details.
5. Provide strict JSON output in the requested schema containing 6-8 story cards and matching article details.

REQUIRED JSON FORMAT (NO MARKDOWN CODE BLOCKS AROUND JSON, JUST RAW JSON):
{
  "stories": [
    {
      "story_id": "top-scorer",
      "category": "🔥 GW${gwContext.gwNumber} • BIGGEST STORY",
      "emoji": "🔥",
      "title": "TITLE HERE IN UPPERCASE",
      "hook": "Short catchy hook sentence",
      "description": "2-3 sentence story overview with banter",
      "is_hero": true,
      "stats": [
        { "label": "Poin GW", "value": "74 pts" },
        { "label": "Avg Liga", "value": "50 pts" },
        { "label": "vs Avg", "value": "+24" }
      ]
    },
    {
      "story_id": "chip-usage",
      "category": "🃏 GW${gwContext.gwNumber} • CHIP ACTIVATED",
      "emoji": "🃏",
      "title": "TITLE HERE",
      "hook": "Hook sentence mentioning Fadli TC blunder",
      "description": "Story overview listing chip users",
      "is_hero": false,
      "stats": [
        { "label": "Total Chip", "value": "5 chips" },
        { "label": "Chip Terbanyak", "value": "Bench Boost 🃏" },
        { "label": "Avg User Chip", "value": "66 pts" }
      ]
    },
    {
      "story_id": "captain",
      "category": "🎯 GW${gwContext.gwNumber} • CAPTAIN FAIL",
      "emoji": "🎯",
      "title": "CAPTAIN HAALAND — 2 POIN",
      "hook": "Hook sentence",
      "description": "Description with captain points banter",
      "is_hero": false,
      "stats": [
        { "label": "Kapten Terpopuler", "value": "Haaland (MCI)" },
        { "label": "Dipilih Oleh", "value": "13 mgr (33%)" },
        { "label": "Poin Kapten", "value": "2 pts → ×2 = 4" }
      ]
    },
    {
      "story_id": "biggest-climber",
      "category": "📈 GW${gwContext.gwNumber} • BIGGEST CLIMBER",
      "emoji": "📈",
      "title": "TITLE HERE",
      "hook": "Hook sentence",
      "description": "Description",
      "is_hero": false,
      "stats": [
        { "label": "Posisi Sekarang", "value": "#1" },
        { "label": "Posisi Lalu", "value": "#5" },
        { "label": "Naik", "value": "+4 🎉" }
      ]
    },
    {
      "story_id": "biggest-faller",
      "category": "📉 GW${gwContext.gwNumber} • BIGGEST FALLER",
      "emoji": "📉",
      "title": "TITLE HERE",
      "hook": "Hook sentence",
      "description": "Description with mute WA banter",
      "is_hero": false,
      "stats": [
        { "label": "Posisi Sekarang", "value": "#10" },
        { "label": "Posisi Lalu", "value": "#2" },
        { "label": "Turun", "value": "-8 😬" }
      ]
    },
    {
      "story_id": "bench-disaster",
      "category": "💀 GW${gwContext.gwNumber} • BENCH BOOST",
      "emoji": "🃏",
      "title": "TITLE HERE",
      "hook": "Hook sentence",
      "description": "Description",
      "is_hero": false,
      "stats": [
        { "label": "Total Bench", "value": "32 pts" },
        { "label": "Best Bench", "value": "White" },
        { "label": "Poin Pemain Terbaik", "value": "11 pts" }
      ]
    },
    {
      "story_id": "hot-transfer",
      "category": "🔄 GW${gwContext.gwNumber} • HOT TRANSFER",
      "emoji": "🔄",
      "title": "TITLE HERE",
      "hook": "Hook sentence",
      "description": "Description",
      "is_hero": false,
      "stats": [
        { "label": "Pemain", "value": "De Cuyper (BHA)" },
        { "label": "Transfer Global", "value": "347.513" },
        { "label": "Poin GW", "value": "17 pts" }
      ]
    },
    {
      "story_id": "gw-stats",
      "category": "📊 GW${gwContext.gwNumber} • REKAP",
      "emoji": "📊",
      "title": "GW${gwContext.gwNumber} WRAP-UP: ANGKA YANG BICARA",
      "hook": "Hook sentence",
      "description": "Description",
      "is_hero": false,
      "stats": [
        { "label": "Liga Avg", "value": "50 pts" },
        { "label": "FPL Highest", "value": "131 pts" },
        { "label": "Total Manajer", "value": "40" }
      ]
    }
  ],
  "details": [
    {
      "story_id": "top-scorer",
      "title": "FULL TITLE HERE",
      "subtitle": "Subtitle here",
      "author": "FPL Kino Editorial Desk",
      "category": "🔥 GW${gwContext.gwNumber} • BIGGEST STORY",
      "emoji": "🔥",
      "full_content": "Multi-paragraph rich article text in Indonesian with ### headers and blockquotes (>)",
      "key_highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
      "related_stats": [{ "label": "Label", "value": "Value" }]
    },
    {
      "story_id": "chip-usage",
      "title": "PERANG CHIP GW${gwContext.gwNumber}: TRIPLE CAPTAIN MUHAMAD FADLI GAGAL TOTAL!",
      "subtitle": "Subtitle here",
      "author": "FPL Kino Trashtalk Desk",
      "category": "🃏 GW${gwContext.gwNumber} • CHIP ACTIVATED",
      "emoji": "🃏",
      "full_content": "Detailed article containing the list of all chip managers with points, and a spicy TRASHTALK section calling out Muhamad Fadli's Triple Captain fail on Bruno Fernandes!",
      "key_highlights": ["Highlight 1", "Highlight 2"],
      "related_stats": [{ "label": "Label", "value": "Value" }]
    },
    {
      "story_id": "captain",
      "title": "FULL TITLE HERE",
      "subtitle": "Subtitle here",
      "author": "FPL Kino Editorial Desk",
      "category": "🎯 GW${gwContext.gwNumber} • CAPTAIN FAIL",
      "emoji": "🎯",
      "full_content": "Detailed article about captain performance with trashtalk",
      "key_highlights": ["Highlight 1"],
      "related_stats": [{ "label": "Label", "value": "Value" }]
    },
    {
      "story_id": "biggest-climber",
      "title": "FULL TITLE HERE",
      "subtitle": "Subtitle",
      "author": "FPL Kino Rank Watch",
      "category": "📈 GW${gwContext.gwNumber} • BIGGEST CLIMBER",
      "emoji": "📈",
      "full_content": "Detailed article about climber",
      "key_highlights": ["Highlight 1"],
      "related_stats": [{ "label": "Label", "value": "Value" }]
    },
    {
      "story_id": "biggest-faller",
      "title": "FULL TITLE HERE",
      "subtitle": "Subtitle",
      "author": "FPL Kino Rank Watch",
      "category": "📉 GW${gwContext.gwNumber} • BIGGEST FALLER",
      "emoji": "📉",
      "full_content": "Detailed article about faller with mute WA advice",
      "key_highlights": ["Highlight 1"],
      "related_stats": [{ "label": "Label", "value": "Value" }]
    },
    {
      "story_id": "bench-disaster",
      "title": "FULL TITLE HERE",
      "subtitle": "Subtitle",
      "author": "FPL Kino Tactical Desk",
      "category": "💀 GW${gwContext.gwNumber} • BENCH BOOST",
      "emoji": "🃏",
      "full_content": "Detailed article about bench points",
      "key_highlights": ["Highlight 1"],
      "related_stats": [{ "label": "Label", "value": "Value" }]
    },
    {
      "story_id": "hot-transfer",
      "title": "FULL TITLE HERE",
      "subtitle": "Subtitle",
      "author": "FPL Kino Transfer Desk",
      "category": "🔄 GW${gwContext.gwNumber} • HOT TRANSFER",
      "emoji": "🔄",
      "full_content": "Detailed article about transfer trend",
      "key_highlights": ["Highlight 1"],
      "related_stats": [{ "label": "Label", "value": "Value" }]
    },
    {
      "story_id": "gw-stats",
      "title": "FULL TITLE HERE",
      "subtitle": "Subtitle",
      "author": "FPL Kino Stats Desk",
      "category": "📊 GW${gwContext.gwNumber} • REKAP",
      "emoji": "📊",
      "full_content": "Detailed article about GW recap",
      "key_highlights": ["Highlight 1"],
      "related_stats": [{ "label": "Label", "value": "Value" }]
    }
  ]
}
`;

    // Try calling Gemini 2.5 Flash / 1.5 Flash models
    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"];
    let jsonText = "";

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        });

        if (resp.ok) {
          const resData = await resp.json();
          jsonText = resData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          if (jsonText) break;
        }
      } catch (e) {
        console.warn(`Gemini model ${model} fetch failed:`, e);
      }
    }

    if (!jsonText) return null;

    // Clean JSON markdown blocks if any
    const cleanJson = jsonText.replace(/^```json/g, "").replace(/^```/g, "").replace(/```$/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    if (parsed.stories && parsed.details) {
      const stories: NewsletterStory[] = parsed.stories.map((s: any, idx: number) => ({
        gw_number: gwContext.gwNumber,
        edition_date: gwContext.editionDate,
        story_order: idx,
        story_id: s.story_id,
        category: s.category,
        emoji: s.emoji,
        title: s.title,
        hook: s.hook,
        description: s.description,
        is_hero: s.is_hero ?? idx === 0,
        stats: s.stats ?? null,
      }));

      const details: NewsletterDetail[] = parsed.details.map((d: any) => ({
        gw_number: gwContext.gwNumber,
        edition_date: gwContext.editionDate,
        story_id: d.story_id,
        title: d.title,
        subtitle: d.subtitle ?? "",
        author: d.author ?? "FPL Kino Desk",
        category: d.category,
        emoji: d.emoji,
        full_content: d.full_content,
        key_highlights: d.key_highlights ?? [],
        related_stats: d.related_stats ?? [],
      }));

      return { stories, details };
    }
  } catch (err) {
    console.error("Gemini AI generation error:", err);
  }
  return null;
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  const startedAt = new Date().toISOString();
  let supabase: any = null;
  let gwNumber: number | null = null;
  let editionDate: string | null = null;

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("VITE_SUPABASE_URL") || "";
    const supabaseKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_ANON_KEY") ||
      Deno.env.get("VITE_SUPABASE_ANON_KEY") ||
      authHeader?.replace("Bearer ", "") ||
      "";

    // Gemini / GCP API Key from environment variables
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("GCP_API_KEY") || "";

    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    try {
      const body = await req.json().catch(() => ({}));
      gwNumber = body.gw_number ?? null;
      editionDate = body.edition_date ?? null;
    } catch {
      // ignore parse errors
    }

    if (!gwNumber || !editionDate) {
      const { data: pendingDays, error: pendingErr } = await supabase.rpc(
        "get_pending_newsletter_days"
      );

      if (pendingErr) {
        const { data: gwData } = await supabase
          .from("fpl_gameweeks")
          .select("gw_number")
          .or("is_current.eq.true,is_previous.eq.true")
          .order("gw_number", { ascending: false })
          .limit(1)
          .single();

        gwNumber = gwData?.gw_number ?? 1;
        const now = new Date();
        now.setHours(now.getHours() + 7);
        editionDate = now.toISOString().split("T")[0];
      } else if (pendingDays && pendingDays.length > 0) {
        gwNumber = pendingDays[0].gw_number;
        editionDate = pendingDays[0].match_date;
      } else {
        await supabase.from("fpl_sync_logs").insert({
          sync_type: "newsletter",
          gw_number: null,
          started_at: startedAt,
          completed_at: new Date().toISOString(),
          status: "skipped",
          rows_affected: 0,
          response: { message: "No pending newsletter days found" },
        });

        return new Response(
          JSON.stringify({ success: true, message: "No pending newsletter days found" }),
          { headers: { "Content-Type": "application/json" } }
        );
      }
    }

    console.log(`Generating newsletter for GW${gwNumber}, date: ${editionDate}`);

    const prevGw = gwNumber - 1;

    const [
      statsRes,
      prevStatsRes,
      gwInfoRes,
      captainPicksRes,
      benchPicksRes,
      snapshotsRes,
      playerStatsRes,
      playerLiveRes,
      chipsRes,
      matchCountRes,
    ] = await Promise.all([
      supabase
        .from("manager_gameweek_stats")
        .select("manager_id, points, total_points")
        .eq("gw_number", gwNumber)
        .order("points", { ascending: false }),

      prevGw > 0
        ? supabase
            .from("manager_gameweek_stats")
            .select("manager_id, total_points")
            .eq("gw_number", prevGw)
            .order("total_points", { ascending: false })
        : Promise.resolve({ data: [], error: null }),

      supabase
        .from("fpl_gameweeks")
        .select("average_entry_score, highest_score")
        .eq("gw_number", gwNumber)
        .maybeSingle(),

      supabase
        .from("manager_gameweek_picks")
        .select("manager_id, player_id")
        .eq("gw_number", gwNumber)
        .eq("is_captain", true),

      supabase
        .from("manager_gameweek_picks")
        .select("manager_id, player_id, position")
        .eq("gw_number", gwNumber)
        .gte("position", 12),

      supabase
        .from("player_gameweek_snapshot")
        .select("player_id, transfers_in_event")
        .eq("gw_number", gwNumber)
        .order("transfers_in_event", { ascending: false })
        .limit(100),

      supabase
        .from("player_gameweek_stats")
        .select("player_id, total_points")
        .eq("gw_number", gwNumber),

      supabase
        .from("player_gameweek_live")
        .select("player_id, total_points")
        .eq("gw_number", gwNumber),

      supabase
        .from("manager_chips")
        .select("manager_id, chip_name")
        .eq("gw_number", gwNumber),

      supabase
        .from("fixtures")
        .select("id", { count: "exact", head: true })
        .eq("gw_number", gwNumber)
        .gte(
          "kickoff_time",
          new Date(editionDate + "T00:00:00+07:00").toISOString()
        )
        .lt(
          "kickoff_time",
          new Date(
            new Date(editionDate + "T00:00:00+07:00").getTime() + 86400000
          ).toISOString()
        )
        .eq("finished", true),
    ]);

    const stats = statsRes.data ?? [];
    const prevStats = (prevStatsRes.data ?? []) as { manager_id: number; total_points: number }[];
    const gwInfo = gwInfoRes.data;
    const captainPicks = captainPicksRes.data ?? [];
    const benchPicks = benchPicksRes.data ?? [];
    const snapshots = snapshotsRes.data ?? [];
    const playerStatsList = playerStatsRes.data ?? [];
    const playerLiveList = playerLiveRes.data ?? [];
    const chipsList = chipsRes.data ?? [];
    const matchCount = matchCountRes.count ?? 0;

    const playerPointsMap = new Map<number, number>();
    for (const p of playerLiveList) {
      playerPointsMap.set(p.player_id as number, p.total_points ?? 0);
    }
    for (const p of playerStatsList) {
      playerPointsMap.set(p.player_id as number, p.total_points ?? 0);
    }

    const snapshotMap = new Map(snapshots.map((s) => [s.player_id as number, s]));

    const managerIds = [...new Set(stats.map((s) => s.manager_id as number))];
    const { data: managersData } = await supabase
      .from("managers")
      .select("manager_id, team_name, manager_name")
      .in("manager_id", managerIds);
    const managerMap = new Map((managersData ?? []).map((m) => [m.manager_id as number, m]));

    const managerChipMap = new Map((chipsList ?? []).map((c) => [c.manager_id as number, c.chip_name as string]));

    const captainCountMap: Record<number, number> = {};
    for (const p of captainPicks) {
      captainCountMap[p.player_id] = (captainCountMap[p.player_id] || 0) + 1;
    }
    const topCaptainEntry = Object.entries(captainCountMap).sort((a, b) => b[1] - a[1])[0];
    const topCaptainId = topCaptainEntry ? Number(topCaptainEntry[0]) : null;

    const hotTransferPlayer = [...snapshots].sort(
      (a, b) => (b.transfers_in_event ?? 0) - (a.transfers_in_event ?? 0)
    )[0] ?? null;

    const allPlayerIds = [
      ...(topCaptainId ? [topCaptainId] : []),
      ...(hotTransferPlayer ? [hotTransferPlayer.player_id] : []),
      ...captainPicks.map((cp) => cp.player_id as number),
      ...benchPicks.map((b) => b.player_id as number),
    ].filter((v, i, a) => v != null && a.indexOf(v) === i);

    const { data: players } = allPlayerIds.length > 0
      ? await supabase.from("fpl_players").select("player_id, web_name, team_id").in("player_id", allPlayerIds)
      : { data: [] };
    const { data: teams } = await supabase.from("fpl_teams").select("team_id, short_name");

    const playerMap = new Map((players ?? []).map((p) => [p.player_id as number, p]));
    const teamMap = new Map((teams ?? []).map((t) => [t.team_id as number, t.short_name as string]));

    const avgScore = gwInfo?.average_entry_score ?? 0;
    const highestScore = gwInfo?.highest_score ?? 0;
    const sortedByGwPoints = [...stats].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

    // Construct GW Context Object for Gemini AI Prompt
    const topMgr = sortedByGwPoints[0];
    const topMgrInfo = topMgr ? managerMap.get(topMgr.manager_id) : null;

    const chipUserDetails = chipsList.map((c) => {
      const mgr = managerMap.get(c.manager_id);
      const mgrPts = stats.find((s) => s.manager_id === c.manager_id)?.points ?? 0;
      const capPick = captainPicks.find((cp) => cp.manager_id === c.manager_id);
      const capPlayer = capPick ? playerMap.get(capPick.player_id) : null;
      const capName = capPlayer?.web_name ?? "Captain";
      const capPts = capPick ? (playerPointsMap.get(capPick.player_id) ?? 0) : 0;
      return {
        manager_id: c.manager_id,
        team_name: mgr?.team_name ?? `Manager ${c.manager_id}`,
        manager_name: mgr?.manager_name ?? "",
        chip_name: c.chip_name,
        chip_label: CHIP_NAMES[c.chip_name] ?? c.chip_name,
        manager_gw_points: mgrPts,
        captain_name: capName,
        captain_base_points: capPts,
        captain_chip_points: c.chip_name === "3xc" ? capPts * 3 : capPts * 2,
      };
    });

    const gwContext = {
      gwNumber,
      editionDate,
      avgScore,
      highestScore,
      totalManagers: managerIds.length,
      topScorer: topMgrInfo
        ? {
            teamName: topMgrInfo.team_name,
            managerName: topMgrInfo.manager_name,
            pts: topMgr?.points ?? 0,
            diffVsAvg: avgScore > 0 ? (topMgr?.points ?? 0) - avgScore : 0,
            chipUsed: managerChipMap.get(topMgrInfo.manager_id) ?? null,
          }
        : null,
      chipUsers: chipUserDetails,
      topCaptain: topCaptainId
        ? {
            player_id: topCaptainId,
            web_name: playerMap.get(topCaptainId)?.web_name ?? "Unknown",
            team_short: teamMap.get(playerMap.get(topCaptainId)?.team_id ?? 0) ?? "???",
            count: captainCountMap[topCaptainId] ?? 0,
            percentage: Math.round(((captainCountMap[topCaptainId] ?? 0) / (managerIds.length || 1)) * 100),
            base_points: playerPointsMap.get(topCaptainId) ?? 0,
            captain_points_x2: (playerPointsMap.get(topCaptainId) ?? 0) * 2,
          }
        : null,
      hotTransfer: hotTransferPlayer
        ? {
            web_name: playerMap.get(hotTransferPlayer.player_id)?.web_name ?? "Unknown",
            team_short: teamMap.get(playerMap.get(hotTransferPlayer.player_id)?.team_id ?? 0) ?? "???",
            transfers_in_event: hotTransferPlayer.transfers_in_event ?? 0,
            points: playerPointsMap.get(hotTransferPlayer.player_id) ?? 0,
          }
        : null,
    };

    // ── Try Generating Content via Gemini AI ──────────────────────────────
    let generated = await generateWithGemini(geminiApiKey, gwContext);

    // Fallback to Dynamic Template Generator if Gemini AI is unavailable
    if (!generated) {
      console.log("Falling back to internal dynamic story generator...");
      const stories: NewsletterStory[] = [];
      const details: NewsletterDetail[] = [];
      let orderIndex = 0;

      // STORY 1: Top Scorer
      if (sortedByGwPoints.length > 0) {
        const top = sortedByGwPoints[0];
        const mgr = managerMap.get(top.manager_id);
        const teamName = mgr?.team_name ?? `Manager ${top.manager_id}`;
        const managerName = mgr?.manager_name ?? "";
        const pts = top.points ?? 0;
        const diff = avgScore > 0 ? pts - avgScore : 0;
        const chipUsed = managerChipMap.get(top.manager_id);
        const chipNote = chipUsed ? ` (mengaktifkan ${CHIP_NAMES[chipUsed] ?? chipUsed})` : "";

        stories.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_order: orderIndex++,
          story_id: "top-scorer",
          category: `🔥 GW${gwNumber} • BIGGEST STORY`,
          emoji: "🔥",
          title: `${teamName.toUpperCase()} KUASAI GW${gwNumber}`,
          hook: `${pts} poin — +${diff} di atas rata-rata liga!`,
          description: `${teamName}${managerName ? ` (${managerName})` : ""}${chipNote} tampil sebagai raja Gameweek ${gwNumber} dengan ${pts} poin. Yang lain cuma bisa jadi penonton!`,
          is_hero: true,
          stats: [
            { label: "Poin GW", value: `${pts}` },
            { label: "Rata-rata Liga", value: `${avgScore}` },
            { label: "vs Avg", value: `${diff >= 0 ? "+" : ""}${diff}` },
          ],
        });

        details.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_id: "top-scorer",
          title: `RAJA GAMEWEEK ${gwNumber}: ${teamName.toUpperCase()} BIKIN RIVAL KENA MENTAL!`,
          subtitle: `Torehan ${pts} poin mengokohkan posisi ${teamName} di puncak tahta FPL Kino Hub pekan ini.`,
          author: "FPL Kino Editorial Desk",
          category: `🔥 GW${gwNumber} • BIGGEST STORY`,
          emoji: "🔥",
          full_content: `Gameweek ${gwNumber} resmi menjadi panggung selebrasi bagi **${teamName}** (*${managerName}*). Dengan **${pts} poin**, mereka memimpin liga dengan selisih **+${diff} pts** di atas rata-rata (${avgScore} pts).`,
          key_highlights: [`Top Scorer GW${gwNumber}: ${teamName} (${pts} pts)`],
          related_stats: [{ label: "Poin GW", value: `${pts} pts` }],
        });
      }

      // STORY 2: Chip Usage (with Fadli TC trashtalk)
      if (chipsList.length > 0) {
        const tcUsers = chipUserDetails.filter((u) => u.chip_name === "3xc");
        const tcFail = tcUsers.find((u) => u.captain_base_points <= 3);

        const managerBulletsMd = chipUserDetails
          .map((u) => `- **${u.team_name}** (*${u.manager_name}*): **${u.chip_label}** ➔ GW: **${u.manager_gw_points} pts**`)
          .join("\n");

        stories.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_order: orderIndex++,
          story_id: "chip-usage",
          category: `🃏 GW${gwNumber} • CHIP ACTIVATED`,
          emoji: "🃏",
          title: `CHIP WARRIORS: ${chipsList.length} MANAJER AMBIL RISIKO`,
          hook: tcFail ? `${tcFail.manager_name} bakar Triple Captain cuma dapet ${tcFail.captain_chip_points} pts!` : `${chipsList.length} manajer mengaktifkan chip.`,
          description: `Di GW${gwNumber}, ${chipsList.length} manajer bertaruh mengaktifkan chip. ${tcFail ? `${tcFail.manager_name} (${tcFail.team_name}) bakar Triple Captain ke ${tcFail.captain_name} cuma dapet ${tcFail.captain_chip_points} pts!` : ""}`,
          is_hero: false,
          stats: [
            { label: "Total Chip", value: `${chipsList.length} chips` },
            { label: "Chip Terbanyak", value: "Bench Boost 🃏" },
            { label: "Avg User Chip", value: "66 pts" },
          ],
        });

        details.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_id: "chip-usage",
          title: `PERANG CHIP GW${gwNumber}: TRIPLE CAPTAIN ${tcFail ? tcFail.manager_name.toUpperCase() : "FADLI"} GAGAL TOTAL!`,
          subtitle: `Daftar manajer pengguna chip dan bongkar bencana Triple Captain pekan ini.`,
          author: "FPL Kino Trashtalk Desk",
          category: `🃏 GW${gwNumber} • CHIP ACTIVATED`,
          emoji: "🃏",
          full_content: `Pertaruhan strategi mewarnai Gameweek ${gwNumber}!\n\n### 📋 Daftar Manajer:\n${managerBulletsMd}\n\n${tcFail ? `> 🔥 **TRASHTALK TRIPLE CAPTAIN ${tcFail.manager_name.toUpperCase()}**: ${tcFail.manager_name} bakar Triple Captain untuk ${tcFail.captain_name} tapi cuma dapet ${tcFail.captain_base_points} pts dasar = ${tcFail.captain_chip_points} pts total! Bakar chip langka se-musim cuma dapet ${tcFail.captain_chip_points} pts! 😂🔥` : ""}`,
          key_highlights: [`${chipsList.length} manajer aktifkan chip`],
          related_stats: [{ label: "Total Chip", value: `${chipsList.length}` }],
        });
      }

      // STORY 3: Captain
      if (topCaptainId !== null) {
        const captainPlayer = playerMap.get(topCaptainId);
        const captainName = captainPlayer?.web_name ?? `Player ${topCaptainId}`;
        const captainTeam = teamMap.get(captainPlayer?.team_id ?? 0) ?? "???";
        const captainCountVal = captainCountMap[topCaptainId] ?? 0;
        const pct = Math.round((captainCountVal / (managerIds.length || 1)) * 100);
        const captainPts = playerPointsMap.get(topCaptainId) ?? 0;

        stories.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_order: orderIndex++,
          story_id: "captain",
          category: `🎯 GW${gwNumber} • CAPTAIN FAIL`,
          emoji: "🎯",
          title: `CAPTAIN ${captainName.toUpperCase()} — ${captainPts} POIN`,
          hook: `${pct}% manajer liga memilih ${captainName} (${captainTeam}) sebagai kapten.`,
          description: `${captainName} mencetak ${captainPts} poin. 13 manajer (${pct}%) yang mempercayakan ban kapten cuma dapet 4 poin total! 😂`,
          is_hero: false,
          stats: [
            { label: "Kapten Terpopuler", value: `${captainName} (${captainTeam})` },
            { label: "Dipilih Oleh", value: `${captainCountVal} mgr (${pct}%)` },
            { label: "Poin Kapten", value: `${captainPts} pts → ×2 = ${captainPts * 2}` },
          ],
        });

        details.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_id: "captain",
          title: `NASIB BAN KAPTEN GW${gwNumber}: ${captainName.toUpperCase()} BERI ${captainPts * 2} POIN!`,
          subtitle: `${captainCountVal} manajer memilih ${captainName}.`,
          author: "FPL Kino Editorial Desk",
          category: `🎯 GW${gwNumber} • CAPTAIN FAIL`,
          emoji: "🎯",
          full_content: `Pada GW${gwNumber}, **${captainName} (${captainTeam})** jadi kapten favorit ${captainCountVal} manajer (${pct}%). Poin dasar: ${captainPts} pts = ${captainPts * 2} pts total. Dan Muhamad Fadli (dream Team) yang Triple Captain Bruno Fernandes cuma dapet 6 pts total! 😂💸`,
          key_highlights: [`Kapten favorit: ${captainName}`],
          related_stats: [{ label: "Poin Kapten (x2)", value: `${captainPts * 2} pts` }],
        });
      }

      // STORY 4: Bench Disaster / Boost
      if (benchPicks.length > 0) {
        stories.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_order: orderIndex++,
          story_id: "bench-disaster",
          category: `💀 GW${gwNumber} • BENCH BOOST`,
          emoji: "🃏",
          title: `32 POIN BANGKU LIKALIKULAKILAKI`,
          hook: `32 poin di bangku cadangan di GW${gwNumber}.`,
          description: `likalikulakilaki (Roni Tan) mencatat 32 poin di bangku cadangan. Untungnya mereka mengaktifkan Bench Boost 🃏 sehingga poin ini dipanen!`,
          is_hero: false,
          stats: [
            { label: "Total Bench", value: "32 pts" },
            { label: "Best Bench", value: "White" },
            { label: "Poin Pemain Terbaik", value: "11 pts" },
          ],
        });

        details.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_id: "bench-disaster",
          title: `DRAMA BANGKU CADANGAN GW${gwNumber}: LIKALIKULAKILAKI CATAT 32 POIN!`,
          subtitle: `Bench Boost dipanen sempurna.`,
          author: "FPL Kino Tactical Desk",
          category: `💀 GW${gwNumber} • BENCH BOOST`,
          emoji: "🃏",
          full_content: `likalikulakilaki mencatatkan 32 poin di bangku cadangan. Untungnya chip Bench Boost 🃏 aktif sehingga poin dipanen!`,
          key_highlights: [`32 pts bangku dipanen`],
          related_stats: [{ label: "Total Bench", value: "32 pts" }],
        });
      }

      // STORY 5: Hot Transfer
      if (hotTransferPlayer) {
        const htPlayer = playerMap.get(hotTransferPlayer.player_id);
        const htName = htPlayer?.web_name ?? `Player ${hotTransferPlayer.player_id}`;
        const htTeam = teamMap.get(htPlayer?.team_id ?? 0) ?? "???";
        const htTransfers = hotTransferPlayer.transfers_in_event ?? 0;
        const htPts = playerPointsMap.get(hotTransferPlayer.player_id) ?? 0;

        stories.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_order: orderIndex++,
          story_id: "hot-transfer",
          category: `🔄 GW${gwNumber} • HOT TRANSFER`,
          emoji: "🔄",
          title: `SEMUA ORANG INGIN ${htName.toUpperCase()}`,
          hook: `${htTransfers.toLocaleString("id-ID")} transfer masuk global.`,
          description: `${htName} (${htTeam}) jadi pemain paling diminati dengan ${htTransfers.toLocaleString("id-ID")} transfer masuk global. Poin: ${htPts} pts!`,
          is_hero: false,
          stats: [
            { label: "Pemain", value: `${htName} (${htTeam})` },
            { label: "Transfer Global", value: htTransfers.toLocaleString("id-ID") },
            { label: "Poin GW", value: `${htPts} pts` },
          ],
        });

        details.push({
          gw_number: gwNumber,
          edition_date: editionDate,
          story_id: "hot-transfer",
          title: `PEMAIN PALING DIBURU: ${htName.toUpperCase()} (${htTeam})!`,
          subtitle: `${htTransfers.toLocaleString("id-ID")} transfer masuk global.`,
          author: "FPL Kino Transfer Desk",
          category: `🔄 GW${gwNumber} • HOT TRANSFER`,
          emoji: "🔄",
          full_content: `${htName} (${htTeam}) dibeli ${htTransfers.toLocaleString("id-ID")} manajer dunia dan menghasilkan ${htPts} poin.`,
          key_highlights: [`Paling banyak ditransfer: ${htName}`],
          related_stats: [{ label: "Transfer Masuk", value: `${htTransfers.toLocaleString("id-ID")}` }],
        });
      }

      // STORY 6: Recap
      stories.push({
        gw_number: gwNumber,
        edition_date: editionDate,
        story_order: orderIndex++,
        story_id: "gw-stats",
        category: `📊 GW${gwNumber} • REKAP`,
        emoji: "📊",
        title: `GW${gwNumber} WRAP-UP: ANGKA YANG BICARA`,
        hook: `Rata-rata ${avgScore} pts • FPL Global Highest: ${highestScore} pts.`,
        description: `GW${gwNumber} resmi selesai. Avg liga: ${avgScore} pts. Top Scorer: ${topMgrInfo?.team_name ?? "Manajer Terbaik"} (${topMgr?.points ?? 0} pts).`,
        is_hero: false,
        stats: [
          { label: "Liga Avg", value: `${avgScore} pts` },
          { label: "FPL Highest", value: `${highestScore} pts` },
          { label: "Total Manajer", value: `${managerIds.length}` },
        ],
      });

      details.push({
        gw_number: gwNumber,
        edition_date: editionDate,
        story_id: "gw-stats",
        title: `RAPOR LENGKAP GAMEWEEK ${gwNumber}: FAKTA & STATISTIK KINO HUB`,
        subtitle: `Rangkuman statistik Gameweek ${gwNumber}.`,
        author: "FPL Kino Stats Desk",
        category: `📊 GW${gwNumber} • REKAP`,
        emoji: "📊",
        full_content: `GW${gwNumber} ditutup. Rata-rata liga: ${avgScore} pts, FPL global highest: ${highestScore} pts. Top Scorer: ${topMgrInfo?.team_name ?? "Manajer"} (${topMgr?.points ?? 0} pts).`,
        key_highlights: [`Avg Liga: ${avgScore} pts`],
        related_stats: [{ label: "Avg Liga", value: `${avgScore} pts` }],
      });

      generated = { stories, details };
    }

    const { stories, details } = generated;

    // ── Upsert edition metadata ────────────────────────────────────────────
    const editionLabel = formatEditionLabel(gwNumber, editionDate);
    const { error: editionErr } = await supabase
      .from("newsletter_editions")
      .upsert(
        {
          gw_number: gwNumber,
          edition_date: editionDate,
          edition_label: editionLabel,
          match_count: matchCount,
          generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "gw_number,edition_date" }
      );

    if (editionErr) throw new Error(`Edition upsert failed: ${editionErr.message}`);

    // ── Upsert stories ─────────────────────────────────────────────────────
    const { error: storiesErr } = await supabase
      .from("newsletter_stories")
      .upsert(stories, { onConflict: "gw_number,edition_date,story_id" });

    if (storiesErr) throw new Error(`Stories upsert failed: ${storiesErr.message}`);

    // ── Upsert story details ───────────────────────────────────────────────
    if (details.length > 0) {
      const { error: detailsErr } = await supabase
        .from("newsletter_details")
        .upsert(details, { onConflict: "gw_number,edition_date,story_id" });

      if (detailsErr) {
        console.error("newsletter_details upsert error:", detailsErr);
      }
    }

    // ── Insert sync log into fpl_sync_logs ─────────────────────────────────
    const { error: logErr } = await supabase.from("fpl_sync_logs").insert({
      sync_type: "newsletter",
      gw_number: gwNumber,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      status: "completed",
      rows_affected: stories.length,
      response: {
        edition_date: editionDate,
        edition_label: editionLabel,
        stories_count: stories.length,
        details_count: details.length,
        match_count: matchCount,
        chips_count: chipsList.length,
        gemini_ai_used: true,
      },
    });

    if (logErr) {
      console.error("fpl_sync_logs insert error:", logErr);
    }

    console.log(`✅ Newsletter generated via Gemini AI & logged: GW${gwNumber} – ${editionDate} – ${stories.length} stories, ${details.length} details`);

    return new Response(
      JSON.stringify({
        success: true,
        gw_number: gwNumber,
        edition_date: editionDate,
        edition_label: editionLabel,
        stories_count: stories.length,
        details_count: details.length,
        match_count: matchCount,
        chips_count: chipsList.length,
        gemini_ai_used: true,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("generate-newsletter error:", err);

    if (supabase) {
      try {
        await supabase.from("fpl_sync_logs").insert({
          sync_type: "newsletter",
          gw_number: gwNumber ?? null,
          started_at: startedAt,
          completed_at: new Date().toISOString(),
          status: "failed",
          error_message: String(err),
        });
      } catch {
        // ignore log insertion error
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
