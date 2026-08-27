import React, { useState, useEffect } from 'react';
import { UpcomingDeadline } from '../../types/fpl';
import { Clock, Calendar, BellRing } from 'lucide-react';

interface NextDeadlinesProps {
  deadlines: UpcomingDeadline[];
}

export const NextDeadlinesCard: React.FC<NextDeadlinesProps> = ({ deadlines }) => {
  const nextGw = deadlines[0];

  // Live ticking countdown state
  const [seconds, setSeconds] = useState(48);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card-surface" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid #202020',
        paddingBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="var(--accent-lime)" />
          <h2 className="font-headline-lg" style={{ color: '#FFFFFF', margin: 0 }}>
            NEXT GW <span style={{ color: 'var(--accent-lime)' }}>DEADLINES</span>
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-lime">
            <BellRing size={11} style={{ marginRight: '4px' }} /> GW{nextGw?.gameweek} CLOSING SOON
          </span>
        </div>
      </div>

      {/* Main Countdown Hero Panel */}
      {nextGw && (
        <div style={{
          backgroundColor: '#0E0E0E',
          border: '1px solid #282828',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}>
          {/* Left info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px'
            }}>
              <span className="font-label-caps" style={{ color: '#8E9379' }}>IMMEDIATE DEADLINE</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--accent-lime)',
                backgroundColor: 'rgba(204, 255, 0, 0.12)',
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                GW {nextGw.gameweek}
              </span>
            </div>

            <div style={{
              fontSize: '18px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontStyle: 'italic',
              color: '#FFFFFF',
              marginBottom: '4px'
            }}>
              {nextGw.deadlineDate} • {nextGw.deadlineTimeWib}
            </div>

            <div style={{
              fontSize: '12px',
              color: '#9E9E9E',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>Key Clash:</span>
              <strong style={{ color: '#E5E2E1' }}>{nextGw.keyFixture}</strong>
            </div>
          </div>

          {/* Right Live Ticking Digits */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              backgroundColor: '#161616',
              border: '1px solid #262626',
              borderRadius: '8px',
              padding: '10px 14px',
              textAlign: 'center',
              minWidth: '58px'
            }}>
              <div className="font-stat-value" style={{ color: 'var(--accent-lime)', fontSize: '24px' }}>
                {nextGw.daysRemaining}
              </div>
              <div className="font-label-caps" style={{ color: '#8E9379', fontSize: '9px', marginTop: '2px' }}>
                DAYS
              </div>
            </div>

            <span style={{ color: '#646464', fontWeight: 800, fontSize: '18px' }}>:</span>

            <div style={{
              backgroundColor: '#161616',
              border: '1px solid #262626',
              borderRadius: '8px',
              padding: '10px 14px',
              textAlign: 'center',
              minWidth: '58px'
            }}>
              <div className="font-stat-value" style={{ color: '#FFFFFF', fontSize: '24px' }}>
                {nextGw.hoursRemaining}
              </div>
              <div className="font-label-caps" style={{ color: '#8E9379', fontSize: '9px', marginTop: '2px' }}>
                HRS
              </div>
            </div>

            <span style={{ color: '#646464', fontWeight: 800, fontSize: '18px' }}>:</span>

            <div style={{
              backgroundColor: '#161616',
              border: '1px solid #262626',
              borderRadius: '8px',
              padding: '10px 14px',
              textAlign: 'center',
              minWidth: '58px'
            }}>
              <div className="font-stat-value" style={{ color: '#FFFFFF', fontSize: '24px' }}>
                {nextGw.minutesRemaining}
              </div>
              <div className="font-label-caps" style={{ color: '#8E9379', fontSize: '9px', marginTop: '2px' }}>
                MINS
              </div>
            </div>

            <span style={{ color: '#646464', fontWeight: 800, fontSize: '18px' }}>:</span>

            <div style={{
              backgroundColor: '#161616',
              border: '1px solid rgba(204, 255, 0, 0.4)',
              borderRadius: '8px',
              padding: '10px 14px',
              textAlign: 'center',
              minWidth: '58px'
            }}>
              <div className="font-stat-value" style={{ color: 'var(--accent-lime)', fontSize: '24px' }}>
                {String(seconds).padStart(2, '0')}
              </div>
              <div className="font-label-caps" style={{ color: 'var(--accent-lime)', fontSize: '9px', marginTop: '2px' }}>
                SECS
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Gameweeks List Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px'
      }}>
        {deadlines.map((item) => (
          <div
            key={item.gameweek}
            style={{
              backgroundColor: '#0E0E0E',
              border: '1px solid #202020',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s ease, transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#383838';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#202020';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              {/* GW Badge & Tags */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 900,
                    backgroundColor: item.gameweek === nextGw?.gameweek ? 'var(--accent-lime)' : '#222222',
                    color: item.gameweek === nextGw?.gameweek ? '#000000' : '#E5E2E1',
                    padding: '2px 7px',
                    borderRadius: '4px'
                  }}>
                    GW {item.gameweek}
                  </span>
                  {item.isDoubleGameweek && (
                    <span style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      backgroundColor: 'rgba(255, 180, 171, 0.15)',
                      color: '#FFB4AB',
                      border: '1px solid rgba(255, 180, 171, 0.3)',
                      padding: '2px 5px',
                      borderRadius: '4px'
                    }}>
                      DOUBLE GW
                    </span>
                  )}
                </div>

                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: '#8E9379',
                  fontWeight: 600
                }}>
                  {item.daysRemaining} days left
                </span>
              </div>

              {/* Date & Time */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '4px'
              }}>
                <Calendar size={13} color="var(--accent-lime)" />
                <span>{item.deadlineDate} • {item.deadlineTimeWib}</span>
              </div>

              <div style={{
                fontSize: '12px',
                color: '#9E9E9E',
                marginBottom: '10px'
              }}>
                {item.keyFixture}
              </div>
            </div>

            {/* Captain Pick Tip */}
            <div style={{
              borderTop: '1px solid #1C1B1B',
              paddingTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px'
            }}>
              <span style={{ color: '#8E9379', fontFamily: 'var(--font-mono)' }}>
                (C) PICK: <strong style={{ color: 'var(--accent-lime)' }}>{item.recommendedCaptain.name}</strong>
              </span>
              <span style={{ color: '#646464', fontFamily: 'var(--font-mono)' }}>
                {item.recommendedCaptain.fixture}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
