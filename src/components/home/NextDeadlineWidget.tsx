import React, { useState, useEffect } from 'react';
import { PreviousGwStats } from '../../data/dummyData';

interface NextDeadlineWidgetProps {
  stats: PreviousGwStats;
}

export const NextDeadlineWidget: React.FC<NextDeadlineWidgetProps> = ({ stats }) => {
  const [days] = useState(2);
  const [hours] = useState(14);
  const [minutes, setMinutes] = useState(9);

  useEffect(() => {
    const timer = setInterval(() => {
      setMinutes((m) => (m > 0 ? m - 1 : 59));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      {/* Next Deadline Card */}
      <div
        style={{
          backgroundColor: '#141414',
          borderRadius: '14px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          border: '1px solid #222222',
          height: '200px',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span
              className="font-headline-lg"
              style={{
                fontSize: '20px',
                color: '#9E9E9E',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontWeight: 800,
                fontStyle: 'italic',
              }}
            >
              Next Deadline
            </span>
            <span
              className="font-display-lg"
              style={{
                fontSize: '60px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                marginTop: '4px',
                fontStyle: 'italic',
                lineHeight: 1,
              }}
            >
              GW2
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                className="font-stat-value"
                style={{
                  fontSize: '44px',
                  color: '#CCFF00',
                  letterSpacing: '-0.02em',
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {String(days).padStart(2, '0')}
              </span>
              <span
                className="font-label-caps"
                style={{
                  fontSize: '10px',
                  color: '#9E9E9E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginTop: '4px',
                }}
              >
                DAYS
              </span>
            </div>

            <div
              className="font-stat-value"
              style={{
                fontSize: '44px',
                color: 'rgba(204, 255, 0, 0.3)',
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              :
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                className="font-stat-value"
                style={{
                  fontSize: '44px',
                  color: '#CCFF00',
                  letterSpacing: '-0.02em',
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {String(hours).padStart(2, '0')}
              </span>
              <span
                className="font-label-caps"
                style={{
                  fontSize: '10px',
                  color: '#9E9E9E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginTop: '4px',
                }}
              >
                HOURS
              </span>
            </div>

            <div
              className="font-stat-value"
              style={{
                fontSize: '44px',
                color: 'rgba(204, 255, 0, 0.3)',
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              :
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                className="font-stat-value"
                style={{
                  fontSize: '44px',
                  color: '#CCFF00',
                  letterSpacing: '-0.02em',
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {String(minutes).padStart(2, '0')}
              </span>
              <span
                className="font-label-caps"
                style={{
                  fontSize: '10px',
                  color: '#9E9E9E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginTop: '4px',
                }}
              >
                MINUTES
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Previous GW Stats Card */}
      <div
        style={{
          backgroundColor: '#141414',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid #222222',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h3
            className="font-headline-lg"
            style={{
              fontSize: '16px',
              color: '#9E9E9E',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            PREVIOUS GW STATS
          </h3>
          <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '18px' }}>
            insights
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#141414',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #222222',
            }}
          >
            <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '13px', textTransform: 'uppercase' }}>
              Average Score
            </span>
            <span className="font-stat-value" style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '18px' }}>
              {stats.averageScore} <span className="font-label-caps" style={{ fontSize: '11px', color: '#9E9E9E' }}>pts</span>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#141414',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #222222',
            }}
          >
            <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '13px', textTransform: 'uppercase' }}>
              Highest Score
            </span>
            <span className="font-stat-value" style={{ fontWeight: 700, color: '#CCFF00', fontSize: '18px' }}>
              {stats.highestScore} <span className="font-label-caps" style={{ fontSize: '11px', color: '#9E9E9E' }}>pts</span>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#141414',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #222222',
              gap: '8px',
            }}
          >
            <span
              className="font-label-caps"
              style={{
                color: '#9E9E9E',
                fontSize: '13px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Most Captained
            </span>
            <span
              className="font-label-caps"
              style={{
                fontWeight: 700,
                color: '#FFFFFF',
                fontSize: '13px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {stats.mostCaptained}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
