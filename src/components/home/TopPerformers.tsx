import React from 'react';
import { TopPerformer } from '../../types/fpl';
import { Zap } from 'lucide-react';

interface TopPerformersProps {
  performers: TopPerformer[];
}

export const TopPerformers: React.FC<TopPerformersProps> = ({ performers }) => {
  return (
    <div className="card-surface" style={{ padding: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        borderBottom: '1px solid #202020',
        paddingBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="var(--accent-lime)" />
          <h3 className="font-headline-lg" style={{
            color: '#FFFFFF',
            fontSize: '18px',
            margin: 0
          }}>
            GW28 <span style={{ color: 'var(--accent-lime)' }}>FORM KINGS</span>
          </h3>
        </div>
        <span className="font-label-caps" style={{ color: '#8E9379', fontSize: '10px' }}>
          TOP SCORED PLAYERS
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        {performers.map((player) => {
          const isMidOrFwd = player.position === 'MID' || player.position === 'FWD';

          return (
            <div
              key={player.id}
              style={{
                backgroundColor: '#0E0E0E',
                border: '1px solid #222222',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.15s ease, transform 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-lime)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#222222';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                {/* Header: Position & Points */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 800,
                      backgroundColor: '#201F1F',
                      color: '#E5E2E1',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #333333'
                    }}>
                      {player.position}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: '#9E9E9E',
                      fontWeight: 700
                    }}>
                      {player.team}
                    </span>
                  </div>

                  <div className="badge-lime" style={{ fontSize: '13px', padding: '3px 8px' }}>
                    {player.points} PTS
                  </div>
                </div>

                {/* Player Name & Price */}
                <div style={{
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  fontWeight: 700,
                  marginBottom: '4px'
                }}>
                  {player.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#8E9379',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '12px'
                }}>
                  Price: {player.price} • Bonus: +{player.bonus}
                </div>
              </div>

              {/* Match Stats & Kino Ownership */}
              <div style={{
                borderTop: '1px solid #1C1B1B',
                paddingTop: '10px',
                marginTop: '6px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: '#9E9E9E',
                  marginBottom: '4px'
                }}>
                  <span>{isMidOrFwd ? `${player.goals}G, ${player.assists}A` : `${player.goals}G, ${player.cleanSheets}CS`}</span>
                  <span style={{ color: 'var(--accent-lime)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {player.selectedByKinoPercent}% Kino Pick
                  </span>
                </div>

                {/* Mini Ownership Bar */}
                <div style={{
                  height: '4px',
                  backgroundColor: '#1E1E1E',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${player.selectedByKinoPercent}%`,
                    height: '100%',
                    backgroundColor: 'var(--accent-lime)',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
