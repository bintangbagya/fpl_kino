import React from 'react';
import { mockLeagueStandingsByGw } from '../data/dummyData';

export const CupPage: React.FC = () => {
  // Fetch top 16 teams from GW6 standings to populate Round of 16 matchups
  const top16Teams = mockLeagueStandingsByGw['GW6']?.slice(0, 16) || [];

  // Matchups mapping:
  // Match 1: #1 vs #9
  // Match 2: #2 vs #10
  // Match 3: #3 vs #11
  // Match 4: #4 vs #12
  // Match 5: #5 vs #13
  // Match 6: #6 vs #14
  // Match 7: #7 vs #15
  // Match 8: #8 vs #16
  const r16Matchups = [
    { home: top16Teams[0], away: top16Teams[8] },
    { home: top16Teams[1], away: top16Teams[9] },
    { home: top16Teams[2], away: top16Teams[10] },
    { home: top16Teams[3], away: top16Teams[11] },
    { home: top16Teams[4], away: top16Teams[12] },
    { home: top16Teams[5], away: top16Teams[13] },
    { home: top16Teams[6], away: top16Teams[14] },
    { home: top16Teams[7], away: top16Teams[15] },
  ];

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
        {/* Background Soccer Ball Decoration */}
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
            UNOFFICIAL CUP
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
            FPL KINO CUP
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

      {/* Cup Schedule Card */}
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
            gap: '8px',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '24px' }}>
            calendar_month
          </span>
          <h3
            className="font-headline-lg"
            style={{
              fontSize: '24px',
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.01em',
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
          {/* Round of 16 (GW 19) */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#CCFF00',
                  boxShadow: '0 0 10px rgba(204, 255, 0, 0.5)',
                }}
              />
              <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(204, 255, 0, 0.3)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px' }}>
              <span className="font-label-caps" style={{ color: '#CCFF00', fontSize: '10px' }}>
                LOADING...
              </span>
              <span
                className="font-headline-lg"
                style={{
                  fontSize: '18px',
                  color: '#FFFFFF',
                  marginTop: '2px',
                }}
              >
                Round of 16
              </span>
              <span className="font-body-sm" style={{ color: '#9E9E9E', marginTop: '2px' }}>
                Gameweek 19
              </span>
            </div>
          </div>

          {/* Round of 8 (GW 20) */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #222222',
                  backgroundColor: '#0D0D0D',
                }}
              />
              <div style={{ width: '1px', height: '32px', backgroundColor: '#222222' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px', opacity: 0.7 }}>
              <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '10px' }}>
                UPCOMING
              </span>
              <span
                className="font-headline-lg"
                style={{
                  fontSize: '18px',
                  color: '#FFFFFF',
                  marginTop: '2px',
                }}
              >
                Round of 8
              </span>
              <span className="font-body-sm" style={{ color: '#9E9E9E', marginTop: '2px' }}>
                Gameweek 20
              </span>
            </div>
          </div>

          {/* Semi-Finals (GW 21) */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #222222',
                  backgroundColor: '#0D0D0D',
                }}
              />
              <div style={{ width: '1px', height: '32px', backgroundColor: '#222222' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px', opacity: 0.5 }}>
              <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '10px' }}>
                UPCOMING
              </span>
              <span
                className="font-headline-lg"
                style={{
                  fontSize: '18px',
                  color: '#FFFFFF',
                  marginTop: '2px',
                }}
              >
                Semi-Finals
              </span>
              <span className="font-body-sm" style={{ color: '#9E9E9E', marginTop: '2px' }}>
                Gameweek 21
              </span>
            </div>
          </div>

          {/* Final Match (GW 22) */}
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
                  border: '2px solid #222222',
                  backgroundColor: '#201f1f',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#9E9E9E' }}>
                  emoji_events
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px', opacity: 0.4 }}>
              <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '10px' }}>
                THE CLIMAX
              </span>
              <span
                className="font-headline-lg"
                style={{
                  fontSize: '18px',
                  color: '#FFFFFF',
                  marginTop: '2px',
                }}
              >
                Final Match
              </span>
              <span className="font-body-sm" style={{ color: '#9E9E9E', marginTop: '2px' }}>
                Gameweek 22
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Bracket Section */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 1,
        }}
      >
        <h2
          className="font-headline-lg"
          style={{
            fontSize: '32px',
            color: '#FFFFFF',
            margin: 0,
          }}
        >
          Tournament Bracket
        </h2>

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
                className="font-label-caps"
                style={{
                  fontSize: '12px',
                  color: '#CCFF00',
                  textAlign: 'center',
                  marginBottom: '8px',
                  paddingBottom: '4px',
                  borderBottom: '2px solid rgba(204, 255, 0, 0.3)',
                  fontWeight: 700,
                }}
              >
                R16 (GW19)
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
                {r16Matchups.map((match, idx) => {
                  const isUpperMatch = idx % 2 === 0;

                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#141414',
                        borderRadius: '14px',
                        border: '1px solid #222222',
                        overflow: 'hidden',
                        height: '56px',
                        width: '100%',
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
                          borderBottom: '1px solid #222222',
                        }}
                      >
                        <span
                          className="font-label-caps"
                          style={{
                            fontSize: '11px',
                            color: '#CCFF00',
                            fontWeight: 700,
                            marginRight: '8px',
                          }}
                        >
                          #{match.home?.pos || (idx * 2 + 1)}
                        </span>
                        <span
                          className="font-body-sm"
                          style={{
                            fontWeight: 700,
                            fontSize: '13px',
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {match.home?.team || 'LOADING...'}
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
                          opacity: 0.8,
                        }}
                      >
                        <span
                          className="font-label-caps"
                          style={{
                            fontSize: '11px',
                            color: '#9E9E9E',
                            fontWeight: 700,
                            marginRight: '8px',
                          }}
                        >
                          #{match.away?.pos || (idx * 2 + 2)}
                        </span>
                        <span
                          className="font-body-sm"
                          style={{
                            fontWeight: 700,
                            fontSize: '13px',
                            color: '#9E9E9E',
                            textTransform: 'uppercase',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {match.away?.team || 'LOADING...'}
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
                          backgroundColor: 'rgba(204, 255, 0, 0.3)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          right: '-24px',
                          top: isUpperMatch ? '50%' : 'auto',
                          bottom: isUpperMatch ? 'auto' : '50%',
                          width: '2px',
                          height: 'calc(50% + 20px)', // matches vertical spacing to next level
                          backgroundColor: 'rgba(204, 255, 0, 0.3)',
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
                className="font-label-caps"
                style={{
                  fontSize: '12px',
                  color: '#9E9E9E',
                  textAlign: 'center',
                  marginBottom: '8px',
                  paddingBottom: '4px',
                  borderBottom: '2px solid #222222',
                  fontWeight: 700,
                }}
              >
                QF (GW20)
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
                        borderRadius: '14px',
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
                          backgroundColor: '#201f1f',
                          borderRadius: '6px',
                          marginBottom: '4px',
                        }}
                      />
                      <div
                        style={{
                          height: 'calc(50% - 2px)',
                          backgroundColor: '#201f1f',
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
                          backgroundColor: 'rgba(204, 255, 0, 0.3)',
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
                          backgroundColor: 'rgba(204, 255, 0, 0.3)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          right: '-24px',
                          top: isUpperMatch ? '50%' : 'auto',
                          bottom: isUpperMatch ? 'auto' : '50%',
                          width: '2px',
                          height: 'calc(100% + 56px)', // larger vertical span
                          backgroundColor: 'rgba(204, 255, 0, 0.3)',
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
                className="font-label-caps"
                style={{
                  fontSize: '12px',
                  color: '#9E9E9E',
                  textAlign: 'center',
                  marginBottom: '8px',
                  paddingBottom: '4px',
                  borderBottom: '2px solid #222222',
                  fontWeight: 700,
                }}
              >
                SF (GW21)
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
                        borderRadius: '14px',
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
                          backgroundColor: '#201f1f',
                          borderRadius: '6px',
                          marginBottom: '4px',
                        }}
                      />
                      <div
                        style={{
                          height: 'calc(50% - 2px)',
                          backgroundColor: '#201f1f',
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
                          backgroundColor: 'rgba(204, 255, 0, 0.3)',
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
                          backgroundColor: 'rgba(204, 255, 0, 0.3)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          right: '-24px',
                          top: isUpperMatch ? '50%' : 'auto',
                          bottom: isUpperMatch ? 'auto' : '50%',
                          width: '2px',
                          height: 'calc(200% + 56px)', // even larger vertical span
                          backgroundColor: 'rgba(204, 255, 0, 0.3)',
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
                className="font-label-caps"
                style={{
                  fontSize: '12px',
                  color: '#9E9E9E',
                  textAlign: 'center',
                  marginBottom: '8px',
                  paddingBottom: '4px',
                  borderBottom: '2px solid #222222',
                  fontWeight: 700,
                }}
              >
                FINAL (GW22)
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
                    borderRadius: '14px',
                    border: '2px solid rgba(204, 255, 0, 0.3)',
                    padding: '4px',
                    boxShadow: '0 0 12px rgba(204, 255, 0, 0.05)',
                    height: '64px',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      height: 'calc(50% - 2px)',
                      backgroundColor: '#201f1f',
                      borderRadius: '6px',
                      marginBottom: '4px',
                    }}
                  />
                  <div
                    style={{
                      height: 'calc(50% - 2px)',
                      backgroundColor: '#201f1f',
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
                      backgroundColor: 'rgba(204, 255, 0, 0.3)',
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
