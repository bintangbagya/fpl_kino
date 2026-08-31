import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { NextDeadlineWidget } from '../components/home/NextDeadlineWidget';
import { StandingsTable } from '../components/home/StandingsTable';
import { AnalyticsQuadGrid } from '../components/home/AnalyticsQuadGrid';
import { useHomePageData } from '../hooks/useHomePageData';

interface HomePageProps {
  onNavigateToLeague: () => void;
}

/** Section 9 — Last Updated Indicator */
function LastUpdatedBadge({ updatedAt }: { updatedAt: Date | null }) {
  if (!updatedAt) return null;

  const diffMs = Date.now() - updatedAt.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);

  let label: string;
  if (diffMin < 1) {
    label = 'just now';
  } else if (diffMin < 60) {
    label = `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  } else if (diffHrs < 24) {
    label = `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
  } else {
    const diffDays = Math.floor(diffHrs / 24);
    label = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }

  return (
    <div
      className="desktop-sidebar-only"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '-12px',
        marginBottom: '-12px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#9E9E9E',
          letterSpacing: '0.07em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
          sync
        </span>
        Last updated {label}
      </span>
    </div>
  );
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToLeague }) => {
  const {
    previousGwStats,
    latestFinishedGw,
    displayGw,
    nextGwNumber,
    nextGwDeadline,
    leagueStandings,
    mostSelected,
    topCaptains,
    transferIn,
    transferOut,
    lastUpdatedAt,
    loading,
    error,
  } = useHomePageData();

  if (error) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: '#141414',
          borderRadius: '14px',
          border: '1px solid #222222',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#FF4444', marginBottom: '12px', display: 'block' }}>
          error
        </span>
        <h2 style={{ fontFamily: 'var(--font-headline)', color: '#FFFFFF', marginBottom: '8px', fontSize: '24px', fontWeight: 900 }}>
          Failed to load data
        </h2>
        <p style={{ color: '#9E9E9E', fontFamily: 'var(--font-body)' }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
      }}
    >
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* Last Updated Indicator (if present) */}
      <LastUpdatedBadge updatedAt={lastUpdatedAt} />

      {/* 3. Middle 12-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
        }}
      >
        {/* Left Column (4 cols on desktop): Next Deadline & GW Stats */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'flex',
            flexDirection: 'column',
          }}
          className="col-lg-4"
        >
          <NextDeadlineWidget
            stats={previousGwStats}
            gwNumber={nextGwNumber}
            deadlineDate={nextGwDeadline}
            latestFinishedGw={latestFinishedGw}
          />
        </div>

        {/* Right Column (8 cols on desktop): League Standings (Top 5 preview) */}
        <div
          style={{
            gridColumn: 'span 12',
          }}
          className="col-lg-8"
        >
          {loading ? (
            <div
              style={{
                backgroundColor: '#141414',
                borderRadius: '14px',
                border: '1px solid #222222',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '32px', color: '#CCFF00', animation: 'spin 1s linear infinite' }}
              >
                autorenew
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#9E9E9E', fontSize: '11px', letterSpacing: '0.1em' }}>
                LOADING STANDINGS...
              </span>
            </div>
          ) : (
            <StandingsTable standings={leagueStandings} onViewFull={onNavigateToLeague} />
          )}
        </div>
      </div>

      {/* 4. Bottom 4-Card Analytics Grid */}
      {loading ? (
        <div
          style={{
            backgroundColor: '#141414',
            borderRadius: '14px',
            border: '1px solid #222222',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '32px', color: '#CCFF00', animation: 'spin 1s linear infinite' }}
          >
            autorenew
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#9E9E9E', fontSize: '11px', letterSpacing: '0.1em' }}>
            LOADING ANALYTICS...
          </span>
        </div>
      ) : (
        <AnalyticsQuadGrid
          mostSelected={mostSelected}
          topCaptains={topCaptains}
          transferIn={transferIn}
          transferOut={transferOut}
          latestFinishedGw={latestFinishedGw}
          displayGw={displayGw}
        />
      )}
    </div>
  );
};
