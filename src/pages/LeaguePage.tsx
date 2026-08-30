import React from 'react';
import { useLeaguePageData } from '../hooks/useLeaguePageData';
import { useLanguage } from '../context/LanguageContext';

export const LeaguePage: React.FC = () => {
  const { t } = useLanguage();
  const {
    phases,
    selectedPhaseId,
    selectedPhase,
    setSelectedPhaseId,
    availableGwsForPhase,
    selectedGw,
    setSelectedGw,
    activeFilterLabel,
    showQualificationZone,
    resetFilters,
    standings,
    loading,
    error,
  } = useLeaguePageData();

  const isFilterActive = selectedPhaseId !== null || (selectedGw !== null && selectedGw !== 'all');

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

      {/* 1. Header Banner Card */}
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

      {/* 2. Filters Section (Month + GW Filters) */}
      <section
        style={{
          backgroundColor: '#141414',
          border: '1px solid #222222',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Section Title & Active Filter Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '15px',
                fontWeight: 900,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              STANDINGS FILTER
            </h2>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: isFilterActive ? 'rgba(204,255,0,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isFilterActive ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '100px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isFilterActive ? '#CCFF00' : '#9E9E9E',
                  animation: isFilterActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: isFilterActive ? '#CCFF00' : '#9E9E9E',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {activeFilterLabel}
              </span>
            </div>
          </div>

          {/* Reset Filters Control */}
          {isFilterActive && (
            <button
              onClick={resetFilters}
              style={{
                backgroundColor: '#1c1b1b',
                border: '1px solid #333333',
                color: '#CCFF00',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '5px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                restart_alt
              </span>
              {t.resetFilters.toUpperCase()}
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* 1. Month Filter Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 200px', minWidth: '180px' }}>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              1. {t.selectMonth.toUpperCase()} (PHASE)
            </label>
            <div
              style={{
                position: 'relative',
                border: '1px solid #222222',
                backgroundColor: '#0d0d0d',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: selectedPhase ? '#CCFF00' : '#FFFFFF',
                }}
              >
                {selectedPhase ? `${selectedPhase.name} (GW${selectedPhase.start_event}-${selectedPhase.stop_event})` : 'Season Overview (All Months)'}
              </span>
              <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '18px' }}>
                expand_more
              </span>
              <select
                value={selectedPhaseId ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedPhaseId(val === '' ? null : Number(val));
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
              >
                <option value="">Season Overview (All Months)</option>
                {phases.map((p) => (
                  <option key={p.phase_id} value={p.phase_id}>
                    {p.name} (GW{p.start_event} - GW{p.stop_event})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Gameweek Filter Dropdown (Cascading) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 200px', minWidth: '180px' }}>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                color: selectedPhase ? '#666666' : '#444444',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              2. GAMEWEEK IN {selectedPhase ? selectedPhase.name.toUpperCase() : 'MONTH'}
            </label>
            <div
              style={{
                position: 'relative',
                border: `1px solid ${selectedPhase ? '#222222' : '#1a1a1a'}`,
                backgroundColor: selectedPhase ? '#0d0d0d' : '#111111',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                opacity: selectedPhase ? 1 : 0.5,
                cursor: selectedPhase ? 'pointer' : 'not-allowed',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: selectedGw && selectedGw !== 'all' ? '#CCFF00' : '#FFFFFF',
                }}
              >
                {!selectedPhase
                  ? 'Select a Month first'
                  : selectedGw === 'all' || selectedGw === null
                  ? `All of ${selectedPhase.name} (Full Month)`
                  : `Gameweek ${selectedGw}`}
              </span>
              <span className="material-symbols-outlined" style={{ color: selectedPhase ? '#CCFF00' : '#666666', fontSize: '18px' }}>
                expand_more
              </span>
              <select
                value={selectedGw ?? 'all'}
                disabled={!selectedPhase}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedGw(val === 'all' ? 'all' : Number(val));
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: selectedPhase ? 'pointer' : 'not-allowed',
                  width: '100%',
                  height: '100%',
                }}
              >
                {selectedPhase && (
                  <>
                    <option value="all">All of {selectedPhase.name} (Full Month)</option>
                    {availableGwsForPhase.map((gw) => (
                      <option key={gw} value={gw}>
                        Gameweek {gw}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '18px' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '16px', color: '#CCFF00', animation: 'spin 1s linear infinite' }}
              >
                autorenew
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#9E9E9E' }}>
                LOADING...
              </span>
            </div>
          )}
        </div>
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

        {/* Banner header: Active Filter Context & Qualification Info */}
        <div
          style={{
            backgroundColor: '#141414',
            padding: '14px 16px',
            borderBottom: '1px solid #222222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
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
                fontSize: '11px',
                fontWeight: 800,
                color: showQualificationZone ? '#00FF88' : '#CCFF00',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {selectedPhaseId ? `${selectedPhase?.name.toUpperCase()} STANDINGS` : 'SEASON OVERVIEW STANDINGS'}
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

        {/* Table Column Headers */}
        <div
          className="standings-grid-layout"
          style={{
            borderBottom: '1px solid #222222',
            alignItems: 'center',
            backgroundColor: '#111111',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#666666',
              textAlign: 'center',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.12em',
            }}
          >
            {t.rank}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#666666',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.12em',
            }}
          >
            {t.teamAndManager}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#666666',
              textAlign: 'right',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.12em',
            }}
          >
            {selectedPhaseId && (selectedGw === 'all' || selectedGw === null) ? t.monthPts : t.gwPts}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#666666',
              textAlign: 'right',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.12em',
            }}
          >
            {selectedPhaseId && (selectedGw === 'all' || selectedGw === null) ? t.monthPts : t.totalPts}
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
                  style={{
                    borderBottom: '1px solid #1e1e1e',
                    alignItems: 'center',
                    position: 'relative',
                    backgroundColor: isTop3
                      ? 'rgba(204, 255, 0, 0.05)'
                      : isQualifyingNonTop3
                      ? 'rgba(0, 255, 136, 0.035)'
                      : 'transparent',
                  }}
                  className="standings-grid-layout standing-row-hover"
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

                  {/* Team & Manager */}
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
                        }}
                        title={row.team}
                      >
                        {row.team}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        color: isTop3 ? '#c4c9ac' : isQualifyingZone ? '#99ccaa' : '#666666',
                        marginTop: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={row.manager}
                    >
                      {row.manager}
                    </span>
                  </div>

                  {/* GW / Month Pts */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      textAlign: 'right',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isQualifyingZone ? '#9E9E9E' : '#666666',
                    }}
                  >
                    {row.gw}
                  </div>

                  {/* Total Pts */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      textAlign: 'right',
                      fontSize: '14px',
                      color: isTop3 ? '#CCFF00' : isQualifyingZone ? '#FFFFFF' : '#aaaaaa',
                      fontWeight: isTop3 || isQualifyingZone ? 800 : 600,
                    }}
                  >
                    {row.tot}
                  </div>
                </div>

                {/* Qualification Cutoff Divider Marker Row (Prominent Full-Width Banner) */}
                {showQualificationDivider && (
                  <div
                    style={{
                      background: 'linear-gradient(90deg, rgba(0, 255, 136, 0.22) 0%, rgba(0, 255, 136, 0.05) 100%)',
                      borderTop: '2px solid #00FF88',
                      borderBottom: '2px solid #00FF88',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '4px 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0, 255, 136, 0.1)',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#00FF88', flexShrink: 0 }}>
                      emoji_events
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(10px, 2.5vw, 12px)',
                        fontWeight: 900,
                        color: '#00FF88',
                        letterSpacing: '0.12em',
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
      </section>
    </div>
  );
};
