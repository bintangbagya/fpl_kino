import React from 'react';
import { StandingRow } from '../../data/dummyData';
import { useLanguage } from '../../context/LanguageContext';

interface StandingsTableProps {
  standings: StandingRow[];
  onViewFull?: () => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, onViewFull }) => {
  const { t } = useLanguage();

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
          paddingBottom: '12px',
          borderBottom: '1px solid #222222',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-headline)',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            LEAGUE STANDINGS
          </h2>
        </div>
        <button
          onClick={onViewFull}
          style={{
            backgroundColor: '#CCFF00',
            color: '#000000',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            textTransform: 'uppercase',
            fontSize: '10px',
            letterSpacing: '0.1em',
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s ease',
          }}
        >
          {t.viewFullStandings} ➔
        </button>
      </div>

      {/* Standings Table */}
      <div style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
        <table
          style={{
            width: '100%',
            textAlign: 'left',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
        >
          <thead>
            <tr
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                borderBottom: '1px solid #222222',
              }}
            >
              <th style={{ padding: '10px 4px 12px 0px', fontWeight: 800, width: '36px', textAlign: 'center' }}>{t.rank}</th>
              <th style={{ padding: '10px 6px 12px 6px', fontWeight: 800 }}>{t.teamAndManager}</th>
              <th style={{ padding: '10px 4px 12px 4px', fontWeight: 800, width: '44px', textAlign: 'right' }}>{t.gwPts}</th>
              <th style={{ padding: '10px 0px 12px 4px', fontWeight: 800, width: '54px', textAlign: 'right' }}>{t.totalPts}</th>
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
                    borderBottom: isLast ? 'none' : '1px solid #1e1e1e',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      padding: '12px 4px 12px 0px',
                      textAlign: 'center',
                      color: isFirst ? '#CCFF00' : '#9E9E9E',
                      fontSize: '14px',
                    }}
                  >
                    {row.pos}
                  </td>

                  <td style={{ padding: '12px 6px', minWidth: 0, overflow: 'hidden' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={row.team}
                    >
                      {row.team}
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
                      title={row.manager}
                    >
                      {row.manager}
                    </div>
                  </td>

                  <td
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      padding: '12px 4px',
                      textAlign: 'right',
                      fontSize: '12px',
                      color: '#9E9E9E',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.gw}
                  </td>

                  <td
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      padding: '12px 0px 12px 4px',
                      textAlign: 'right',
                      fontSize: '14px',
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
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
