import React from 'react';
import { HeadToHeadFixture } from '../../types/fpl';
import { Swords } from 'lucide-react';

interface HeadToHeadCardProps {
  fixtures: HeadToHeadFixture[];
}

export const HeadToHeadCard: React.FC<HeadToHeadCardProps> = ({ fixtures }) => {
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
          <Swords size={18} color="var(--accent-lime)" />
          <h3 className="font-headline-lg" style={{
            color: '#FFFFFF',
            fontSize: '18px',
            margin: 0
          }}>
            HEAD TO HEAD <span style={{ color: 'var(--accent-lime)' }}>DERBIES</span>
          </h3>
        </div>
        <span className="font-label-caps" style={{ color: '#8E9379', fontSize: '10px' }}>
          GW28 CLASHES
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {fixtures.map((fix) => {
          const scoreA = fix.managerA.gwScore ?? 0;
          const scoreB = fix.managerB.gwScore ?? 0;
          const isAWinning = scoreA > scoreB;
          const isBWinning = scoreB > scoreA;

          return (
            <div
              key={fix.id}
              style={{
                backgroundColor: '#0E0E0E',
                border: '1px solid #222222',
                borderRadius: '10px',
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {/* Manager A */}
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  color: isAWinning ? 'var(--accent-lime)' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)'
                }}>
                  {fix.managerA.team}
                </div>
                <div style={{
                  color: '#9E9E9E',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {fix.managerA.name} • Rank #{fix.managerA.rank}
                </div>
              </div>

              {/* Score Clash */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#161616',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #2A2A2A'
              }}>
                <span className="font-stat-value" style={{
                  fontSize: '16px',
                  color: isAWinning ? 'var(--accent-lime)' : '#FFFFFF'
                }}>
                  {scoreA}
                </span>
                <span style={{ color: '#646464', fontSize: '12px', fontWeight: 700 }}>VS</span>
                <span className="font-stat-value" style={{
                  fontSize: '16px',
                  color: isBWinning ? 'var(--accent-lime)' : '#FFFFFF'
                }}>
                  {scoreB}
                </span>
              </div>

              {/* Manager B */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  color: isBWinning ? 'var(--accent-lime)' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)'
                }}>
                  {fix.managerB.team}
                </div>
                <div style={{
                  color: '#9E9E9E',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {fix.managerB.name} • Rank #{fix.managerB.rank}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
