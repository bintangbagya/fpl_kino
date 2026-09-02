import React, { useState, useEffect } from 'react';
import { useLeaguePageData, type PhaseInfo } from '../hooks/useLeaguePageData';

function getMonthAbbr(phaseName: string): string {
  const clean = phaseName.replace(/\s*\(GW\d+-\d+\)/i, '').trim();
  const firstWord = clean.split(' ')[0];
  return firstWord.substring(0, 3).toUpperCase();
}

function getTableHeaderTitle(
  viewMode: 'full' | 'month' | 'gameweek',
  selectedPhase: PhaseInfo | null,
  selectedGw: number | 'all' | null
): string {
  if (viewMode === 'full') {
    return '2026/27 SEASON OVERVIEW';
  }

  if (viewMode === 'month' && selectedPhase) {
    const cleanMonthName = selectedPhase.name.replace(/\s*\(GW\d+-\d+\)/i, '').trim().toUpperCase();
    return `${cleanMonthName} STANDINGS`;
  }

  if (viewMode === 'gameweek' && selectedGw && typeof selectedGw === 'number') {
    const formattedGw = selectedGw < 10 ? `0${selectedGw}` : `${selectedGw}`;
    return `GAMEWEEK ${formattedGw} STANDINGS`;
  }

  return '2026/27 SEASON OVERVIEW';
}

function getTableHelperText(
  viewMode: 'full' | 'month' | 'gameweek',
  selectedPhase: PhaseInfo | null,
  selectedGw: number | 'all' | null
): string {
  if (viewMode === 'full') {
    return 'Ranked by total season points';
  }

  if (viewMode === 'month' && selectedPhase) {
    const cleanMonthName = selectedPhase.name.replace(/\s*\(GW\d+-\d+\)/i, '').trim();
    return `Ranked by ${cleanMonthName} points`;
  }

  if (viewMode === 'gameweek' && selectedGw && typeof selectedGw === 'number') {
    const formattedGw = selectedGw < 10 ? `0${selectedGw}` : `${selectedGw}`;
    return `Ranked by Gameweek ${formattedGw} points`;
  }

  return 'Ranked by total season points';
}

function getColumn1Labels(
  viewMode: 'full' | 'month' | 'gameweek',
  selectedPhase: PhaseInfo | null,
  selectedGw: number | 'all' | null,
  latestFinishedGw: number | null
): { desktop: string; mobile: string } {
  if (viewMode === 'full') {
    const gwNum = latestFinishedGw ?? 2;
    const formattedGw = gwNum < 10 ? `0${gwNum}` : `${gwNum}`;
    return { desktop: `GW${formattedGw} PTS`, mobile: `GW${formattedGw}` };
  }

  if (viewMode === 'month' && selectedPhase) {
    const monthAbbr = getMonthAbbr(selectedPhase.name);
    return { desktop: `${monthAbbr} PTS`, mobile: monthAbbr };
  }

  if (viewMode === 'gameweek' && selectedGw && typeof selectedGw === 'number') {
    const formattedGw = selectedGw < 10 ? `0${selectedGw}` : `${selectedGw}`;
    return { desktop: `GW${formattedGw} PTS`, mobile: `GW${formattedGw}` };
  }

  return { desktop: 'GW PTS', mobile: 'GW' };
}

