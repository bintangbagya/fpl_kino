import React, { useState, useEffect } from 'react';
import { PreviousGwStats } from '../../data/dummyData';
import { useLanguage } from '../../context/LanguageContext';

interface NextDeadlineWidgetProps {
  stats: PreviousGwStats;
  /** GW number of the next deadline */
  gwNumber?: number | null;
  deadlineDate?: Date | null;
  /** Latest finished GW — used for the stats label ("GW{n} STATS") */
  latestFinishedGw?: number | null;
}

function computeCountdown(deadline: Date | null | undefined) {
  if (!deadline) return { days: 0, hours: 0, minutes: 0 };
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}

export const NextDeadlineWidget: React.FC<NextDeadlineWidgetProps> = ({ stats, gwNumber, deadlineDate, latestFinishedGw }) => {
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState(() => computeCountdown(deadlineDate));

  useEffect(() => {
    setCountdown(computeCountdown(deadlineDate));
    const timer = setInterval(() => {
      setCountdown(computeCountdown(deadlineDate));
    }, 60000);
    return () => clearInterval(timer);
  }, [deadlineDate]);

  const { days, hours, minutes } = countdown;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      {/* Next Deadline Card */}
      <div
        className="next-deadline-card"
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
          <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#9E9E9E',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 800,
              }}
            >
              NEXT DEADLINE
            </span>
            <span
              className="next-deadline-gw-text"
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '52px',
                fontWeight: 900,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginTop: '2px',
                lineHeight: 1,
              }}
            >
              GW{gwNumber ?? '?'}
            </span>
          </div>

          <div className="next-deadline-countdown" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                className="next-deadline-digit"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '40px',
                  color: '#CCFF00',
                  letterSpacing: '-0.02em',
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {String(days).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#666666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginTop: '4px',
                }}
              >
                DAYS
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '36px',
                color: 'rgba(204, 255, 0, 0.3)',
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              :
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                className="next-deadline-digit"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '40px',
                  color: '#CCFF00',
                  letterSpacing: '-0.02em',
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {String(hours).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#666666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginTop: '4px',
                }}
              >
                HOURS
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '36px',
                color: 'rgba(204, 255, 0, 0.3)',
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              :
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                className="next-deadline-digit"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '40px',
                  color: '#CCFF00',
                  letterSpacing: '-0.02em',
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {String(minutes).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#666666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
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
          position: 'relative',
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#CCFF00',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '13px',
              fontWeight: 800,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            {`GW${stats?.gwNumber ?? latestFinishedGw ?? 2} ${t.gwStats}`}
          </h3>
          <span className="material-symbols-outlined" style={{ color: '#CCFF00', fontSize: '18px' }}>
            insights
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.03)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#9E9E9E',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {t.averageScore}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFFFFF', fontSize: '16px' }}>
              {stats.averageScore} <span style={{ fontSize: '10px', color: '#9E9E9E' }}>PTS</span>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(204,255,0,0.04)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(204,255,0,0.2)',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#CCFF00',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              {t.highestScore}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: '#CCFF00',
                fontSize: '12px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '180px',
                textAlign: 'right',
              }}
              title={
                stats.highestTeamName
                  ? `${stats.highestTeamName.toUpperCase()} (${stats.highestScore} PTS)`
                  : `${stats.highestScore} PTS`
              }
            >
              {stats.highestTeamName
                ? `${stats.highestTeamName.toUpperCase()} (${stats.highestScore} PTS)`
                : `${stats.highestScore} PTS`}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.03)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#9E9E9E',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              {t.mostCaptained}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: '#FFFFFF',
                fontSize: '12px',
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
