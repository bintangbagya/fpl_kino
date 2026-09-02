import React, { useState, useEffect } from 'react';
import {
  useNewsletterData,
  type NewsletterStory,
} from '../hooks/useNewsletterData';
import { NewsletterDetailPage } from './NewsletterDetailPage';
import { useLanguage } from '../context/LanguageContext';
import { slugifyTitle } from '../utils/slugify';



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

// Helper for badge styling based on card type
function getCardTypeBadge(title: string, category: string) {
  const t = title.toLowerCase();
  const c = category.toLowerCase();

  if (t.includes('headline') || c.includes('headline')) {
    return { label: '🔥 HEADLINE', bg: 'rgba(204, 255, 0, 0.15)', border: 'rgba(204, 255, 0, 0.4)', color: '#CCFF00' };
  }
  if (t.includes('klasemen') || t.includes('takhta') || t.includes('kuasai') || c.includes('standings')) {
    return { label: '🏆 KLASEMEN', bg: 'rgba(255, 215, 0, 0.15)', border: 'rgba(255, 215, 0, 0.4)', color: '#FFD700' };
  }
  if (t.includes('transfer') || t.includes('chip') || t.includes('hit') || c.includes('transfer') || c.includes('chip')) {
    return { label: '🎭 REVIEW TRANSFER & CHIP', bg: 'rgba(176, 102, 255, 0.15)', border: 'rgba(176, 102, 255, 0.4)', color: '#B066FF' };
  }
  return { label: '⚡ PLAYER SPOTLIGHT', bg: 'rgba(0, 229, 255, 0.15)', border: 'rgba(0, 229, 255, 0.4)', color: '#00E5FF' };
}

