import React, { useState } from 'react';
import { mockWeeklyWinners } from '../data/dummyData';

export const HallOfFamePage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'weekly' | 'monthly' | 'half-season' | 'cup' | 'overall' | 'badges'>('weekly');

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
      flexDirection: column;
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
            REWARDS & ACHIEVEMENTS
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
            HALL OF FAME
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
                className="font-headline-lg"
                style={{
                  fontSize: '22px',
                  color: '#FFFFFF',
                  margin: 0,
                  fontWeight: 800,
                }}
              >
                MANAGER OF THE WEEK
              </h3>
              <span
                className="font-label-caps"
                style={{
                  color: '#CCFF00',
                  letterSpacing: '0.1em',
                  fontSize: '11px',
                }}
              >
                38 Gameweeks • 38 Winners
              </span>
            </div>

            {/* Grid of Winners */}
            <div
              className="winners-grid"
              style={{
                display: 'grid',
                gap: '16px',
              }}
            >
              {mockWeeklyWinners.map((winner, index) => {
                const isLatest = index === 0; // The first element (GW5) is the latest
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
                        marginBottom: '40px',
                        position: 'relative',
                        zIndex: 10,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                          className="font-label-caps"
                          style={{
                            color: '#9E9E9E',
                            marginBottom: '8px',
                            letterSpacing: '0.15em',
                            fontSize: '10px',
                          }}
                        >
                          GAMEWEEK {winner.gw < 10 ? `0${winner.gw}` : winner.gw}
                        </span>
                        <h4
                          className="font-headline-lg"
                          style={{
                            fontSize: '20px',
                            color: '#FFFFFF',
                            margin: 0,
                            fontWeight: 800,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '180px',
                          }}
                        >
                          {winner.team}
                        </h4>
                        <span
                          className="font-label-caps"
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#9E9E9E',
                            marginTop: '4px',
                            letterSpacing: '0.1em',
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
                        alignItems: 'end',
                        justifyContent: 'space-between',
                        borderTop: '1px solid #222222',
                        paddingTop: '16px',
                        marginTop: 'auto',
                        position: 'relative',
                        zIndex: 10,
                      }}
                    >
                      <span
                        className="font-label-caps"
                        style={{
                          color: '#9E9E9E',
                          letterSpacing: '0.1em',
                          fontSize: '10px',
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
                        <span className="font-stat-value" style={{ fontStyle: 'italic', fontSize: '24px' }}>
                          {winner.score}
                        </span>
                        <span className="font-label-caps" style={{ fontSize: '11px', color: isLatest ? '#CCFF00' : '#9E9E9E' }}>
                          PTS
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. MONTHLY VIEW */}
        {activeSubTab === 'monthly' && (
          <div className="empty-state-container">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px', color: '#9E9E9E', marginBottom: '16px' }}
            >
              calendar_month
            </span>
            <h3
              className="font-headline-lg"
              style={{ fontSize: '20px', color: '#FFFFFF', margin: 0, fontWeight: 800 }}
            >
              MONTHLY WINNERS
            </h3>
            <p className="font-body-sm" style={{ color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
              Stats will populate at the end of each calendar month.
            </p>
          </div>
        )}

        {/* 3. HALF SEASON VIEW */}
        {activeSubTab === 'half-season' && (
          <div className="empty-state-container">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px', color: '#9E9E9E', marginBottom: '16px' }}
            >
              chevron_right
            </span>
            <h3
              className="font-headline-lg"
              style={{ fontSize: '20px', color: '#FFFFFF', margin: 0, fontWeight: 800 }}
            >
              HALF SEASON CHAMP
            </h3>
            <p className="font-body-sm" style={{ color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
              Awarded at GW19.
            </p>
          </div>
        )}

        {/* 4. CUP VIEW */}
        {activeSubTab === 'cup' && (
          <div className="empty-state-container">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px', color: '#9E9E9E', marginBottom: '16px' }}
            >
              sports_soccer
            </span>
            <h3
              className="font-headline-lg"
              style={{ fontSize: '20px', color: '#FFFFFF', margin: 0, fontWeight: 800 }}
            >
              FPL KINO CUP
            </h3>
            <p className="font-body-sm" style={{ color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
              Tournament bracket begins GW30.
            </p>
          </div>
        )}

        {/* 5. OVERALL VIEW */}
        {activeSubTab === 'overall' && (
          <div className="empty-state-container">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px', color: '#9E9E9E', marginBottom: '16px' }}
            >
              workspace_premium
            </span>
            <h3
              className="font-headline-lg"
              style={{ fontSize: '20px', color: '#FFFFFF', margin: 0, fontWeight: 800 }}
            >
              OVERALL CHAMPION
            </h3>
            <p className="font-body-sm" style={{ color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
              The grand prize winner for 26/27.
            </p>
          </div>
        )}

        {/* 6. BADGES VIEW */}
        {activeSubTab === 'badges' && (
          <div className="empty-state-container">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '40px', color: '#9E9E9E', marginBottom: '16px' }}
            >
              military_tech
            </span>
            <h3
              className="font-headline-lg"
              style={{ fontSize: '20px', color: '#FFFFFF', margin: 0, fontWeight: 800 }}
            >
              ACHIEVEMENT BADGES
            </h3>
            <p className="font-body-sm" style={{ color: '#9E9E9E', marginTop: '8px', maxWidth: '400px' }}>
              Special commendations for extraordinary gameweek performance.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
