import React from 'react';
import { ActivityFeedItem } from '../../types/fpl';
import { Radio, ArrowLeftRight, Award, Zap, MessageSquareQuote, Flame } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityFeedItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'rank_jump':
        return <Flame size={16} color="var(--accent-lime)" />;
      case 'chip':
        return <Zap size={16} color="var(--accent-lime)" />;
      case 'transfer':
        return <ArrowLeftRight size={16} color="#9E9E9E" />;
      case 'badge_unlocked':
        return <Award size={16} color="var(--accent-lime)" />;
      case 'banter':
        return <MessageSquareQuote size={16} color="#C4C9AC" />;
      default:
        return <Radio size={16} color="#9E9E9E" />;
    }
  };

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
          <Radio size={18} color="var(--accent-lime)" />
          <h3 className="font-headline-lg" style={{
            color: '#FFFFFF',
            fontSize: '18px',
            margin: 0
          }}>
            LEAGUE <span style={{ color: 'var(--accent-lime)' }}>BUZZ & FEED</span>
          </h3>
        </div>
        <span className="badge-live">
          <span className="live-dot" /> LIVE
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activities.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              backgroundColor: item.highlight ? 'rgba(204, 255, 0, 0.05)' : '#0E0E0E',
              border: item.highlight ? '1px solid rgba(204, 255, 0, 0.3)' : '1px solid #202020',
              borderRadius: '10px',
              transition: 'border-color 0.15s ease'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: item.highlight ? 'rgba(204,255,0,0.15)' : '#1A1A1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              {getIcon(item.type)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '2px'
              }}>
                <span style={{
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  {item.managerName} <span style={{ color: '#8E9379', fontWeight: 400 }}>({item.teamName})</span>
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: '#646464'
                }}>
                  {item.timestamp}
                </span>
              </div>

              <p style={{
                color: '#C6C6C7',
                fontSize: '12px',
                margin: '2px 0 0 0',
                lineHeight: '1.4'
              }}>
                {item.description}
              </p>

              {item.detail && (
                <div style={{
                  marginTop: '4px',
                  fontSize: '11px',
                  color: 'var(--accent-lime)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {item.detail}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