// ─── Hero Card (Headline Story) ───────────────────────────────────────────────
const HeroCard: React.FC<{ story: NewsletterStory; onClick: () => void }> = ({
  story,
  onClick,
}) => {
  const { t } = useLanguage();
  const cardBadge = getCardTypeBadge(story.title, story.category);

  return (
    <div
      onClick={onClick}
      className="hero-story-card"
      style={{
        backgroundColor: '#141414',
        border: '1px solid #282828',
        borderRadius: '14px',
        padding: '24px 26px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
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
          background: 'linear-gradient(90deg, #CCFF00 0%, #00FF88 100%)',
        }}
      />

      {/* Header Badges: Card Type + GW / MD */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '3px 10px',
              backgroundColor: cardBadge.bg,
              border: `1px solid ${cardBadge.border}`,
              color: cardBadge.color,
              borderRadius: '6px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              letterSpacing: '0.08em',
            }}
          >
            {cardBadge.label}
          </span>
          <span
            style={{
              padding: '3px 8px',
              backgroundColor: '#1f1f1f',
              border: '1px solid #333333',
              borderRadius: '6px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: '#CCFF00',
              letterSpacing: '0.05em',
            }}
          >
            GW {story.gw_number} • {story.matchday_label || 'Matchday 1'}
          </span>
        </div>
      </div>

      {/* Article Title */}
      <h2
        style={{
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontFamily: 'var(--font-headline)',
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.2,
          margin: '2px 0 0 0',
          textTransform: 'uppercase',
        }}
      >
        {story.title}
      </h2>

      {/* Summary Preview Teaser */}
      <p
        style={{
          fontSize: '13.5px',
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          color: '#9CA3AF',
          margin: '0',
          lineHeight: 1.55,
        }}
      >
        {story.hook}
      </p>

      {/* Clean Read More Link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '6px',
          paddingTop: '10px',
          borderTop: '1px solid #1e1e1e',
        }}
      >
        <span style={{ fontSize: '11px', color: '#666', fontFamily: 'var(--font-mono)' }}>
          Published: {story.edition_date}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 800,
            color: '#CCFF00',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {t.readMore.toUpperCase()} ➔
        </span>
      </div>
    </div>
  );
};

// ─── Story Card ───────────────────────────────────────────────────────────────
const StoryCard: React.FC<{ story: NewsletterStory; onClick: () => void }> = ({ story, onClick }) => {
  const { t } = useLanguage();
  const cardBadge = getCardTypeBadge(story.title, story.category);

  return (
    <div
      onClick={onClick}
      className="newsletter-story-card"
      style={{
        backgroundColor: '#141414',
        border: '1px solid #222222',
        borderRadius: '12px',
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
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
          backgroundColor: cardBadge.color,
          opacity: 0.8,
        }}
      />

      {/* Header Badges: Card Type & GW / MD */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <span
          style={{
            padding: '2px 8px',
            backgroundColor: cardBadge.bg,
            border: `1px solid ${cardBadge.border}`,
            color: cardBadge.color,
            borderRadius: '4px',
            fontSize: '9.5px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            letterSpacing: '0.06em',
          }}
        >
          {cardBadge.label}
        </span>
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#888888',
            letterSpacing: '0.05em',
          }}
        >
          GW {story.gw_number} • {story.matchday_label || 'Matchday 1'}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '15px',
          fontFamily: 'var(--font-headline)',
          fontWeight: 900,
          color: '#FFFFFF',
          margin: '0',
          lineHeight: 1.25,
          textTransform: 'uppercase',
        }}
      >
        {story.title}
      </h3>

      {/* Preview Summary Teaser */}
      <p
        style={{
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          color: '#9CA3AF',
          margin: 0,
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {story.hook}
      </p>

      {/* Read More link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '8px',
          borderTop: '1px solid #1e1e1e',
        }}
      >
        <span style={{ fontSize: '10px', color: '#666', fontFamily: 'var(--font-mono)' }}>
          Published: {story.edition_date}
        </span>
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            color: '#CCFF00',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {t.readMore.toUpperCase()} ➔
        </span>
      </div>
    </div>
  );
};

// ─── Main Newsletter Page Component ──────────────────────────────────────────
export const NewsletterPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    availableGws,
    selectedGw,
    setSelectedGw,
    gwData,
    filteredStories,
    loading,
    error,
  } = useNewsletterData();

  const [selectedStory, setSelectedStory] = useState<{ gwNumber: number; storyId: string } | null>(null);

  // Deep linking: check URL pathname (/newsletter/[slug]) or query params on mount/popstate
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkUrlForStory = () => {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/newsletter/')) {
          const rawSlug = pathname.replace('/newsletter/', '').trim();
          if (rawSlug) {
            setSelectedStory({
              gwNumber: 2,
              storyId: rawSlug,
            });
            return;
          }
        }

        const params = new URLSearchParams(window.location.search);
        const articleParam = params.get('article');
        const gwParam = params.get('gw');
        if (articleParam) {
          setSelectedStory({
            gwNumber: gwParam ? Number(gwParam) : 2,
            storyId: articleParam,
          });
        }
      };

      checkUrlForStory();
      window.addEventListener('popstate', checkUrlForStory);
      return () => window.removeEventListener('popstate', checkUrlForStory);
    }
  }, []);

  const handleSelectStory = (storyId: string, gwNumber: number, title?: string) => {
    const slug = title ? slugifyTitle(title) : (storyId.startsWith('news_') ? storyId.replace('news_', '') : storyId);
    setSelectedStory({ gwNumber, storyId: slug });
    if (typeof window !== 'undefined') {
      const cleanUrl = `/newsletter/${slug}`;
      window.history.pushState({}, '', cleanUrl);
    }
  };

  const handleBackToList = () => {
    setSelectedStory(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/newsletter');
    }
  };

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
    .ticker-track:hover {
      animation-play-state: paused !important;
    }
    .filter-select {
      appearance: none;
      background-color: #141414;
      border: 1px solid #333333;
      border-radius: 8px;
      color: #FFFFFF;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      padding: 8px 32px 8px 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23CCFF00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 14px;
    }
    .filter-select:hover, .filter-select:focus {
      border-color: #CCFF00;
      outline: none;
      box-shadow: 0 0 10px rgba(204, 255, 0, 0.15);
    }
    .matchday-pill {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 100px;
      border: 1px solid #222222;
      background-color: #141414;
      color: #888888;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      letter-spacing: 0.04em;
    }
    .matchday-pill:hover {
      border-color: #555555;
      color: #FFFFFF;
    }
    .matchday-pill-active {
      border-color: #CCFF00 !important;
      background-color: rgba(204,255,0,0.12) !important;
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

  // Ticker items
  const tickerItems: string[] = [];
  if (filteredStories) {
    for (const story of filteredStories) {
      tickerItems.push(`${story.emoji} ${story.title}: ${story.hook}`);
    }
  }

  // If a story is clicked, show NewsletterDetailPage
  if (selectedStory) {
    return (
      <NewsletterDetailPage
        gwNumber={selectedStory.gwNumber}
        storyId={selectedStory.storyId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />

      {/* Header Banner Card */}
      <section
        style={{
          border: '1px solid rgba(204,255,0,0.3)',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #141414 60%, #0f1a00 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 1,
          boxShadow: '0 12px 32px rgba(204,255,0,0.08)',
        }}
      >
        {/* Left accent bar */}
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

        {/* Background icon */}
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-20px',
            fontSize: '180px',
            color: 'rgba(204, 255, 0, 0.04)',
            pointerEvents: 'none',
            userSelect: 'none',
            fontStyle: 'normal',
          }}
        >
          newspaper
        </span>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#000000',
                  backgroundColor: '#CCFF00',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                EDITORIAL DIGEST
              </span>
            </div>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 900,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              margin: '4px 0 0 0',
            }}
          >
            NEWSLETTER
          </h1>

          {/* Subtitle words */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '4px',
              flexWrap: 'wrap',
            }}
          >
            {['PLAY', 'COMPETE', 'CONNECT'].map((word, idx) => (
              <React.Fragment key={word}>
                {idx > 0 && (
                  <div
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#CCFF00',
                    }}
                  />
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '0.12em',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {word}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* AI Banner tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '8px',
              padding: '4px 10px',
              backgroundColor: 'rgba(204, 255, 0, 0.1)',
              border: '1px solid rgba(204, 255, 0, 0.3)',
              borderRadius: '6px',
              width: 'fit-content',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#CCFF00' }}>
              auto_awesome
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 800,
                color: '#CCFF00',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              All content on this page is generated by AI.
            </span>
          </div>
        </div>
      </section>

      {/* ─── NEW FILTER BAR: GAMEWEEK + MATCHDAY ───────────────────────────── */}
      <section
        style={{
          backgroundColor: '#141414',
          border: '1px solid #222222',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Gameweek Pill Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            paddingBottom: '2px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              color: '#888888',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {t.selectGameweek.toUpperCase()}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap' }}>
            {availableGws.map((gw) => {
              const isActive = selectedGw === gw;
              return (
                <button
                  key={gw}
                  onClick={() => setSelectedGw(gw)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    border: isActive ? '1px solid #CCFF00' : '1px solid #282828',
                    backgroundColor: isActive ? 'rgba(204, 255, 0, 0.15)' : '#181818',
                    color: isActive ? '#CCFF00' : '#888888',
                    boxShadow: isActive ? '0 0 10px rgba(204, 255, 0, 0.2)' : 'none',
                  }}
                >
                  {gw === 0 ? 'SEMUA GW' : `GW${gw}`}
                </button>
              );
            })}
          </div>
        </div>

      </section>

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
        ) : !gwData || filteredStories.length === 0 ? (
          /* Empty State for GW */
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
              BELUM ADA BERITA UNTUK GAMEWEEK {selectedGw}
            </h3>
            <p style={{ color: '#666', fontSize: '13px', margin: 0, maxWidth: '480px', marginInline: 'auto' }}>
              Newsletter otomatis di-generate setelah pertandingan Gameweek ini selesai.
            </p>
          </div>
        ) : (
          /* Gameweek Stories Layout */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Hero Story (First Story) */}
            {filteredStories[0] && (
              <HeroCard
                story={filteredStories[0]}
                onClick={() =>
                  handleSelectStory(filteredStories[0].story_id, filteredStories[0].gw_number || gwData.gwNumber, filteredStories[0].title)
                }
              />
            )}

            {/* Remaining Stories Grid */}
            {filteredStories.length > 1 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '14px',
                }}
              >
                {filteredStories.slice(1).map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onClick={() =>
                      handleSelectStory(story.story_id, story.gw_number || gwData.gwNumber, story.title)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
