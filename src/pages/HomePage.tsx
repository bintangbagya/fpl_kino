import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { NextDeadlineWidget } from '../components/home/NextDeadlineWidget';
import { StandingsTable } from '../components/home/StandingsTable';
import { AnalyticsQuadGrid } from '../components/home/AnalyticsQuadGrid';
import {
  mockPreviousGwStats,
  mockLeagueStandings,
  mockMostSelected,
  mockTopCaptains,
  mockTransferIn,
  mockTransferOut,
} from '../data/dummyData';

interface HomePageProps {
  onNavigateToLeague: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToLeague }) => {
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
          <NextDeadlineWidget stats={mockPreviousGwStats} />
        </div>

        {/* Right Column (8 cols on desktop): League Standings Table */}
        <div
          style={{
            gridColumn: 'span 12',
          }}
          className="col-lg-8"
        >
          <StandingsTable standings={mockLeagueStandings} onViewFull={onNavigateToLeague} />
        </div>
      </div>

      {/* 3. Bottom 4-Card Analytics Grid */}
      <AnalyticsQuadGrid
        mostSelected={mockMostSelected}
        topCaptains={mockTopCaptains}
        transferIn={mockTransferIn}
        transferOut={mockTransferOut}
      />
    </div>
  );
};
