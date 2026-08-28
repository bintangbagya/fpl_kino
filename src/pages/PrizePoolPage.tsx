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
      text-shadow: 0 0 10px rgba(204, 255, 0, 0.4);
    }
    .podium-first-glow {
      box-shadow: 0 0 20px rgba(204, 255, 0, 0.15);
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
            REWARDS & PRIZES
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
            PRIZE POOL
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

      {/* Total Prize Pool Section */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#141414',
          border: '1px solid #222222',
          borderRadius: '14px',
          padding: '24px',
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
          <p
            className="font-label-caps"
            style={{
              fontSize: '10px',
              color: '#9E9E9E',
              letterSpacing: '0.2em',
              marginBottom: '4px',
              margin: 0,
            }}
          >
            TOTAL PRIZE POOL
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <h3
              className="font-display-lg neon-text-glow"
              style={{
                fontSize: '48px',
                color: '#CCFF00',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              PRIZE TBA
            </h3>
            <span
              className="material-symbols-outlined"
              style={{ color: '#CCFF00', opacity: 0.5, fontSize: '24px' }}
            >
              payments
            </span>
          </div>
          <p
            className="font-label-caps"
            style={{
              fontSize: '10px',
              color: '#9E9E9E',
              letterSpacing: '0.08em',
              marginTop: '8px',
              margin: 0,
            }}
          >
            TOTAL REWARDS AVAILABLE FOR FPL KINO 2026/27
          </p>
        </div>
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            right: '-32px',
            bottom: '-32px',
            fontSize: '200px',
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

      {/* Layout Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          zIndex: 1,
        }}
      >
        {/* Left Column: Overall Season & Second Tier Prizes */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
          className="col-lg-8"
        >
          {/* Overall Season Champions Podium Card */}
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
                marginBottom: '32px',
                position: 'relative',
                zIndex: 10,
              }}
            >
              <div>
                <h3
                  className="font-display-lg"
                  style={{
                    fontSize: '24px',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  OVERALL SEASON CHAMPIONS
                </h3>
                <p
                  className="font-label-caps"
                  style={{
                    color: '#9E9E9E',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    marginTop: '4px',
                    margin: 0,
                  }}
                >
                  Grand Champions of the Season
                </p>
              </div>
              <span
                className="font-label-caps"
                style={{
                  padding: '4px 12px',
                  backgroundColor: '#CCFF00',
                  color: '#000000',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 800,
                }}
              >
                FULL SEASON
              </span>
            </div>

            {/* Podium grid */}
            <div className="podium-container" style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 10 }}>
              {/* 2nd Place */}
              <div className="podium-item-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%' }}>
                <div
                  style={{
                    backgroundColor: '#0D0D0D',
                    padding: '16px',
                    border: '1px solid #222222',
                    borderRadius: '14px',
                    textAlign: 'center',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#9E9E9E', marginBottom: '8px', fontSize: '24px' }}>
                    military_tech
                  </span>
                  <p className="font-label-caps" style={{ fontSize: '10px', color: '#9E9E9E', margin: 0 }}>
                    2ND PLACE
                  </p>
                  <p className="font-stat-value" style={{ color: '#CCFF00', fontSize: '20px', margin: '4px 0 0 0' }}>
                    PRIZE TBA
                  </p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="podium-item-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%' }}>
                <div
                  className="podium-first-glow"
                  style={{
                    backgroundColor: 'rgba(204, 255, 0, 0.05)',
                    border: '1px solid #CCFF00',
                    padding: '24px 16px',
                    borderRadius: '14px',
                    textAlign: 'center',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#CCFF00', marginBottom: '8px', fontSize: '40px' }}>
                    workspace_premium
                  </span>
                  <p className="font-label-caps" style={{ fontSize: '12px', color: '#FFFFFF', margin: 0 }}>
                    1ST PLACE
                  </p>
                  <p className="font-stat-value neon-text-glow" style={{ color: '#CCFF00', fontSize: '28px', margin: '8px 0 0 0' }}>
                    PRIZE TBA
                  </p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="podium-item-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%' }}>
                <div
                  style={{
                    backgroundColor: '#0D0D0D',
                    padding: '16px',
                    border: '1px solid #222222',
                    borderRadius: '14px',
                    textAlign: 'center',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#9E9E9E', marginBottom: '8px', fontSize: '24px' }}>
                    military_tech
                  </span>
                  <p className="font-label-caps" style={{ fontSize: '10px', color: '#9E9E9E', margin: 0 }}>
                    3RD PLACE
                  </p>
                  <p className="font-stat-value" style={{ color: '#CCFF00', fontSize: '20px', margin: '4px 0 0 0' }}>
                    PRIZE TBA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Half Season & FPL Kino Cup grid */}
          <div className="rewards-grid-2col" style={{ display: 'grid', gap: '24px' }}>
            {/* Half Season Champions */}
            <div
              style={{
                backgroundColor: '#141414',
                border: '1px solid #222222',
                borderRadius: '14px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '20px' }}>
                  analytics
                </span>
                <h4
                  className="font-display-lg"
                  style={{
                    fontSize: '18px',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  HALF SEASON CHAMPIONS
                </h4>
              </div>
              <p
                className="font-label-caps"
                style={{
                  fontSize: '10px',
                  color: '#9E9E9E',
                  letterSpacing: '0.08em',
                  marginBottom: '16px',
                  margin: 0,
                }}
              >
                WINNERS (GW1 — GW18)
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #222222',
                  }}
                >
                  <span className="font-label-caps" style={{ color: '#FFFFFF', fontSize: '10px' }}>
                    1ST PLACE
                  </span>
                  <span className="font-stat-value" style={{ color: '#CCFF00', fontSize: '14px' }}>
                    PRIZE TBA
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #222222',
                  }}
                >
                  <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '10px' }}>
                    2ND PLACE
                  </span>
                  <span className="font-stat-value" style={{ color: '#CCFF00', fontSize: '14px' }}>
                    PRIZE TBA
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                  }}
                >
                  <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '10px' }}>
                    3RD PLACE
                  </span>
                  <span className="font-stat-value" style={{ color: '#CCFF00', fontSize: '14px' }}>
                    PRIZE TBA
                  </span>
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
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '20px' }}>
                  sports_kabaddi
                </span>
                <h4
                  className="font-display-lg"
                  style={{
                    fontSize: '18px',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  FPL KINO CUP
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #222222',
                  }}
                >
                  <span className="font-label-caps" style={{ color: '#FFFFFF', fontSize: '10px' }}>
                    🥇 CHAMPION
                  </span>
                  <span className="font-stat-value" style={{ color: '#CCFF00', fontSize: '14px' }}>
                    PRIZE TBA
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                  }}
                >
                  <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '10px' }}>
                    🥈 RUNNER UP
                  </span>
                  <span className="font-stat-value" style={{ color: '#CCFF00', fontSize: '14px' }}>
                    PRIZE TBA
                  </span>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h4
                className="font-display-lg"
                style={{
                  fontSize: '18px',
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                MANAGER OF THE <span style={{ color: '#CCFF00' }}>MONTH</span>
              </h4>
              <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '24px' }}>
                calendar_month
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#0D0D0D',
                border: '1px solid #222222',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <p
                className="font-label-caps"
                style={{
                  fontSize: '10px',
                  color: '#9E9E9E',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                  margin: 0,
                }}
              >
                9 MONTHS 9 WINNERS
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span className="font-label-caps" style={{ color: '#FFFFFF', fontSize: '12px' }}>
                  1ST PLACE
                </span>
                <span className="font-stat-value" style={{ color: '#CCFF00', fontSize: '20px' }}>
                  Rp 50.000
                </span>
              </div>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h4
                className="font-display-lg"
                style={{
                  fontSize: '18px',
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                MANAGER OF THE <span style={{ color: '#CCFF00' }}>WEEK</span>
              </h4>
              <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '24px' }}>
                timer
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#0D0D0D',
                border: '1px solid #222222',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <p
                className="font-label-caps"
                style={{
                  fontSize: '10px',
                  color: '#9E9E9E',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                  margin: 0,
                }}
              >
                38 WEEKS 38 WINNERS
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span className="font-label-caps" style={{ color: '#FFFFFF', fontSize: '12px' }}>
                  1ST PLACE
                </span>
                <span className="font-stat-value" style={{ color: '#CCFF00', fontSize: '18px' }}>
                  FREE JAVALATTE
                </span>
              </div>
            </div>

            {/* Season Progress */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                <span className="font-label-caps" style={{ fontSize: '10px', color: '#9E9E9E', letterSpacing: '0.08em' }}>
                  Season Progress
                </span>
                <span className="font-label-caps" style={{ fontSize: '10px', color: '#CCFF00', letterSpacing: '0.08em' }}>
                  GW 2 / 38
                </span>
              </div>
              <div
                style={{
                  height: '4px',
                  width: '100%',
                  backgroundColor: '#0D0D0D',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  border: '1px solid #222222',
                }}
              >
                <div style={{ height: '100%', backgroundColor: '#CCFF00', width: '5.2%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Footer */}
      <footer
        style={{
          marginTop: '32px',
          borderTop: '1px solid #222222',
          paddingTop: '24px',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
          <h5
            className="font-display-lg"
            style={{
              fontSize: '14px',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            TERMS & CONDITIONS
          </h5>
          <p
            className="font-label-caps"
            style={{
              fontSize: '10px',
              color: '#9E9E9E',
              lineHeight: '1.6',
              letterSpacing: '0.02em',
              margin: 0,
              textTransform: 'none', // Allow standard casing for readability
            }}
          >
            All results and prize calculations follow the official FPL data and scoring system. Competition decisions are final and binding.
          </p>
        </div>
      </footer>
    </div>
  );
};