export const LeaguePage: React.FC = () => {
  const {
    phases,
    selectedPhaseId,
    selectedPhase,
    setSelectedPhaseId,
    selectedGw,
    setSelectedGw,
    allGws,
    showQualificationZone,
    latestFinishedGw,
    resetFilters,
    standings,
    loading,
    error,
  } = useLeaguePageData();

  const [viewMode, setViewMode] = useState<'full' | 'month' | 'gameweek'>('full');

  // Keep viewMode synced with external changes or resets
  useEffect(() => {
    if (selectedPhaseId === null && (selectedGw === null || selectedGw === 'all')) {
      setViewMode('full');
    } else if (selectedPhaseId !== null && (selectedGw === null || selectedGw === 'all')) {
      setViewMode('month');
    } else if (selectedGw !== null && typeof selectedGw === 'number' && selectedPhaseId === null) {
      setViewMode('gameweek');
    }
  }, [selectedPhaseId, selectedGw]);

  const isFilterActive = viewMode !== 'full';
  const col1Labels = getColumn1Labels(viewMode, selectedPhase, selectedGw, latestFinishedGw);
  const isCol1Primary = viewMode === 'month' || viewMode === 'gameweek';

  // Available Gameweek list for Gameweek Mode
  const availableGameweeks = allGws && allGws.length > 0 ? allGws : [1, 2, 3];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(204, 255, 0, 0.04) 0%, rgba(13, 13, 13, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* 1. Header Banner Card (Hero Banner) */}
      <section
        style={{
          border: '1px solid rgba(204,255,0,0.3)',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #141414 60%, #0f1a00 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 1,
          boxShadow: '0 12px 32px rgba(204,255,0,0.08)',
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: 'linear-gradient(180deg, #CCFF00 0%, rgba(204,255,0,0.2) 100%)',
            borderRadius: '16px 0 0 16px',
          }}
        />

        {/* Decorative background ball */}
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-20px',
            fontSize: '180px',
            opacity: 0.04,
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 1,
          }}
        >
          ⚽
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 800,
                color: '#000000',
                backgroundColor: '#CCFF00',
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              UNOFFICIAL LEAGUE
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 900,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            FPL KINO LEAGUE
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '4px',
              flexWrap: 'wrap',
            }}
          >
            {['PLAY', 'COMPETE', 'CONNECT'].map((word, idx) => (
              <React.Fragment key={word}>
                {idx > 0 && (
                  <div
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#CCFF00',
                    }}
                  />
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '0.12em',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {word}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 2. View Standings Period Control (Strict 1-Row Grid on Mobile) */}
      <section
        style={{
          backgroundColor: '#141414',
          border: '1px solid #222222',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 1,
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '16px',
                fontWeight: 900,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              VIEW STANDINGS
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#9E9E9E',
                margin: 0,
              }}
            >
              Choose the period you want to view.
            </p>
          </div>

          {/* Reset Control if custom filter is active */}
          {isFilterActive && (
            <button
              onClick={() => {
                setViewMode('full');
                resetFilters();
              }}
              style={{
                backgroundColor: '#1c1b1b',
                border: '1px solid #333333',
                color: '#CCFF00',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                restart_alt
              </span>
              RESET TO FULL SEASON
            </button>
          )}
        </div>

        {/* Primary 3-Option Segmented Control (Strict 1-Row Grid on Mobile) */}
        <div className="view-mode-segmented-control">
          {/* Mode 1: FULL SEASON */}
          <button
            onClick={() => {
              setViewMode('full');
              setSelectedPhaseId(null);
              setSelectedGw(null);
            }}
            className="view-mode-toggle-btn"
            style={{
              border: viewMode === 'full' ? '1px solid #CCFF00' : '1px solid transparent',
              backgroundColor: viewMode === 'full' ? 'rgba(204, 255, 0, 0.15)' : 'transparent',
              color: viewMode === 'full' ? '#CCFF00' : '#888888',
              boxShadow: viewMode === 'full' ? '0 0 12px rgba(204, 255, 0, 0.15)' : 'none',
            }}
          >
            <span className="desktop-only-inline">🏆 </span>
            <span>FULL SEASON</span>
          </button>

          {/* Mode 2: BY MONTH */}
          <button
            onClick={() => {
              setViewMode('month');
              if (selectedPhaseId === null && phases.length > 0) {
                setSelectedPhaseId(phases[0].phase_id);
              }
              setSelectedGw('all');
            }}
            className="view-mode-toggle-btn"
            style={{
              border: viewMode === 'month' ? '1px solid #CCFF00' : '1px solid transparent',
              backgroundColor: viewMode === 'month' ? 'rgba(204, 255, 0, 0.15)' : 'transparent',
              color: viewMode === 'month' ? '#CCFF00' : '#888888',
              boxShadow: viewMode === 'month' ? '0 0 12px rgba(204, 255, 0, 0.15)' : 'none',
            }}
          >
            <span className="desktop-only-inline">📅 </span>
            <span>BY MONTH</span>
          </button>

          {/* Mode 3: BY GAMEWEEK */}
          <button
            onClick={() => {
              setViewMode('gameweek');
              setSelectedPhaseId(null);
              if (typeof selectedGw !== 'number') {
                setSelectedGw(latestFinishedGw ?? (availableGameweeks[0] || 1));
              }
            }}
            className="view-mode-toggle-btn"
            style={{
              border: viewMode === 'gameweek' ? '1px solid #CCFF00' : '1px solid transparent',
              backgroundColor: viewMode === 'gameweek' ? 'rgba(204, 255, 0, 0.15)' : 'transparent',
              color: viewMode === 'gameweek' ? '#CCFF00' : '#888888',
              boxShadow: viewMode === 'gameweek' ? '0 0 12px rgba(204, 255, 0, 0.15)' : 'none',
            }}
          >
            <span className="desktop-only-inline">⚽ </span>
            <span className="desktop-only-inline">BY GAMEWEEK</span>
            <span className="mobile-only-inline">BY GW</span>
          </button>
        </div>

        {/* Progressive Disclosure Controls per Mode */}

        {/* Mode 1: FULL SEASON Supporting Info */}
        {viewMode === 'full' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid #222222',
              borderRadius: '8px',
              color: '#AAA',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#CCFF00' }}>
              info
            </span>
            <span>Overall standings for the entire 2026/27 season</span>
          </div>
        )}

        {/* Mode 2: BY MONTH Controls (Shows Month Selector Only) */}
        {viewMode === 'month' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 800,
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              SELECT MONTH
            </label>

            <div style={{ position: 'relative', maxWidth: '360px', width: '100%' }}>
              <select
                value={selectedPhaseId ?? ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setViewMode('month');
                  setSelectedPhaseId(val);
                  setSelectedGw('all');
                }}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 14px',
                  backgroundColor: '#0D0D0D',
                  border: '1px solid #CCFF00',
                  borderRadius: '8px',
                  color: '#CCFF00',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23CCFF00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                }}
              >
                {phases.map((p) => {
                  const cleanName = p.name.replace(/\s*\(GW\d+-\d+\)/i, '').trim();
                  return (
                    <option key={p.phase_id} value={p.phase_id} style={{ backgroundColor: '#141414', color: '#FFF' }}>
                      {cleanName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        {/* Mode 3: BY GAMEWEEK Controls (Shows Dropdown Style Consistent with Month Selector) */}
        {viewMode === 'gameweek' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 800,
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              SELECT GAMEWEEK
            </label>

            <div style={{ position: 'relative', maxWidth: '360px', width: '100%' }}>
              <select
                value={selectedGw ?? ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setViewMode('gameweek');
                  setSelectedPhaseId(null);
                  setSelectedGw(val);
                }}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 14px',
                  backgroundColor: '#0D0D0D',
                  border: '1px solid #CCFF00',
                  borderRadius: '8px',
                  color: '#CCFF00',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23CCFF00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                }}
              >
                {availableGameweeks.map((gw) => {
                  const formattedGw = gw < 10 ? `0${gw}` : `${gw}`;
                  return (
                    <option key={gw} value={gw} style={{ backgroundColor: '#141414', color: '#FFF' }}>
                      Gameweek {formattedGw}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px' }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px', color: '#CCFF00', animation: 'spin 1s linear infinite' }}
            >
              autorenew
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#9E9E9E' }}>
              LOADING STANDINGS...
            </span>
          </div>
        )}
      </section>

      {/* Error state */}
      {error && (
        <div
          style={{
            backgroundColor: '#1a0000',
            border: '1px solid #FF4444',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#FF4444',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
          }}
        >
          ⚠️ Error loading standings: {error}
        </div>
      )}

      {/* 3. Standings Table Card */}
      <section
        style={{
          border: '1px solid #222222',
          backgroundColor: '#141414',
          borderRadius: '14px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #CCFF00 0%, #00FF88 100%)',
            opacity: 0.8,
            zIndex: 10,
          }}
        />

        {/* Banner header: Active Filter Context, Ranking Helper & Qualification Info */}
        <div
          style={{
            backgroundColor: '#141414',
            padding: '16px 20px',
            borderBottom: '1px solid #222222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  backgroundColor: showQualificationZone ? '#00FF88' : '#CCFF00',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 900,
                  color: showQualificationZone ? '#00FF88' : '#CCFF00',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {getTableHeaderTitle(viewMode, selectedPhase, selectedGw)}
              </span>
            </div>

            {/* Subtle Helper Text clarifying ranking basis */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#888888',
                paddingLeft: '15px',
              }}
            >
              {getTableHelperText(viewMode, selectedPhase, selectedGw)}
            </span>
          </div>

          {showQualificationZone && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(0, 255, 136, 0.12)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                padding: '4px 10px',
                borderRadius: '100px',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#00FF88', flexShrink: 0 }}>
                emoji_events
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#00FF88',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                TOP 16 QUALIFY FOR FPL KINO CUP (GW19)
              </span>
            </div>
          )}
        </div>

        {/* Container for Table (Clean responsive grid, zero horizontal page scroll) */}
        <div style={{ width: '100%' }}>
          {/* Table Column Headers */}
          <div
            className="standings-table-grid"
            style={{
              borderBottom: '1px solid #222222',
              backgroundColor: '#111111',
            }}
          >
            {/* POS */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#666666',
                textAlign: 'center',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.1em',
              }}
            >
              POS
            </div>

            {/* TEAM & MANAGER */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#666666',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.1em',
              }}
            >
              <span className="desktop-only-inline">TEAM & MANAGER</span>
              <span className="mobile-only-inline">TEAM</span>
            </div>

            {/* DYNAMIC COLUMN 1: Period Performance */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                color: isCol1Primary ? '#CCFF00' : '#666666',
                textAlign: 'right',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.1em',
              }}
            >
              <span className="desktop-only-inline">{col1Labels.desktop}</span>
              <span className="mobile-only-inline">{col1Labels.mobile}</span>
            </div>

            {/* DYNAMIC COLUMN 2: Cumulative Total Points */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                color: !isCol1Primary ? '#CCFF00' : '#666666',
                textAlign: 'right',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.1em',
              }}
            >
              <span className="desktop-only-inline">TOTAL PTS</span>
              <span className="mobile-only-inline">TOTAL</span>
            </div>
          </div>

          {/* Table Rows Body */}
          <div
            style={{
              maxHeight: '600px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {!loading && standings.length === 0 && (
              <div
                style={{
                  padding: '48px 16px',
                  textAlign: 'center',
                  color: '#9E9E9E',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                Belum ada data standings untuk filter ini.
              </div>
            )}

            {standings.map((row) => {
              const isTop3 = row.pos <= 3;
              const isQualifyingZone = showQualificationZone && row.pos <= 16;
              const isQualifyingNonTop3 = isQualifyingZone && !isTop3;
              const showQualificationDivider = showQualificationZone && row.pos === 16;

              return (
                <React.Fragment key={`${row.pos}-${row.team}`}>
                  <div
                    className="standings-table-grid standing-row-hover"
                    style={{
                      borderBottom: '1px solid #1e1e1e',
                      position: 'relative',
                      backgroundColor: isTop3
                        ? 'rgba(204, 255, 0, 0.05)'
                        : isQualifyingNonTop3
                        ? 'rgba(0, 255, 136, 0.035)'
                        : 'transparent',
                    }}
                  >
                    {/* Left accent bar */}
                    {isTop3 ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '3px',
                          backgroundColor: '#CCFF00',
                        }}
                      />
                    ) : isQualifyingNonTop3 ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '3px',
                          backgroundColor: '#00FF88',
                        }}
                      />
                    ) : null}

                    {/* Rank Number */}
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'center',
                        fontSize: isTop3 ? '15px' : '13px',
                        color: isTop3 ? '#CCFF00' : isQualifyingNonTop3 ? '#00FF88' : '#666666',
                        fontWeight: isTop3 || isQualifyingNonTop3 ? 800 : 600,
                      }}
                    >
                      {row.pos}
                    </div>

                    {/* Team & Manager Stacked */}
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontWeight: 700,
                            fontSize: '13px',
                            color: isTop3 ? '#CCFF00' : isQualifyingZone ? '#FFFFFF' : '#aaaaaa',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.25,
                          }}
                          title={row.team}
                        >
                          {row.team}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '10px',
                          color: isTop3 ? '#c4c9ac' : isQualifyingZone ? '#99ccaa' : '#777777',
                          marginTop: '2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.25,
                        }}
                        title={row.manager}
                      >
                        {row.manager}
                      </span>
                    </div>

                    {/* COLUMN 1: Period Performance Points */}
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'right',
                        fontSize: isCol1Primary ? '13px' : '11px',
                        fontWeight: isCol1Primary ? (isTop3 || isQualifyingZone ? 800 : 700) : 600,
                        color: isCol1Primary
                          ? (isTop3 ? '#CCFF00' : isQualifyingZone ? '#FFFFFF' : '#e0e0e0')
                          : '#9E9E9E',
                      }}
                    >
                      {row.gw}
                    </div>

                    {/* COLUMN 2: Cumulative Season Total Points */}
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'right',
                        fontSize: !isCol1Primary ? '13px' : '11px',
                        fontWeight: !isCol1Primary ? (isTop3 || isQualifyingZone ? 800 : 700) : 600,
                        color: !isCol1Primary
                          ? (isTop3 ? '#CCFF00' : isQualifyingZone ? '#FFFFFF' : '#e0e0e0')
                          : '#AAA',
                      }}
                    >
                      {row.tot}
                    </div>
                  </div>

                  {/* Qualification Cutoff Divider Marker Row */}
                  {showQualificationDivider && (
                    <div
                      style={{
                        background: 'linear-gradient(90deg, rgba(0, 255, 136, 0.22) 0%, rgba(0, 255, 136, 0.05) 100%)',
                        borderTop: '2px solid #00FF88',
                        borderBottom: '2px solid #00FF88',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '4px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(0, 255, 136, 0.1)',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#00FF88', flexShrink: 0 }}>
                        workspace_premium
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'clamp(9px, 2.5vw, 11px)',
                          fontWeight: 900,
                          color: '#00FF88',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        FPL KINO CUP QUALIFICATION ZONE
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
