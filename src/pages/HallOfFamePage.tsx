import React, { useState } from 'react';
import { useHallOfFameData } from '../hooks/useHallOfFameData';

export const HallOfFamePage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'weekly' | 'monthly' | 'half-season' | 'cup' | 'overall' | 'badges'>('weekly');
  const { weeklyWinners, monthlyWinners, loading, error } = useHallOfFameData();

  const styleSheet = `
    .hof-tab-btn {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: #9E9E9E;
      cursor: pointer;
      padding: 8px 16px;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .hof-tab-btn:hover {
      color: #FFFFFF;
      border-bottom-color: #222222;
    }
    .hof-tab-btn.active {
      color: #CCFF00;
      border-bottom-color: #CCFF00;
    }
    .winner-card {
      background-color: #141414;
      border: 1px solid #222222;
      border-radius: 14px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: all 0.25s ease;
    }
    .winner-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #CCFF00;
      opacity: 0.5;
    }
    .winner-card:hover {
      border-color: rgba(204, 255, 0, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }
    .winner-card .trophy-icon {
      color: #333333;
      transition: color 0.2s ease;
    }
    .winner-card:hover .trophy-icon {
      color: #CCFF00;
    }
    .winner-card.latest-winner {
      border-color: rgba(204, 255, 0, 0.3);
    }
    .winner-card.latest-winner::before {
      background: linear-gradient(90deg, #CCFF00 0%, #00FF88 100%);
      opacity: 1;
    }
    .winner-card.latest-winner:hover {
      border-color: rgba(204, 255, 0, 0.6);
    }
    .winner-card.latest-winner .trophy-icon {
      color: #CCFF00;
    }
    
    .empty-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      min-height: 256px;
      background-color: #141414;
      border: 1px solid #222222;
      border-radius: 14px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    @media (max-width: 640px) {
      .winners-grid {
        grid-template-columns: 1fr !important;
      }
    }
    @media (min-width: 641px) and (max-width: 1024px) {
      .winners-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
    }
    @media (min-width: 1025px) {
      .winners-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
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
              REWARDS & ACHIEVEMENTS
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
            HALL OF FAME
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

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 1 }}>
        
        {/* Navigation Tabs */}
        <div
          style={{
            width: '100%',
            overflowX: 'auto',
            borderBottom: '1px solid #222222',
            scrollbarWidth: 'none',
          }}
          className="no-scrollbar"
        >
          <nav style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
            <button
              className={`hof-tab-btn ${activeSubTab === 'weekly' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('weekly')}
            >
              WEEKLY
            </button>
            <button
              className={`hof-tab-btn ${activeSubTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('monthly')}
            >
              MONTHLY
            </button>
            <button
              className={`hof-tab-btn ${activeSubTab === 'half-season' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('half-season')}
            >
              HALF SEASON
            </button>
            <button
              className={`hof-tab-btn ${activeSubTab === 'cup' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('cup')}
            >
              FPL KINO CUP
            </button>
            <button
              className={`hof-tab-btn ${activeSubTab === 'overall' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('overall')}
            >
              OVERALL SEASON
            </button>
            <button
              className={`hof-tab-btn ${activeSubTab === 'badges' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('badges')}
            >
              BADGES
            </button>
          </nav>
        </div>

        {/* Error notification */}
        {error && (
          <div style={{ backgroundColor: '#1a0000', border: '1px solid #FF4444', padding: '12px 16px', borderRadius: '8px', color: '#FF4444', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            ⚠️ Error loading Hall of Fame data: {error}
          </div>
        )}

        {/* Tab Content Panels */}
        
        {/* 1. WEEKLY VIEW */}
        {activeSubTab === 'weekly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
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
                MANAGER OF THE WEEK
              </h3>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#CCFF00',
                  letterSpacing: '0.1em',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                38 Gameweeks • 38 Winners
              </span>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', color: '#9E9E9E', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '32px 0' }}>
                Loading weekly winners...
              </div>
            )}

            {!loading && weeklyWinners.length > 0 && (
              <div
                className="winners-grid"
                style={{
                  display: 'grid',
                  gap: '16px',
                }}
              >
                {weeklyWinners.map((winner, index) => {
                  const isLatest = index === weeklyWinners.length - 1;
                  return (
                    <article
                      key={winner.gw}
                      className={`winner-card ${isLatest ? 'latest-winner' : ''}`}
                    >
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
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              color: isLatest ? '#CCFF00' : '#9E9E9E',
                              marginBottom: '6px',
                              letterSpacing: '0.15em',
                              fontSize: '10px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                            }}
                          >
                            GAMEWEEK {winner.gw < 10 ? `0${winner.gw}` : winner.gw}
                          </span>
                          <h4
                            style={{
                              fontFamily: 'var(--font-headline)',
                              fontSize: '20px',
                              color: '#FFFFFF',
                              margin: 0,
                              fontWeight: 900,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '180px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {winner.team}
                          </h4>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#9E9E9E',
                              marginTop: '4px',
                              letterSpacing: '0.08em',
                            }}
                          >
                            {winner.manager}
                          </span>
                        </div>
                        <span
                          className="material-symbols-outlined trophy-icon"
                          style={{
                            fontSize: '32px',
                            fontVariationSettings: '"FILL" 1',
                          }}
                        >
                          emoji_events
                        </span>
                      </div>
                      
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                          borderTop: '1px solid #222222',
                          paddingTop: '16px',
                          marginTop: 'auto',
                          position: 'relative',
                          zIndex: 10,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            color: '#9E9E9E',
                            letterSpacing: '0.1em',
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                          }}
                        >
                          TOTAL SCORE
                        </span>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '4px',
                            color: isLatest ? '#CCFF00' : '#FFFFFF',
                          }}
                        >
                          <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '24px' }}>
                            {winner.score}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: isLatest ? '#CCFF00' : '#9E9E9E' }}>
                            PTS
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && weeklyWinners.length === 0 && (
              <div className="empty-state-container">
                <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#CCFF00', marginBottom: '16px', opacity: 0.8 }}>
                  timer
                </span>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', color: '#FFFFFF', margin: 0, fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  WEEKLY WINNERS
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
                  Stats will populate once gameweeks are completed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 2. MONTHLY VIEW */}
        {activeSubTab === 'monthly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
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
                MANAGER OF THE MONTH
              </h3>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#CCFF00',
                  letterSpacing: '0.1em',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                9 Months • 9 Winners
              </span>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', color: '#9E9E9E', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '32px 0' }}>
                Loading monthly winners...
              </div>
            )}

            {!loading && monthlyWinners.length > 0 && (
              <div
                className="winners-grid"
                style={{
                  display: 'grid',
                  gap: '16px',
                }}
              >
                {monthlyWinners.map((winner, index) => {
                  const isLatest = index === monthlyWinners.length - 1;
                  return (
                    <article
                      key={winner.phaseId}
                      className={`winner-card ${isLatest ? 'latest-winner' : ''}`}
                    >
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
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              color: isLatest ? '#CCFF00' : '#9E9E9E',
                              marginBottom: '6px',
                              letterSpacing: '0.15em',
                              fontSize: '10px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                            }}
                          >
                            MONTH OF {winner.phaseName.toUpperCase()}
                          </span>
                          <h4
                            style={{
                              fontFamily: 'var(--font-headline)',
                              fontSize: '20px',
                              color: '#FFFFFF',
                              margin: 0,
                              fontWeight: 900,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '180px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {winner.team}
                          </h4>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#9E9E9E',
                              marginTop: '4px',
                              letterSpacing: '0.08em',
                            }}
                          >
                            {winner.manager}
                          </span>
                        </div>
                        <span
                          className="material-symbols-outlined trophy-icon"
                          style={{
                            fontSize: '32px',
                            fontVariationSettings: '"FILL" 1',
                          }}
                        >
                          emoji_events
                        </span>
                      </div>
                      
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                          borderTop: '1px solid #222222',
                          paddingTop: '16px',
                          marginTop: 'auto',
                          position: 'relative',
                          zIndex: 10,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            color: '#9E9E9E',
                            letterSpacing: '0.1em',
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                          }}
                        >
                          TOTAL SCORE
                        </span>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '4px',
                            color: isLatest ? '#CCFF00' : '#FFFFFF',
                          }}
                        >
                          <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '24px' }}>
                            {winner.score}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: isLatest ? '#CCFF00' : '#9E9E9E' }}>
                            PTS
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && monthlyWinners.length === 0 && (
              <div className="empty-state-container">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '40px', color: '#CCFF00', marginBottom: '16px', opacity: 0.8 }}
                >
                  calendar_month
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '20px',
                    color: '#FFFFFF',
                    margin: 0,
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  }}
                >
                  MONTHLY WINNERS
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
                  Stats will populate at the end of each calendar month.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. HALF SEASON VIEW */}
        {activeSubTab === 'half-season' && (
          <div className="empty-state-container">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px', color: '#CCFF00', marginBottom: '16px', opacity: 0.8 }}
            >
              chevron_right
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '20px',
                color: '#FFFFFF',
                margin: 0,
                fontWeight: 900,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              HALF SEASON CHAMP
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
              Awarded at GW19.
            </p>
          </div>
        )}

        {/* 4. CUP VIEW */}
        {activeSubTab === 'cup' && (
          <div className="empty-state-container">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px', color: '#CCFF00', marginBottom: '16px', opacity: 0.8 }}
            >
              sports_soccer
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '20px',
                color: '#FFFFFF',
                margin: 0,
                fontWeight: 900,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              FPL KINO CUP
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
              Tournament bracket begins GW30.
            </p>
          </div>
        )}

        {/* 5. OVERALL VIEW */}
        {activeSubTab === 'overall' && (
          <div className="empty-state-container">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px', color: '#CCFF00', marginBottom: '16px', opacity: 0.8 }}
            >
              workspace_premium
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '20px',
                color: '#FFFFFF',
                margin: 0,
                fontWeight: 900,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              OVERALL CHAMPION
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
              The grand prize winner for 26/27.
            </p>
          </div>
        )}

        {/* 6. BADGES VIEW */}
        {activeSubTab === 'badges' && (
          <div className="empty-state-container">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px', color: '#CCFF00', marginBottom: '16px', opacity: 0.8 }}
            >
              military_tech
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '20px',
                color: '#FFFFFF',
                margin: 0,
                fontWeight: 900,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              ACHIEVEMENT BADGES
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
              Special commendations for extraordinary gameweek performance.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
