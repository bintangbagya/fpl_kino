import React from 'react';

export const PrizePoolPage: React.FC = () => {
  const styleSheet = `
    @media (max-width: 640px) {
      .podium-container {
        flex-direction: column !important;
        gap: 16px !important;
      }
      .podium-item-1 {
        order: 1 !important;
        width: 100% !important;
      }
      .podium-item-2 {
        order: 2 !important;
        width: 100% !important;
        padding-top: 0 !important;
      }
      .podium-item-3 {
        order: 3 !important;
        width: 100% !important;
        padding-top: 0 !important;
      }
      .rewards-grid-2col {
        grid-template-columns: 1fr !important;
      }
      .summary-grid-item {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 4px !important;
      }
    }
    @media (min-width: 641px) {
      .podium-container {
        flex-direction: row !important;
        align-items: flex-end !important;
      }
      .podium-item-1 {
        order: 2 !important;
        flex: 1 !important;
      }
      .podium-item-2 {
        order: 1 !important;
        flex: 1 !important;
        padding-top: 32px !important;
      }
      .podium-item-3 {
        order: 3 !important;
        flex: 1 !important;
        padding-top: 48px !important;
      }
      .rewards-grid-2col {
        grid-template-columns: 1fr 1fr !important;
      }
    }
    .neon-text-glow {
      text-shadow: 0 0 16px rgba(204, 255, 0, 0.4);
    }
    .podium-first-glow {
      box-shadow: 0 0 24px rgba(204, 255, 0, 0.18);
    }
    .prize-row-hover {
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    .prize-row-hover:hover {
      background-color: rgba(204, 255, 0, 0.03);
      border-color: rgba(204, 255, 0, 0.25);
    }
  `;

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
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />

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

        {/* Decorative background soccer icon */}
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-20px',
            fontSize: '180px',
            color: 'rgba(204, 255, 0, 0.04)',
            pointerEvents: 'none',
            userSelect: 'none',
            fontStyle: 'normal',
          }}
        >
          sports_soccer
        </span>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
              REWARDS & PRIZES
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
            PRIZE POOL
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

      {/* Total Prize Pool Highlight Section */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#141414',
          border: '1px solid #222222',
          borderRadius: '14px',
          padding: '28px 24px',
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

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#CCFF00',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  margin: 0,
                }}
              >
                TOTAL PRIZE POOL
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                <h3
                  className="neon-text-glow"
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 900,
                    fontSize: 'clamp(36px, 6vw, 56px)',
                    color: '#CCFF00',
                    letterSpacing: '-0.02em',
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  Rp4.410.000
                </h3>
                <span
                  className="material-symbols-outlined"
                  style={{ color: '#CCFF00', opacity: 0.8, fontSize: '32px' }}
                >
                  payments
                </span>
              </div>
            </div>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#9E9E9E',
              letterSpacing: '0.08em',
              marginTop: '12px',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            TOTAL REWARDS & CASH PRIZES AVAILABLE FOR FPL KINO INDONESIA 2026/27
          </p>
        </div>

        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            right: '-32px',
            bottom: '-32px',
            fontSize: '220px',
            color: '#CCFF00',
            opacity: 0.03,
            pointerEvents: 'none',
            userSelect: 'none',
            fontStyle: 'normal',
          }}
        >
          payments
        </span>
      </section>

      {/* Main Layout Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          zIndex: 1,
        }}
      >
        {/* Left Column: Overall Full Season, Half Season & Kino Cup */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
          className="col-lg-8"
        >
          {/* Full Season Champions Podium Card */}
          <div
            style={{
              backgroundColor: '#141414',
              border: '1px solid #222222',
              borderRadius: '14px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background trophy icon */}
            <span
              className="material-symbols-outlined"
              style={{
                position: 'absolute',
                right: '-16px',
                bottom: '-16px',
                fontSize: '180px',
                color: '#CCFF00',
                opacity: 0.04,
                pointerEvents: 'none',
                userSelect: 'none',
                fontStyle: 'normal',
              }}
            >
              emoji_events
            </span>

            {/* Header info */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '28px',
                position: 'relative',
                zIndex: 10,
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
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
                  FULL SEASON CHAMPIONS
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: '#9E9E9E',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    marginTop: '4px',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  Grand Champions of the Season (GW1 — GW38)
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 10px',
                    backgroundColor: '#CCFF00',
                    color: '#000000',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  FULL SEASON
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 10px',
                    backgroundColor: '#0D0D0D',
                    border: '1px solid #333333',
                    color: '#CCFF00',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  TOTAL: Rp1.400.000
                </span>
              </div>
            </div>

            {/* Podium grid */}
            <div className="podium-container" style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 10 }}>
              {/* 2nd Place */}
              <div className="podium-item-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%' }}>
                <div
                  style={{
                    backgroundColor: '#0D0D0D',
                    padding: '20px 16px',
                    border: '1px solid #222222',
                    borderRadius: '14px',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#C0C0C0', marginBottom: '8px', fontSize: '32px' }}>
                    military_tech
                  </span>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', margin: 0, fontWeight: 700, letterSpacing: '0.08em' }}>
                    2ND PLACE
                  </p>
                  <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, color: '#CCFF00', fontSize: '24px', margin: '6px 0 0 0' }}>
                    Rp400.000
                  </p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="podium-item-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%' }}>
                <div
                  className="podium-first-glow"
                  style={{
                    backgroundColor: 'rgba(204, 255, 0, 0.06)',
                    border: '1px solid #CCFF00',
                    padding: '28px 16px',
                    borderRadius: '14px',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#CCFF00',
                      color: '#000000',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 900,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    CHAMPION
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#CCFF00', marginBottom: '8px', fontSize: '44px' }}>
                    workspace_premium
                  </span>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FFFFFF', margin: 0, fontWeight: 800, letterSpacing: '0.08em' }}>
                    1ST PLACE
                  </p>
                  <p
                    className="neon-text-glow"
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 900,
                      color: '#CCFF00',
                      fontSize: '32px',
                      margin: '8px 0 0 0',
                    }}
                  >
                    Rp750.000
                  </p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="podium-item-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%' }}>
                <div
                  style={{
                    backgroundColor: '#0D0D0D',
                    padding: '20px 16px',
                    border: '1px solid #222222',
                    borderRadius: '14px',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#CD7F32', marginBottom: '8px', fontSize: '32px' }}>
                    military_tech
                  </span>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', margin: 0, fontWeight: 700, letterSpacing: '0.08em' }}>
                    3RD PLACE
                  </p>
                  <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, color: '#CCFF00', fontSize: '24px', margin: '6px 0 0 0' }}>
                    Rp250.000
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Half Season & FPL Kino Cup Grid */}
          <div className="rewards-grid-2col" style={{ display: 'grid', gap: '24px' }}>
            {/* Half Season Champions */}
            <div
              style={{
                backgroundColor: '#141414',
                border: '1px solid #222222',
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '22px' }}>
                      analytics
                    </span>
                    <h4
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '18px',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        margin: 0,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                      }}
                    >
                      HALF SEASON
                    </h4>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#CCFF00',
                      backgroundColor: 'rgba(204, 255, 0, 0.1)',
                      border: '1px solid rgba(204, 255, 0, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Rp700.000
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#9E9E9E',
                    letterSpacing: '0.08em',
                    marginBottom: '20px',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  TOP MANAGERS (GW1 — GW19)
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    className="prize-row-hover"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #222222',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontSize: '11px', fontWeight: 800 }}>
                      🥇 1ST PLACE
                    </span>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, color: '#CCFF00', fontSize: '16px' }}>
                      Rp350.000
                    </span>
                  </div>
                  <div
                    className="prize-row-hover"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #222222',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#9E9E9E', fontSize: '11px', fontWeight: 700 }}>
                      🥈 2ND PLACE
                    </span>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, color: '#CCFF00', fontSize: '16px' }}>
                      Rp200.000
                    </span>
                  </div>
                  <div
                    className="prize-row-hover"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #222222',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#9E9E9E', fontSize: '11px', fontWeight: 700 }}>
                      🥉 3RD PLACE
                    </span>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, color: '#CCFF00', fontSize: '16px' }}>
                      Rp150.000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FPL Kino Cup */}
            <div
              style={{
                backgroundColor: '#141414',
                border: '1px solid #222222',
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '22px' }}>
                      sports_kabaddi
                    </span>
                    <h4
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '18px',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        margin: 0,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                      }}
                    >
                      FPL KINO CUP
                    </h4>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#CCFF00',
                      backgroundColor: 'rgba(204, 255, 0, 0.1)',
                      border: '1px solid rgba(204, 255, 0, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Rp550.000
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#9E9E9E',
                    letterSpacing: '0.08em',
                    marginBottom: '20px',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  KNOCKOUT TOURNAMENT WINNERS
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    className="prize-row-hover"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #222222',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontSize: '11px', fontWeight: 800 }}>
                      🏆 CHAMPION
                    </span>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, color: '#CCFF00', fontSize: '16px' }}>
                      Rp350.000
                    </span>
                  </div>
                  <div
                    className="prize-row-hover"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #222222',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#9E9E9E', fontSize: '11px', fontWeight: 700 }}>
                      🥈 RUNNER UP
                    </span>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, color: '#CCFF00', fontSize: '16px' }}>
                      Rp200.000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Monthly and Weekly rewards */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
          className="col-lg-4"
        >
          {/* Manager of the Month */}
          <div
            style={{
              backgroundColor: '#141414',
              border: '1px solid #222222',
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}
              >
                MANAGER OF THE <span style={{ color: '#CCFF00' }}>MONTH</span>
              </h4>
              <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '24px' }}>
                calendar_month
              </span>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#9E9E9E',
                letterSpacing: '0.08em',
                marginBottom: '16px',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              10 MONTHLY AWARDS × 10 WINNERS
            </p>

            <div
              style={{
                backgroundColor: '#0D0D0D',
                border: '1px solid rgba(204, 255, 0, 0.25)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                background: 'linear-gradient(135deg, #0D0D0D 0%, #161a00 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '18px' }}>
                  event_available
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em' }}>
                  MONTHLY WINNER PRIZE
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  color: '#CCFF00',
                  fontSize: '18px',
                  letterSpacing: '0.02em',
                }}
              >
                Rp100.000
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: '#9E9E9E',
                  margin: 0,
                  lineHeight: '1.4',
                }}
              >
                Awarded to the highest scoring manager of each month across 10 months.
              </p>
            </div>
          </div>

          {/* Manager of the Week */}
          <div
            style={{
              backgroundColor: '#141414',
              border: '1px solid #222222',
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}
              >
                MANAGER OF THE <span style={{ color: '#CCFF00' }}>WEEK</span>
              </h4>
              <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '24px' }}>
                local_cafe
              </span>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#9E9E9E',
                letterSpacing: '0.08em',
                marginBottom: '16px',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              38 GAMEWEEKS × 38 WINNERS
            </p>

            <div
              style={{
                backgroundColor: '#0D0D0D',
                border: '1px solid rgba(204, 255, 0, 0.25)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                background: 'linear-gradient(135deg, #0D0D0D 0%, #161a00 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '18px' }}>
                  emoji_food_beverage
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em' }}>
                  WEEKLY WINNER PRIZE
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  color: '#CCFF00',
                  fontSize: '18px',
                  letterSpacing: '0.02em',
                }}
              >
                FREE JavaLatte BlueLane
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: '#9E9E9E',
                  margin: 0,
                  lineHeight: '1.4',
                }}
              >
                Awarded to the highest scoring manager of each individual Gameweek across 38 GWs.
              </p>
            </div>

            {/* Season Progress */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#9E9E9E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Season Progress
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#CCFF00', letterSpacing: '0.08em', fontWeight: 800 }}>
                  GW 2 / 38
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  width: '100%',
                  backgroundColor: '#0D0D0D',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  border: '1px solid #222222',
                }}
              >
                <div style={{ height: '100%', backgroundColor: '#CCFF00', width: '5.2%', borderRadius: '9999px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grand Total Summary Card */}
      <section
        style={{
          backgroundColor: '#141414',
          border: '1px solid #222222',
          borderRadius: '14px',
          padding: '24px',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '24px' }}>
            summarize
          </span>
          <h4
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '20px',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            GRAND TOTAL PRIZE BREAKDOWN
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { cat: 'Full Season Champion', detail: '1st Place (Rp750.000) + 2nd Place (Rp400.000) + 3rd Place (Rp250.000)', subtotal: 'Rp1.400.000' },
            { cat: 'Manager of the Month', detail: '10 Monthly Awards × Rp100.000', subtotal: 'Rp1.000.000' },
            { cat: 'Half Season Champion', detail: '1st Place (Rp350.000) + 2nd Place (Rp200.000) + 3rd Place (Rp150.000)', subtotal: 'Rp700.000' },
            { cat: 'FPL Kino Cup', detail: 'Champion (Rp350.000) + Runner Up (Rp200.000)', subtotal: 'Rp550.000' },
            { cat: 'Manager of the Week', detail: '38 Gameweeks × FREE JavaLatte BlueLane (Rp20.000)', subtotal: 'Rp760.000' },
          ].map((row, idx) => (
            <div
              key={idx}
              className="summary-grid-item"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#0D0D0D',
                border: '1px solid #222222',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FFFFFF', fontWeight: 800 }}>
                  {row.cat}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#9E9E9E' }}>
                  {row.detail}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#CCFF00', fontWeight: 900 }}>
                {row.subtotal}
              </span>
            </div>
          ))}
        </div>

        {/* Grand Total Footer Bar */}
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(204, 255, 0, 0.08)',
            border: '1px solid #CCFF00',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.05em' }}>
            GRAND TOTAL PRIZES
          </span>
          <span
            className="neon-text-glow"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: 900, color: '#CCFF00', letterSpacing: '0.02em' }}
          >
            Rp4.410.000
          </span>
        </div>
      </section>

      {/* Terms & Conditions Footer */}
      <footer
        style={{
          marginTop: '16px',
          borderTop: '1px solid #222222',
          paddingTop: '24px',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
          <h5
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '14px',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            TERMS & CONDITIONS
          </h5>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#9E9E9E',
              lineHeight: '1.6',
              letterSpacing: '0.02em',
              margin: 0,
              textTransform: 'none',
            }}
          >
            All results and prize calculations follow the official FPL data and scoring system. Competition decisions are final and binding.
          </p>
        </div>
      </footer>
    </div>
  );
};
