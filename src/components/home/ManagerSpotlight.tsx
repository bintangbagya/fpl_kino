import React from 'react';
import { Manager } from '../../types/fpl';
import { Award, Flame, Crown, Zap, ShieldCheck } from 'lucide-react';

interface ManagerSpotlightProps {
  manager: Manager;
}

export const ManagerSpotlight: React.FC<ManagerSpotlightProps> = ({ manager }) => {
  return (
    <div className="card-surface" style={{
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #222222'
    }}>
      {/* Top Header Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={18} color="var(--accent-lime)" />
          <h3 className="font-headline-lg" style={{
            color: '#FFFFFF',
            fontSize: '18px',
            margin: 0
          }}>
            LEADER <span style={{ color: 'var(--accent-lime)' }}>SPOTLIGHT</span>
          </h3>
        </div>
        <span className="badge-lime">
          <Zap size={10} style={{ marginRight: '3px' }} /> GW28 HERO
        </span>
      </div>

      {/* Main Profile Box */}
      <div style={{
        backgroundColor: '#0E0E0E',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #222222',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Avatar / Rank Badge */}
          <div style={{
            position: 'relative',
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            backgroundColor: '#1E1E1E',
            border: '2px solid var(--accent-lime)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(204, 255, 0, 0.25)'
          }}>
            <Crown size={28} color="var(--accent-lime)" />
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              backgroundColor: 'var(--accent-lime)',
              color: '#000000',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '4px'
            }}>
              #1
            </div>
          </div>

          {/* Details */}
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '18px',
              fontStyle: 'italic',
              letterSpacing: '-0.01em'
            }}>
              {manager.teamName}
            </div>
            <div style={{
              color: '#9E9E9E',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500
            }}>
              {manager.name}
            </div>
            <div style={{
              color: '#8E9379',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              marginTop: '2px'
            }}>
              {manager.division}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid #1C1B1B'
        }}>
          <div>
            <div className="font-label-caps" style={{ color: '#8E9379', fontSize: '9px' }}>TOTAL</div>
            <div className="font-stat-value" style={{ color: 'var(--accent-lime)', fontSize: '18px' }}>
              {manager.totalPoints}
            </div>
          </div>
          <div>
            <div className="font-label-caps" style={{ color: '#8E9379', fontSize: '9px' }}>GW28</div>
            <div className="font-stat-value" style={{ color: '#FFFFFF', fontSize: '18px' }}>
              +{manager.gwPoints}
            </div>
          </div>
          <div>
            <div className="font-label-caps" style={{ color: '#8E9379', fontSize: '9px' }}>BADGES</div>
            <div className="font-stat-value" style={{ color: '#E5E2E1', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={14} color="var(--accent-lime)" /> {manager.badgesCount}
            </div>
          </div>
        </div>
      </div>

      {/* Form & Chip Intel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: '#161616',
          borderRadius: '8px',
          border: '1px solid #222222'
        }}>
          <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '10px' }}>CURRENT FORM</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {manager.form.map((f, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 800,
                  width: '22px',
                  height: '22px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: f === 'HOT' ? 'var(--accent-lime)' : '#283500',
                  color: f === 'HOT' ? '#000000' : 'var(--accent-lime)'
                }}
              >
                {f === 'HOT' ? <Flame size={12} /> : 'W'}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: '#161616',
          borderRadius: '8px',
          border: '1px solid #222222'
        }}>
          <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '10px' }}>CHIPS REMAINING</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-lime)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ShieldCheck size={14} /> BB, FH, WC2
          </span>
        </div>
      </div>
    </div>
  );
};
