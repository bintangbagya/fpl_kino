import React from 'react';
import { PlayerRankItem } from '../../data/dummyData';

interface AnalyticsQuadGridProps {
  mostSelected: PlayerRankItem[];
  topCaptains: PlayerRankItem[];
  transferIn: PlayerRankItem[];
  transferOut: PlayerRankItem[];
}

interface StatCardProps {
  title: string;
  iconName: string;
  items: PlayerRankItem[];
}

const StatCard: React.FC<StatCardProps> = ({ title, iconName, items }) => {
  return (
    <div
      style={{
        backgroundColor: '#141414',
        borderRadius: '14px',
        padding: '16px',
        border: '1px solid #222222',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        minWidth: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Title Header */}
      <h3
        className="font-headline-lg"
        style={{
          fontSize: '14px',
          color: '#CCFF00',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontStyle: 'italic',
          margin: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '18px',
            color: '#CCFF00',
            flexShrink: 0,
          }}
        >
          {iconName}
        </span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
      </h3>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <div
            key={item.rank}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#141414',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #222222',
              gap: '8px',
              minWidth: 0,
            }}
          >
            {/* Left: Rank Badge + Name & Team */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
              <div
                className="font-label-caps"
                style={{
                  padding: '3px 6px',
                  backgroundColor: '#CCFF00',
                  color: '#000000',
                  fontSize: '10px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.rank}
              </div>

              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div
                  className="font-label-caps"
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.name}
                </div>
                <div
                  className="font-label-caps"
                  style={{
                    fontSize: '10px',
                    color: '#9E9E9E',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginTop: '3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.team} • {item.position}
                </div>
              </div>
            </div>

            {/* Right: Stat Number */}
            <div
              className="font-stat-value"
              style={{
                fontSize: '20px',
                color: '#FFFFFF',
                fontWeight: 700,
                lineHeight: 1,
                flexShrink: 0,
                textAlign: 'right',
              }}
            >
              {item.statValue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnalyticsQuadGrid: React.FC<AnalyticsQuadGridProps> = ({
  mostSelected,
  topCaptains,
  transferIn,
  transferOut,
}) => {
  return (
    <div className="analytics-quad-grid">
      <StatCard title="MOST SELECTED" iconName="groups" items={mostSelected} />
      <StatCard title="TOP CAPTAINS" iconName="star" items={topCaptains} />
      <StatCard title="TRANSFER IN" iconName="trending_up" items={transferIn} />
      <StatCard title="TRANSFER OUT" iconName="trending_down" items={transferOut} />
    </div>
  );
};
