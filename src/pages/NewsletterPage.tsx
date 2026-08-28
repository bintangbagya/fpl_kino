import React, { useState, useEffect, useRef } from 'react';
import { useNewsletterData, type NewsletterStory } from '../hooks/useNewsletterData';
import { NewsletterDetailPage } from './NewsletterDetailPage';

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard: React.FC<{ height?: number; style?: React.CSSProperties }> = ({
  height = 180,
  style,
}) => (
  <div
    style={{
      backgroundColor: '#141414',
      border: '1px solid #222222',
      borderRadius: '14px',
      height: `${height}px`,
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  </div>
);

// ─── Stats Chip ───────────────────────────────────────────────────────────────
const StatChip: React.FC<{ label: string; value: string; accent?: boolean }> = ({
  label,
  value,
  accent,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      padding: '8px 12px',
      backgroundColor: accent ? 'rgba(204,255,0,0.08)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${accent ? 'rgba(204,255,0,0.25)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '8px',
    }}
  >
    <span
      style={{
        fontSize: '9px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        letterSpacing: '0.12em',
        color: accent ? '#CCFF00' : '#9E9E9E',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: '13px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        color: accent ? '#CCFF00' : '#FFFFFF',
        lineHeight: 1.2,
      }}
    >
      {value}
    </span>
  </div>
);

// ─── Hero Story Card ──────────────────────────────────────────────────────────
const HeroCard: React.FC<{ story: NewsletterStory; onClick: () => void }> = ({
  story,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="hero-story-card"
    style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #141414 60%, #0f1a00 100%)',
      border: '1px solid rgba(204,255,0,0.3)',
      borderRadius: '16px',
      padding: '32px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
    }}
  >
    {/* Top-left accent bar */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: 'linear-gradient(180deg, #CCFF00 0%, rgba(204,255,0,0.2) 100%)',
        borderRadius: '16px 0 0 16px',
      }}
    />

    {/* Decorative background emoji */}
    <div
      style={{
        position: 'absolute',
        right: '-20px',
        bottom: '-20px',
        fontSize: '160px',
        opacity: 0.06,
        userSelect: 'none',
        pointerEvents: 'none',
        lineHeight: 1,
      }}
    >
      {story.emoji}
    </div>

    {/* LIVE badge + category */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          backgroundColor: '#CCFF00',
          borderRadius: '100px',
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#000',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            color: '#000',
            letterSpacing: '0.1em',
          }}
        >
          HEADLINE
        </span>
      </div>
      <span
        style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: '#9E9E9E',
          letterSpacing: '0.08em',
        }}
      >
        {story.category}
      </span>
    </div>

    {/* Title */}
    <h2
      style={{
        fontSize: 'clamp(22px, 4vw, 36px)',
        fontFamily: 'var(--font-headline)',
        fontWeight: 900,
        color: '#FFFFFF',
        lineHeight: 0.95,
        margin: '0 0 12px 0',
        textTransform: 'uppercase',
        letterSpacing: '-0.01em',
      }}
    >
      {story.title}
    </h2>

    {/* Hook */}
    <p
      style={{
        fontSize: '16px',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        color: '#CCFF00',
        margin: '0 0 12px 0',
        lineHeight: 1.4,
      }}
    >
      {story.hook}
    </p>

    {/* Description */}
    <p
      style={{
        fontSize: '14px',
        fontFamily: 'var(--font-body)',
        color: '#c4c9ac',
        lineHeight: 1.7,
        margin: '0 0 20px 0',
        maxWidth: '680px',
      }}
    >
      {story.description}
    </p>

    {/* Bottom Bar: Stats chips & Read Article Link */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      {story.stats && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {story.stats.map((stat, i) => (
            <StatChip key={i} label={stat.label} value={stat.value} accent={i === 0} />
          ))}
        </div>
      )}

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 800,
          color: '#CCFF00',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginLeft: 'auto',
        }}
      >
        BACA ARTIKEL LENGKAP ➔
      </div>
    </div>
  </div>
);

