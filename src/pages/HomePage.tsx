import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { NextDeadlineWidget } from '../components/home/NextDeadlineWidget';
import { StandingsTable } from '../components/home/StandingsTable';
import { AnalyticsQuadGrid } from '../components/home/AnalyticsQuadGrid';
import { useHomePageData } from '../hooks/useHomePageData';

interface HomePageProps {
  onNavigateToLeague: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToLeague }) => {
  const {
    previousGwStats,
    nextGwNumber,
    nextGwDeadline,
    leagueStandings,
    mostSelected,
    topCaptains,
    transferIn,
    transferOut,
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
        <h2 className="font-headline-lg" style={{ color: '#FFFFFF', marginBottom: '8px' }}>
          Failed to load data
        </h2>
        <p style={{ color: '#9E9E9E' }}>{error}</p>
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

      {/* 2. Middle 12-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
        }}
      >
        {/* Left Column (4 cols on desktop): Next Deadline & Previous GW Stats */}
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
          />
        </div>

        {/* Right Column (8 cols on desktop): League Standings Table */}
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
              <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '12px', letterSpacing: '0.1em' }}>
                LOADING STANDINGS...
              </span>
            </div>
          ) : (
            <StandingsTable standings={leagueStandings} onViewFull={onNavigateToLeague} />
          )}
        </div>
      </div>

      {/* 3. Bottom 4-Card Analytics Grid */}
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
          <span className="font-label-caps" style={{ color: '#9E9E9E', fontSize: '12px', letterSpacing: '0.1em' }}>
            LOADING ANALYTICS...
          </span>
        </div>
      ) : (
        <AnalyticsQuadGrid
          mostSelected={mostSelected}
          topCaptains={topCaptains}
          transferIn={transferIn}
          transferOut={transferOut}
        />
      )}
    </div>
  );
};
