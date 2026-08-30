import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { PlayerRankItem } from '../../data/dummyData';

export type CardCategory = 'MOST SELECTED' | 'MOST CAPTAINED' | 'TRANSFER IN' | 'TRANSFER OUT';

interface ManagerRow {
  managerId: number;
  managerName: string;
  teamName: string;
  isCaptain?: boolean;
}

interface StatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardTitle: CardCategory | null;
  displayGw: number | null;
  items: PlayerRankItem[];
}

export const StatDetailModal: React.FC<StatDetailModalProps> = ({
  isOpen,
  onClose,
  cardTitle,
  displayGw,
  items,
}) => {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number>(0);
  const [managers, setManagers] = useState<ManagerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset selected player index when modal opens or cardTitle changes
  useEffect(() => {
    if (isOpen) {
      setSelectedPlayerIndex(0);
    }
  }, [isOpen, cardTitle]);

  // Handle ESC key press to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch managers dynamically from Supabase
  useEffect(() => {
    if (!isOpen || !cardTitle || displayGw === null || items.length === 0) {
      setManagers([]);
      return;
    }

    const currentPlayer = items[selectedPlayerIndex];
    if (!currentPlayer || !currentPlayer.playerId) {
      setManagers([]);
      return;
    }

    let isMounted = true;

    async function fetchManagers() {
      setLoading(true);
      setError(null);
      try {
        const playerId = currentPlayer.playerId!;
        const rawManagerIds: number[] = [];
        const captainMap = new Map<number, boolean>();

        if (cardTitle === 'MOST SELECTED') {
          const { data: picks, error: picksErr } = await supabase
            .from('manager_gameweek_picks')
            .select('manager_id, is_captain')
            .eq('gw_number', displayGw)
            .eq('player_id', playerId);

          if (picksErr) throw picksErr;

          for (const p of picks ?? []) {
            rawManagerIds.push(p.manager_id);
            if (p.is_captain) {
              captainMap.set(p.manager_id, true);
            }
          }
        } else if (cardTitle === 'MOST CAPTAINED') {
          const { data: captainPicks, error: captErr } = await supabase
            .from('manager_gameweek_picks')
            .select('manager_id')
            .eq('gw_number', displayGw)
            .eq('player_id', playerId)
            .eq('is_captain', true);

          if (captErr) throw captErr;

          for (const p of captainPicks ?? []) {
            rawManagerIds.push(p.manager_id);
            captainMap.set(p.manager_id, true);
          }
        } else if (cardTitle === 'TRANSFER IN') {
          const { data: transfersIn, error: inErr } = await supabase
            .from('manager_transfers')
            .select('manager_id')
            .eq('gw_number', displayGw)
            .eq('player_in_id', playerId);

          if (inErr) throw inErr;

          for (const t of transfersIn ?? []) {
            rawManagerIds.push(t.manager_id);
          }
        } else if (cardTitle === 'TRANSFER OUT') {
          const { data: transfersOut, error: outErr } = await supabase
            .from('manager_transfers')
            .select('manager_id')
            .eq('gw_number', displayGw)
            .eq('player_out_id', playerId);

          if (outErr) throw outErr;

          for (const t of transfersOut ?? []) {
            rawManagerIds.push(t.manager_id);
          }
        }

        // Deduplicate managerIds
        const uniqueManagerIds = Array.from(new Set(rawManagerIds));

        if (uniqueManagerIds.length === 0) {
          if (isMounted) {
            setManagers([]);
            setLoading(false);
          }
          return;
        }

        // Fetch manager names & team names from managers table
        const { data: managersData, error: mgrErr } = await supabase
          .from('managers')
          .select('manager_id, manager_name, team_name')
          .in('manager_id', uniqueManagerIds);

        if (mgrErr) throw mgrErr;

        const rows: ManagerRow[] = (managersData ?? []).map((m) => ({
          managerId: m.manager_id,
          managerName: m.manager_name ?? `Manager ${m.manager_id}`,
          teamName: m.team_name ?? `Team ${m.manager_id}`,
          isCaptain: captainMap.get(m.manager_id) ?? false,
        }));

        // Sort alphabetically by teamName
        rows.sort((a, b) => a.teamName.localeCompare(b.teamName));

        if (isMounted) {
          setManagers(rows);
          setLoading(false);
        }
      } catch (err) {
        console.error('[StatDetailModal] Fetch error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch manager data');
          setLoading(false);
        }
      }
    }

    fetchManagers();

    return () => {
      isMounted = false;
    };
  }, [isOpen, cardTitle, displayGw, selectedPlayerIndex, items]);

  if (!isOpen || !cardTitle) return null;

  const selectedPlayer = items[selectedPlayerIndex] ?? null;

  // Determine icon and description label
  let iconName = 'stars';
  let categoryLabel = 'Stat Breakdown';
  if (cardTitle === 'MOST SELECTED') {
    iconName = 'groups';
    categoryLabel = 'Managers who selected player';
  } else if (cardTitle === 'MOST CAPTAINED') {
    iconName = 'star';
    categoryLabel = 'Managers who captained player';
  } else if (cardTitle === 'TRANSFER IN') {
    iconName = 'trending_up';
    categoryLabel = 'Managers who transferred player IN';
  } else if (cardTitle === 'TRANSFER OUT') {
    iconName = 'trending_down';
    categoryLabel = 'Managers who transferred player OUT';
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#141414',
          borderRadius: '16px',
          border: '1px solid #282828',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: '#CCFF00',
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px 16px 24px',
            borderBottom: '1px solid #222222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '20px', color: '#CCFF00', flexShrink: 0 }}
            >
              {iconName}
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '16px',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {cardTitle}
            </h2>
            {displayGw !== null && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  backgroundColor: 'rgba(204, 255, 0, 0.15)',
                  color: '#CCFF00',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                GW{displayGw}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9E9E9E',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9E9E9E')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>
        </div>

        {/* Player Selection Tabs (if items > 1) */}
        {items.length > 0 ? (
          <div style={{ padding: '16px 24px 0 24px' }}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                backgroundColor: '#1E1E1E',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid #2A2A2A',
              }}
            >
              {items.map((item, idx) => {
                const isSelected = idx === selectedPlayerIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedPlayerIndex(idx)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: isSelected ? '#CCFF00' : 'transparent',
                      color: isSelected ? '#000000' : '#9E9E9E',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <span style={{ fontSize: '10px', opacity: isSelected ? 0.9 : 0.6 }}>
                      {item.rank}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Selected Player Details Box */}
        {selectedPlayer ? (
          <div style={{ padding: '16px 24px 8px 24px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                  }}
                >
                  {selectedPlayer.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: '#9E9E9E',
                    marginTop: '2px',
                  }}
                >
                  {selectedPlayer.team} • {selectedPlayer.position}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '18px',
                    fontWeight: 900,
                    color: '#CCFF00',
                  }}
                >
                  {selectedPlayer.statValue}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: '#8E8E8E',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {cardTitle === 'MOST SELECTED' || cardTitle === 'MOST CAPTAINED'
                    ? 'Managers'
                    : 'Transfers'}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Category Label Header */}
        <div
          style={{
            padding: '8px 24px 4px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: '#8E8E8E',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {categoryLabel} ({managers.length})
          </span>
        </div>

        {/* Manager List Body */}
        <div
          style={{
            padding: '8px 24px 16px 24px',
            flex: 1,
            overflowY: 'auto',
            maxHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '36px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                color: '#9E9E9E',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '28px', color: '#CCFF00', animation: 'spin 1s linear infinite' }}
              >
                autorenew
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                }}
              >
                FETCHING MANAGERS...
              </span>
            </div>
          ) : error ? (
            <div
              style={{
                padding: '24px 16px',
                backgroundColor: 'rgba(255, 68, 68, 0.08)',
                border: '1px solid rgba(255, 68, 68, 0.2)',
                borderRadius: '8px',
                color: '#FF4444',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          ) : managers.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#8E8E8E',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
              }}
            >
              No managers found for this selection in GW{displayGw}.
            </div>
          ) : (
            managers.map((mgr, idx) => (
              <div
                key={mgr.managerId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#1A1A1A',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #262626',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: '#8E8E8E',
                      width: '22px',
                      flexShrink: 0,
                    }}
                  >
                    #{idx + 1}
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {mgr.teamName}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        color: '#9E9E9E',
                        marginTop: '1px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {mgr.managerName}
                    </div>
                  </div>
                </div>

                {mgr.isCaptain && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      backgroundColor: '#CCFF00',
                      color: '#000000',
                      fontWeight: 800,
                      padding: '3px 6px',
                      borderRadius: '4px',
                      flexShrink: 0,
                    }}
                  >
                    CAPTAIN
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #222222',
            backgroundColor: '#101010',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              backgroundColor: '#222222',
              color: '#FFFFFF',
              border: '1px solid #333333',
              borderRadius: '8px',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#222222')}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
