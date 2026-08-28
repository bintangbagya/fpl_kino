import React from 'react';
import { useLeaguePageData } from '../hooks/useLeaguePageData';

export const LeaguePage: React.FC = () => {
  const { standings, availableGws, selectedGw, setSelectedGw, loading, error } = useLeaguePageData();



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
          background: 'radial-gradient(circle, rgba(204, 255, 0, 0.05) 0%, rgba(13, 13, 13, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header Banner Card */}
      <section
        style={{
          border: '1px solid #222222',
          backgroundColor: '#141414',
          borderRadius: '14px',
          padding: '24px 32px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
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
            height: '3px',
            background: 'linear-gradient(90deg, #CCFF00 0%, #00FF88 100%)',
          }}
        />

        {/* Background icon decoration */}
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-20px',
            fontSize: '180px',
            color: 'rgba(204, 255, 0, 0.03)',
            pointerEvents: 'none',
            userSelect: 'none',
            fontStyle: 'normal',
          }}
        >
          sports_soccer
        </span>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p
            className="font-label-caps"
            style={{
              color: '#CCFF00',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: '11px',
              margin: 0,
            }}
          >
            Unofficial League
          </p>
          <h1
            className="font-display-lg"
            style={{
              fontSize: '40px',
              color: '#FFFFFF',
              fontStyle: 'italic',
              textTransform: 'uppercase',
              margin: '4px 0 8px 0',
              lineHeight: 1,
            }}
          >
            FPL Kino League
          </h1>
          <div
            className="font-label-caps"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9E9E9E',
              letterSpacing: '0.15em',
              fontSize: '11px',
            }}
          >
            <span>PLAY</span>
            <span style={{ color: '#CCFF00' }}>•</span>
            <span>COMPETE</span>
            <span style={{ color: '#CCFF00' }}>•</span>
            <span>CONNECT</span>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-end',
          zIndex: 1,
        }}
      >
        {/* GW Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '11px' }}>
            Filter by Gameweek
          </label>
          <div
            style={{
              position: 'relative',
              border: '1px solid #222222',
              backgroundColor: '#141414',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px',
              cursor: 'pointer',
              minWidth: '160px',
            }}
          >
            <span className="font-body-md" style={{ color: '#FFFFFF', fontSize: '14px' }}>
              {selectedGw !== null ? `GW${selectedGw}` : 'Loading...'}
            </span>
            <span className="material-symbols-outlined" style={{ color: '#9E9E9E', fontSize: '20px' }}>
              expand_more
            </span>
            <select
              value={selectedGw ?? ''}
              onChange={(e) => setSelectedGw(Number(e.target.value))}
              disabled={availableGws.length === 0}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%',
              }}
            >
              {availableGws.map((gw) => (
                <option key={gw} value={gw}>
                  GW{gw}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px' }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px', color: '#CCFF00', animation: 'spin 1s linear infinite' }}
            >
              autorenew
            </span>
            <span className="font-label-caps" style={{ fontSize: '10px', color: '#9E9E9E' }}>
              LOADING...
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
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      {/* Standings Table Card */}
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
        {/* Banner header: Qualify info */}
        <div
          style={{
            backgroundColor: '#141414',
            padding: '12px 16px',
            borderBottom: '1px solid #222222',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#CCFF00',
              borderRadius: '50%',
              display: 'inline-block',
            }}
            className="live-dot"
          />
          <span
            className="font-label-caps"
            style={{
              fontSize: '11px',
              color: '#CCFF00',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Top 16 qualify for FPL Kino Cup
          </span>
        </div>

        {/* Table Header Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '48px 1fr 100px 100px',
            gap: '12px',
            padding: '12px 16px',
            borderBottom: '1px solid #222222',
            alignItems: 'center',
            backgroundColor: '#111111',
          }}
        >
          <div className="font-label-caps" style={{ color: '#9E9E9E', textAlign: 'center', fontSize: '11px' }}>
            RNK
          </div>
          <div className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '11px' }}>
            TEAM & MANAGER
          </div>
          <div className="font-label-caps" style={{ color: '#9E9E9E', textAlign: 'right', fontSize: '11px' }}>
            GW PTS
          </div>
          <div className="font-label-caps" style={{ color: '#9E9E9E', textAlign: 'right', fontSize: '11px' }}>
            TOTAL
          </div>
        </div>

        {/* Table Rows Body (Scrollable) */}
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
                fontSize: '13px',
              }}
            >
              Belum ada data untuk GW ini.
            </div>
          )}
          {standings.map((row) => {
            const isTop3 = row.pos <= 3;
            const isQualified = row.pos <= 16;
            const showQualificationDivider = row.pos === 16;

            return (
              <React.Fragment key={`${row.pos}-${row.team}`}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '48px 1fr 100px 100px',
                    gap: '12px',
                    padding: '14px 16px',
                    borderBottom: '1px solid #222222',
                    alignItems: 'center',
                    position: 'relative',
                    backgroundColor: isTop3 ? 'rgba(204, 255, 0, 0.02)' : 'transparent',
                    transition: 'background-color 0.2s ease',
                  }}
                  className="standing-row-hover"
                >
                  {/* Left accent line for qualification zone */}
                  {isQualified && (
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
                  )}

                  {/* Rank */}
                  <div
                    className="font-stat-value"
                    style={{
                      textAlign: 'center',
                      fontSize: isTop3 ? '16px' : '14px',
                      color: isTop3 ? '#CCFF00' : '#9E9E9E',
                      fontWeight: isTop3 ? 800 : 500,
                    }}
                  >
                    {row.pos}
                  </div>

                  {/* Team & Manager */}
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        className="font-body-md"
                        style={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: isTop3 ? '#CCFF00' : '#FFFFFF',
                          textTransform: 'uppercase',
                        }}
                      >
                        {row.team}
                      </span>
                      {isQualified && !isTop3 && (
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            backgroundColor: '#CCFF00',
                          }}
                        />
                      )}
                    </div>
                    <span
                      className="font-label-caps"
                      style={{
                        fontSize: '11px',
                        color: isQualified ? '#CCFF00' : '#9E9E9E',
                        opacity: isTop3 ? 1 : 0.7,
                        textTransform: 'uppercase',
                        marginTop: '2px',
                      }}
                    >
                      {row.manager}
                    </span>
                  </div>

                  {/* GW Pts */}
                  <div
                    className="font-stat-value"
                    style={{
                      textAlign: 'right',
                      fontSize: '14px',
                      color: '#9E9E9E',
                    }}
                  >
                    {row.gw}
                  </div>

                  {/* Total */}
                  <div
                    className="font-stat-value"
                    style={{
                      textAlign: 'right',
                      fontSize: '14px',
                      color: '#FFFFFF',
                      fontWeight: 700,
                    }}
                  >
                    {row.tot}
                  </div>
                </div>

                {/* Qualification Zone Divider Marker */}
                {showQualificationDivider && (
                  <div
                    style={{
                      backgroundColor: '#181818',
                      padding: '10px 16px',
                      borderBottom: '1px solid #222222',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#CCFF00',
                        borderRadius: '50%',
                        display: 'inline-block',
                      }}
                      className="live-dot"
                    />
                    <span
                      className="font-label-caps"
                      style={{
                        fontSize: '10px',
                        color: '#CCFF00',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Kino Cup Qualification Zone
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
