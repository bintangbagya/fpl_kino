import React from 'react';
import { useCupPageData } from '../hooks/useCupPageData';

export const CupPage: React.FC = () => {
  const { isGw19Finished, r16Matchups, loading, error } = useCupPageData();

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

        {/* Decorative background trophy */}
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
          🏆
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
              UNOFFICIAL CUP
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
            FPL KINO CUP
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

      {/* 2. Cup Schedule Card */}
      <section
        style={{
          border: '1px solid #222222',
          backgroundColor: '#141414',
          borderRadius: '14px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
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
          }}
        />
        {/* Glowing light ornament */}
        <div
          style={{
            position: 'absolute',
            right: '-32px',
            top: '-32px',
            width: '128px',
            height: '128px',
            background: 'radial-gradient(circle, rgba(204, 255, 0, 0.08) 0%, rgba(204, 255, 0, 0) 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '24px' }}>
            calendar_month
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '22px',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            CUP SCHEDULE
          </h3>
        </div>

        {/* Schedule Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Round of 16 (GW 20) */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#CCFF00',
                  boxShadow: '0 0 12px rgba(204, 255, 0, 0.6)',
                }}
              />
              <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(204, 255, 0, 0.4)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#CCFF00',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                QUALIFICATION PHASE
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Round of 16
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '2px' }}>
                Gameweek 20
              </span>
            </div>
          </div>

          {/* Round of 8 (GW 21) */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #333333',
                  backgroundColor: '#0D0D0D',
                }}
              />
              <div style={{ width: '1px', height: '32px', backgroundColor: '#222222' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px', opacity: 0.7 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#9E9E9E',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                UPCOMING
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Quarter-Finals
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '2px' }}>
                Gameweek 21
              </span>
            </div>
          </div>

          {/* Semi-Finals (GW 22) */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #333333',
                  backgroundColor: '#0D0D0D',
                }}
              />
              <div style={{ width: '1px', height: '32px', backgroundColor: '#222222' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px', opacity: 0.5 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#9E9E9E',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                UPCOMING
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Semi-Finals
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '2px' }}>
                Gameweek 22
              </span>
            </div>
          </div>

          {/* Final Match (GW 23) */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: '2px solid #333333',
                  backgroundColor: '#201f1f',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#CCFF00' }}>
                  emoji_events
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px', opacity: 0.5 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#CCFF00',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                THE CLIMAX
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Final Match
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '2px' }}>
                Gameweek 23
              </span>
            </div>
          </div>
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
          ⚠️ Error loading cup data: {error}
        </div>
      )}

      {/* 3. Tournament Bracket Section */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '26px',
              fontWeight: 900,
              color: '#CCFF00',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              margin: 0,
            }}
          >
            TOURNAMENT BRACKET
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {!isGw19Finished && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#CCFF00',
                    backgroundColor: 'rgba(204, 255, 0, 0.12)',
                    border: '1px solid rgba(204, 255, 0, 0.3)',
                    padding: '3px 10px',
                    borderRadius: '100px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#CCFF00' }}>
                    hourglass_top
                  </span>
                  QUALIFICATION IN PROGRESS (GW19 CUTOFF)
                </span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#CCFF00',
                  backgroundColor: 'rgba(204, 255, 0, 0.12)',
                  border: '1px solid rgba(204, 255, 0, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#CCFF00' }}>
                  account_tree
                </span>
                BRACKET MATCHES (GW20 - GW23)
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable tree container */}
        <div
          style={{
            width: '100%',
            overflowX: 'auto',
            paddingBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              minWidth: '960px',
              gap: '48px',
              alignItems: 'stretch',
              minHeight: '640px',
              position: 'relative',
            }}
          >
            {/* 1. Round of 16 Column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '16px',
                padding: '16px 0',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#CCFF00',
                  textAlign: 'center',
                  marginBottom: '8px',
                  paddingBottom: '6px',
                  borderBottom: '2px solid rgba(204, 255, 0, 0.4)',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                R16 (GW20)
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  height: '100%',
                  gap: '16px',
                }}
              >
                {loading && (
                  <div style={{ textAlign: 'center', color: '#9E9E9E', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    Loading bracket matchups...
                  </div>
                )}

                {!loading && r16Matchups.map((match, idx) => {
                  const isUpperMatch = idx % 2 === 0;

                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#141414',
                        borderRadius: '10px',
                        border: '1px solid #222222',
                        overflow: 'hidden',
                        height: '56px',
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      {/* Home Team */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '50%',
                          padding: '0 12px',
                          backgroundColor: '#141414',
                          borderBottom: '1px solid #1e1e1e',
                          opacity: isGw19Finished ? 1 : 0.9,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: '#CCFF00',
                            fontWeight: 800,
                            marginRight: '8px',
                          }}
                        >
                          #{match.home.pos}
                        </span>
                        <span
                          style={{
                            fontFamily: isGw19Finished ? 'var(--font-body)' : 'var(--font-mono)',
                            fontWeight: 700,
                            fontSize: isGw19Finished ? '13px' : '12px',
                            color: isGw19Finished ? '#FFFFFF' : '#CCFF00',
                            letterSpacing: isGw19Finished ? 'normal' : '0.05em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {match.home.team}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '50%',
                          padding: '0 12px',
                          backgroundColor: '#141414',
                          opacity: isGw19Finished ? 0.85 : 0.9,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: isGw19Finished ? '#9E9E9E' : '#CCFF00',
                            fontWeight: isGw19Finished ? 700 : 800,
                            marginRight: '8px',
                          }}
                        >
                          #{match.away.pos}
                        </span>
                        <span
                          style={{
                            fontFamily: isGw19Finished ? 'var(--font-body)' : 'var(--font-mono)',
                            fontWeight: 700,
                            fontSize: isGw19Finished ? '13px' : '12px',
                            color: isGw19Finished ? '#c4c9ac' : '#CCFF00',
                            letterSpacing: isGw19Finished ? 'normal' : '0.05em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {match.away.team}
                        </span>
                      </div>

                      {/* Right Outgoing Connectors */}
                      <div
                        style={{
                          position: 'absolute',
                          right: '-24px',
                          top: '50%',
                          width: '24px',
                          height: '2px',
                          backgroundColor: 'rgba(204, 255, 0, 0.4)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          right: '-24px',
                          top: isUpperMatch ? '50%' : 'auto',
                          bottom: isUpperMatch ? 'auto' : '50%',
                          width: '2px',
                          height: 'calc(50% + 20px)',
                          backgroundColor: 'rgba(204, 255, 0, 0.4)',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Quarter-Finals Column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '16px',
                padding: '16px 0',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#666666',
                  textAlign: 'center',
                  marginBottom: '8px',
                  paddingBottom: '6px',
                  borderBottom: '2px solid #222222',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                QF (GW21)
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  height: '100%',
                }}
              >
                {[0, 1, 2, 3].map((matchIdx) => {
                  const isUpperMatch = matchIdx % 2 === 0;

                  return (
                    <div
                      key={matchIdx}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#141414',
                        borderRadius: '10px',
                        border: '1px solid #222222',
                        padding: '4px',
                        opacity: 0.5,
                        height: '56px',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          height: 'calc(50% - 2px)',
                          backgroundColor: '#1c1c1c',
                          borderRadius: '6px',
                          marginBottom: '4px',
                        }}
                      />
                      <div
                        style={{
                          height: 'calc(50% - 2px)',
                          backgroundColor: '#1c1c1c',
                          borderRadius: '6px',
                        }}
                      />

                      {/* Left Incoming Connector */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-24px',
                          top: '50%',
                          width: '24px',
                          height: '2px',
                          backgroundColor: 'rgba(204, 255, 0, 0.4)',
                        }}
                      />

                      {/* Right Outgoing Connectors */}
                      <div
                        style={{
                          position: 'absolute',
                          right: '-24px',
                          top: '50%',
                          width: '24px',
                          height: '2px',
                          backgroundColor: 'rgba(204, 255, 0, 0.4)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          right: '-24px',
                          top: isUpperMatch ? '50%' : 'auto',
                          bottom: isUpperMatch ? 'auto' : '50%',
                          width: '2px',
                          height: 'calc(100% + 56px)',
                          backgroundColor: 'rgba(204, 255, 0, 0.4)',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Semi-Finals Column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '16px',
                padding: '16px 0',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#666666',
                  textAlign: 'center',
                  marginBottom: '8px',
                  paddingBottom: '6px',
                  borderBottom: '2px solid #222222',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                SF (GW22)
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  height: '100%',
                }}
              >
                {[0, 1].map((matchIdx) => {
                  const isUpperMatch = matchIdx % 2 === 0;

                  return (
                    <div
                      key={matchIdx}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#141414',
                        borderRadius: '10px',
                        border: '1px solid #222222',
                        padding: '4px',
                        opacity: 0.5,
                        height: '56px',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          height: 'calc(50% - 2px)',
                          backgroundColor: '#1c1c1c',
                          borderRadius: '6px',
                          marginBottom: '4px',
                        }}
                      />
                      <div
                        style={{
                          height: 'calc(50% - 2px)',
                          backgroundColor: '#1c1c1c',
                          borderRadius: '6px',
                        }}
                      />

                      {/* Left Incoming Connector */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-24px',
                          top: '50%',
                          width: '24px',
                          height: '2px',
                          backgroundColor: 'rgba(204, 255, 0, 0.4)',
                        }}
                      />

                      {/* Right Outgoing Connectors */}
                      <div
                        style={{
                          position: 'absolute',
                          right: '-24px',
                          top: '50%',
                          width: '24px',
                          height: '2px',
                          backgroundColor: 'rgba(204, 255, 0, 0.4)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          right: '-24px',
                          top: isUpperMatch ? '50%' : 'auto',
                          bottom: isUpperMatch ? 'auto' : '50%',
                          width: '2px',
                          height: 'calc(200% + 56px)',
                          backgroundColor: 'rgba(204, 255, 0, 0.4)',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Final Match Column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '16px',
                padding: '16px 0',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#CCFF00',
                  textAlign: 'center',
                  marginBottom: '8px',
                  paddingBottom: '6px',
                  borderBottom: '2px solid rgba(204, 255, 0, 0.4)',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                FINAL (GW23)
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#141414',
                    borderRadius: '10px',
                    border: '2px solid rgba(204, 255, 0, 0.3)',
                    padding: '4px',
                    boxShadow: '0 0 16px rgba(204, 255, 0, 0.08)',
                    height: '64px',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      height: 'calc(50% - 2px)',
                      backgroundColor: '#1c1c1c',
                      borderRadius: '6px',
                      marginBottom: '4px',
                    }}
                  />
                  <div
                    style={{
                      height: 'calc(50% - 2px)',
                      backgroundColor: '#1c1c1c',
                      borderRadius: '6px',
                    }}
                  />

                  {/* Left Incoming Connector */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-24px',
                      top: '50%',
                      width: '24px',
                      height: '2px',
                      backgroundColor: 'rgba(204, 255, 0, 0.4)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
