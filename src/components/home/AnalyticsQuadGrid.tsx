import React, { useState } from 'react';
import { PlayerRankItem } from '../../data/dummyData';
import { StatDetailModal, CardCategory } from './StatDetailModal';

interface AnalyticsQuadGridProps {
  mostSelected: PlayerRankItem[];
  topCaptains: PlayerRankItem[];
  transferIn: PlayerRankItem[];
  transferOut: PlayerRankItem[];
  /** Latest finished GW — used to detect GW1 (no transfer data) */
  latestFinishedGw?: number | null;
  /** Active GW whose deadline has passed */
  displayGw?: number | null;
}

interface StatCardProps {
  category: CardCategory;
  title: string;
  iconName: string;
  items: PlayerRankItem[];
  emptyMessage?: string;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  iconName,
  items,
  emptyMessage,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        backgroundColor: isHovered ? '#1A1A1A' : '#141414',
        borderRadius: '14px',
        padding: '16px',
        border: isHovered ? '1px solid #CCFF00' : '1px solid #222222',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        minWidth: 0,
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered ? '0 8px 24px rgba(204, 255, 0, 0.08)' : 'none',
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
          backgroundColor: '#CCFF00',
          opacity: isHovered ? 1 : 0.5,
          transition: 'opacity 0.2s ease',
        }}
      />
      {/* Title Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '14px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
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

        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '16px',
            color: isHovered ? '#CCFF00' : '#666666',
            opacity: isHovered ? 1 : 0.6,
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          title="Click to view manager breakdown"
        >
          open_in_full
        </span>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.length === 0 && emptyMessage ? (
          <div
            style={{
              padding: '16px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
              color: '#9E9E9E',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
            }}
          >
            {emptyMessage}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255,255,255,0.03)',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                gap: '8px',
                minWidth: 0,
              }}
            >
              {/* Left: Rank Badge + Name & Team */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '3px 6px',
                    backgroundColor: '#CCFF00',
                    color: '#000000',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    borderRadius: '4px',
                    fontWeight: 800,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.rank}
                </div>

                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      color: '#c4c9ac',
                      marginTop: '2px',
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
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '16px',
                  color: '#CCFF00',
                  fontWeight: 800,
                  lineHeight: 1,
                  flexShrink: 0,
                  textAlign: 'right',
                }}
              >
                {item.statValue}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const AnalyticsQuadGrid: React.FC<AnalyticsQuadGridProps> = ({
  mostSelected,
  topCaptains,
  transferIn,
  transferOut,
  latestFinishedGw,
  displayGw,
}) => {
  const [activeCard, setActiveCard] = useState<CardCategory | null>(null);

  const isGw1 = latestFinishedGw === 1;
  const emptyTransferItems: PlayerRankItem[] = [];

  const effectiveGw = displayGw ?? (latestFinishedGw ?? null);

  function getItemsForCategory(category: CardCategory | null): PlayerRankItem[] {
    if (!category) return [];
    switch (category) {
      case 'MOST SELECTED':
        return mostSelected;
      case 'MOST CAPTAINED':
        return topCaptains;
      case 'TRANSFER IN':
        return isGw1 ? emptyTransferItems : transferIn;
      case 'TRANSFER OUT':
        return isGw1 ? emptyTransferItems : transferOut;
      default:
        return [];
    }
  }

  return (
    <>
      <div className="analytics-quad-grid">
        <StatCard
          category="MOST SELECTED"
          title="MOST SELECTED"
          iconName="groups"
          items={mostSelected}
          onClick={() => setActiveCard('MOST SELECTED')}
        />
        <StatCard
          category="MOST CAPTAINED"
          title="MOST CAPTAINED"
          iconName="star"
          items={topCaptains}
          onClick={() => setActiveCard('MOST CAPTAINED')}
        />
        <StatCard
          category="TRANSFER IN"
          title="TRANSFER IN"
          iconName="trending_up"
          items={isGw1 ? emptyTransferItems : transferIn}
          emptyMessage={isGw1 ? 'N/A — First gameweek of the season' : undefined}
          onClick={() => setActiveCard('TRANSFER IN')}
        />
        <StatCard
          category="TRANSFER OUT"
          title="TRANSFER OUT"
          iconName="trending_down"
          items={isGw1 ? emptyTransferItems : transferOut}
          emptyMessage={isGw1 ? 'N/A — First gameweek of the season' : undefined}
          onClick={() => setActiveCard('TRANSFER OUT')}
        />
      </div>

      <StatDetailModal
        isOpen={activeCard !== null}
        onClose={() => setActiveCard(null)}
        cardTitle={activeCard}
        displayGw={effectiveGw}
        items={getItemsForCategory(activeCard)}
      />
    </>
  );
};
