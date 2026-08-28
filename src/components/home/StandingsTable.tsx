import React from 'react';
import { StandingRow } from '../../data/dummyData';

interface StandingsTableProps {
  standings: StandingRow[];
  onViewFull?: () => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, onViewFull }) => {
  const currentGw = standings[0]?.gwNumber;

  return (
    <div
      style={{
        backgroundColor: '#141414',
        borderRadius: '14px',
        padding: '16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #222222',
        position: 'relative',
        overflow: 'hidden',
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

      {/* Table Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '1px solid #222222',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2
            className="font-headline-lg"
            style={{
              color: '#FFFFFF',
              fontSize: '22px',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            League Standings
          </h2>
          {currentGw != null && (
            <span
              className="font-label-caps"
              style={{
                backgroundColor: 'rgba(204, 255, 0, 0.08)',
                color: '#CCFF00',
                border: '1px solid rgba(204, 255, 0, 0.25)',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
              }}
            >
              GW{currentGw}
            </span>
          )}
        </div>
        <button
          onClick={onViewFull}
          className="font-label-caps"
          style={{
            backgroundColor: '#CCFF00',
            color: '#000000',
            fontWeight: 800,
            textTransform: 'uppercase',
            fontSize: '10px',
            letterSpacing: '0.08em',
            padding: '5px 10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'background-color 0.2s ease',
          }}
        >
          VIEW FULL ➔
        </button>
      </div>

      {/* Standings Table */}
      <div style={{ flex: 1, overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            textAlign: 'left',
            borderCollapse: 'collapse',
            minWidth: '400px',
          }}
        >
          <thead>
            <tr
              className="font-label-caps"
              style={{
                fontSize: '12px',
                color: '#9E9E9E',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: '1px solid #222222',
              }}
            >
              <th style={{ padding: '12px 12px 16px 12px', fontWeight: 700, width: '60px', textAlign: 'center' }}>POS</th>
              <th style={{ padding: '12px 12px 16px 12px', fontWeight: 700 }}>TEAM / MANAGER</th>
              <th style={{ padding: '12px 12px 16px 12px', fontWeight: 700, textAlign: 'right' }}>GW</th>
              <th style={{ padding: '12px 12px 16px 12px', fontWeight: 700, textAlign: 'right' }}>TOT</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, index) => {
              const isFirst = row.pos === 1;
              const isLast = index === standings.length - 1;

              return (
                <tr
                  key={row.pos}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid #222222',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#222222';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td
                    className="font-stat-value"
                    style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      color: isFirst ? '#CCFF00' : '#9E9E9E',
                      fontSize: '18px',
                    }}
                  >
                    {row.pos}
                  </td>

                  <td style={{ padding: '16px 12px' }}>
                    <div
                      className="font-label-caps"
                      style={{
                        fontWeight: 700,
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: '14px',
                      }}
                    >
                      {row.team}
                    </div>
                    <div
                      className="font-label-caps"
                      style={{
                        fontSize: '11px',
                        color: '#9E9E9E',
                        textTransform: 'uppercase',
                        marginTop: '4px',
                      }}
                    >
                      {row.manager}
                    </div>
                  </td>

                  <td
                    className="font-stat-value"
                    style={{
                      padding: '16px 12px',
                      textAlign: 'right',
                      fontSize: '14px',
                      color: '#9E9E9E',
                    }}
                  >
                    {row.gw}
                  </td>

                  <td
                    className="font-stat-value"
                    style={{
                      padding: '16px 12px',
                      textAlign: 'right',
                      fontSize: '20px',
                      color: '#FFFFFF',
                    }}
                  >
                    {row.tot}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