// ─── Story Card ───────────────────────────────────────────────────────────────
const StoryCard: React.FC<{ story: NewsletterStory; onClick: () => void }> = ({ story, onClick }) => {
  const accentColors: Record<string, string> = {
    '📈': '#00ff88',
    '📉': '#ff4d4d',
    '🎯': '#4d9fff',
    '💀': '#ff6b35',
    '🔄': '#b066ff',
    '📊': '#ffcc00',
    '🔥': '#CCFF00',
  };
  const accentColor = accentColors[story.emoji] ?? '#CCFF00';

  return (
    <div
      onClick={onClick}
      className="newsletter-story-card"
      style={{
        backgroundColor: '#141414',
        border: '1px solid #222222',
        borderRadius: '14px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: accentColor,
          opacity: 0.6,
        }}
      />

      {/* Category label */}
      <span
        style={{
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: accentColor,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {story.category}
      </span>

      {/* Title */}
      <h3
        style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          fontFamily: 'var(--font-headline)',
          fontWeight: 900,
          color: '#FFFFFF',
          margin: '0',
          lineHeight: 1.05,
          textTransform: 'uppercase',
        }}
      >
        {story.title}
      </h3>

      {/* Hook */}
      <p
        style={{
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          color: accentColor,
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {story.hook}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
          color: '#c4c9ac',
          lineHeight: 1.65,
          margin: 0,
          flex: 1,
        }}
      >
        {story.description}
      </p>

      {/* Read More link */}
      <div
        style={{
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 800,
          color: accentColor,
          letterSpacing: '0.1em',
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        BACA SELENGKAPNYA ➔
      </div>

      {/* Stats chips - aligned to bottom */}
      {story.stats && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid #1e1e1e',
          }}
        >
          {story.stats.map((stat, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                padding: '6px 10px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '6px',
                flex: '1 1 0',
                minWidth: '80px',
              }}
            >
              <span
                style={{
                  fontSize: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#666',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── News Ticker ──────────────────────────────────────────────────────────────
const NewsTicker: React.FC<{ items: string[]; gwNumber: number | null }> = ({
  items,
  gwNumber,
}) => {
  if (items.length === 0) return null;
  const repeatedItems = [...items, ...items, ...items];

  return (
    <div
      style={{
        backgroundColor: '#CCFF00',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        height: '36px',
        borderRadius: '8px',
        position: 'relative',
      }}
    >
      {/* Label */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: '#000',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: '6px',
          zIndex: 2,
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#CCFF00',
            display: 'block',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            color: '#CCFF00',
            letterSpacing: '0.15em',
            whiteSpace: 'nowrap',
          }}
        >
          GW{gwNumber} LIVE
        </span>
      </div>

      {/* Scrolling ticker */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          animation: 'ticker 30s linear infinite',
          whiteSpace: 'nowrap',
          gap: '40px',
          paddingLeft: '24px',
        }}
      >
        {repeatedItems.map((item, index) => (
          <span
            key={index}
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Main Newsletter Page ────────────────────────────────────────────────────
export const NewsletterPage: React.FC = () => {
  const { gwData, loading, error, availableGws, selectedGw, setSelectedGw } = useNewsletterData();
  const gwSwitcherRef = useRef<HTMLDivElement>(null);
  const [selectedStory, setSelectedStory] = useState<{ gwNumber: number; storyId: string } | null>(null);

  // Auto-scroll GW switcher pill into view
  useEffect(() => {
    if (gwSwitcherRef.current) {
      const activeEl = gwSwitcherRef.current.querySelector('.gw-pill-active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedGw]);

  const styleSheet = `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-33.33%); }
    }
    .gw-pill {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 100px;
      border: 1px solid #222222;
      background-color: #141414;
      color: #777777;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      letter-spacing: 0.05em;
    }
    .gw-pill:hover {
      border-color: #444444;
      color: #FFFFFF;
    }
    .gw-pill-active {
      border-color: #CCFF00 !important;
      background-color: rgba(204,255,0,0.1) !important;
      color: #CCFF00 !important;
    }
    .newsletter-story-card:hover {
      border-color: rgba(204,255,0,0.4) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .hero-story-card:hover {
      border-color: rgba(204,255,0,0.6) !important;
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(204,255,0,0.12);
    }
  `;

  // Hero story & remaining grid stories
  const heroStory = gwData?.stories?.find((s) => s.is_hero) ?? gwData?.stories?.[0];
  const remainingStories = gwData?.stories?.filter((s) => s.id !== heroStory?.id) ?? [];

  // Ticker items constructed from stories
  const tickerItems: string[] = [];
  if (gwData?.stories) {
    for (const story of gwData.stories) {
      tickerItems.push(`${story.emoji} ${story.title}: ${story.hook}`);
    }
  }

  // Highlights extracted from story stats
  const topScorerStory = gwData?.stories?.find((s) => s.story_id === 'top-scorer');
  const gwStatsStory = gwData?.stories?.find((s) => s.story_id === 'gw-stats');
  const chipStory = gwData?.stories?.find((s) => s.story_id === 'chip-usage');

  const topScorerVal = topScorerStory?.stats?.find((st) => st.label.includes('Poin'))?.value ?? 'N/A';
  const avgVal = gwStatsStory?.stats?.find((st) => st.label.includes('Avg'))?.value ?? 'N/A';
  const highestVal = gwStatsStory?.stats?.find((st) => st.label.includes('Highest'))?.value ?? 'N/A';
  const chipVal = chipStory?.stats?.find((st) => st.label.includes('Total'))?.value ?? '0 chips';

  // If a story is clicked, show NewsletterDetailPage!
  if (selectedStory) {
    return (
      <NewsletterDetailPage
        gwNumber={selectedStory.gwNumber}
        storyId={selectedStory.storyId}
        onBack={() => setSelectedStory(null)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />

      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderBottom: '1px solid #1E1E1E',
          paddingBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 800,
              color: '#000',
              backgroundColor: '#CCFF00',
              padding: '3px 8px',
              borderRadius: '4px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            FPL KINO HUB
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#666',
              letterSpacing: '0.1em',
            }}
          >
            EDITORIAL DIGEST
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: 0.95,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              SPORTS NEWSLETTER
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: '#888',
                margin: '6px 0 0 0',
              }}
            >
              Update berita, statistik, dan sorotan liga otomatis dari setiap Gameweek
            </p>
          </div>

          {/* Gameweek Badge */}
          {gwData && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                backgroundColor: '#141414',
                border: '1px solid #2A2A2A',
                borderRadius: '100px',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#CCFF00',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>
                {gwData.editionLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Live Ticker Bar */}
      {tickerItems.length > 0 && <NewsTicker items={tickerItems} gwNumber={gwData?.gwNumber ?? null} />}

      {/* Main Body */}
      <div>
        {loading ? (
          /* Loading Skeletons */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SkeletonCard height={320} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '14px',
              }}
            >
              <SkeletonCard height={200} />
              <SkeletonCard height={200} />
              <SkeletonCard height={200} />
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div
            style={{
              padding: '48px',
              textAlign: 'center',
              backgroundColor: '#141414',
              borderRadius: '14px',
              border: '1px solid #222222',
            }}
          >
            <p style={{ color: '#FF6B6B', fontFamily: 'var(--font-mono)', fontSize: '13px', margin: '0 0 12px 0' }}>
              ⚠️ Gagal memuat data newsletter: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#CCFF00',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              COBA LAGI
            </button>
          </div>
        ) : !gwData || gwData.stories.length === 0 ? (
          /* Empty State */
          <div
            style={{
              padding: '64px 24px',
              textAlign: 'center',
              backgroundColor: '#141414',
              borderRadius: '14px',
              border: '1px solid #222222',
            }}
          >
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🗞️</span>
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                color: '#FFFFFF',
                fontSize: '18px',
                margin: '0 0 8px 0',
              }}
            >
              BELUM ADA BERITA UNTUK GW{selectedGw}
            </h3>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
              Newsletter otomatis di-generate setelah pertandingan Gameweek ini selesai.
            </p>
          </div>
        ) : (
          /* Stories Layout */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Hero Story Card */}
            {heroStory && (
              <HeroCard
                story={heroStory}
                onClick={() =>
                  setSelectedStory({
                    gwNumber: gwData.gwNumber,
                    storyId: heroStory.story_id,
                  })
                }
              />
            )}

            {/* GW Highlights Quick Stats Banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              {[
                {
                  label: 'Rata-rata Liga',
                  value: avgVal,
                  sub: 'Skor rata-rata Kino Hub',
                  icon: '📊',
                },
                {
                  label: 'Highest FPL Global',
                  value: highestVal,
                  sub: 'Skor dunia tertinggi',
                  icon: '🏆',
                },
                {
                  label: 'Poin Top Scorer',
                  value: topScorerVal,
                  sub: topScorerStory?.title ?? 'Top Scorer GW',
                  icon: '⭐',
                },
                {
                  label: 'Penggunaan Chip',
                  value: chipVal,
                  sub: `Gameweek ${gwData.gwNumber}`,
                  icon: '🃏',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#141414',
                    border: '1px solid #222222',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: '#555',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: '2px',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 900,
                        color: '#CCFF00',
                        lineHeight: 1,
                      }}
                    >
                      {item.value}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: '#666',
                        marginTop: '2px',
                      }}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stories grid — remaining stories after hero */}
            {remainingStories.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '18px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    GW{gwData.gwNumber} STORIES
                  </h2>
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: '#222',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: '#555',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {remainingStories.length} cerita • klik card untuk detail
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '14px',
                  }}
                >
                  {remainingStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onClick={() =>
                        setSelectedStory({
                          gwNumber: gwData.gwNumber,
                          storyId: story.story_id,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── GW Switcher (Per Gameweek) ─────────────────────────── */}
            <div
              style={{
                marginTop: '8px',
                borderTop: '1px solid #1e1e1e',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#555',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                PILIH GAMEWEEK
              </span>
              <div
                ref={gwSwitcherRef}
                style={{
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                  scrollbarWidth: 'none',
                }}
              >
                {availableGws.map((gw) => (
                  <button
                    key={gw}
                    className={`gw-pill ${selectedGw === gw ? 'gw-pill-active' : ''}`}
                    onClick={() => setSelectedGw(gw)}
                  >
                    GW{gw}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
