import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface GlobalNewsTickerProps {
  onNavigateToNewsletter: () => void;
}

export const GlobalNewsTicker: React.FC<GlobalNewsTickerProps> = ({ onNavigateToNewsletter }) => {
  const [items, setItems] = useState<string[]>([]);
  const [latestGw, setLatestGw] = useState<number>(2);

  useEffect(() => {
    async function fetchTickerArticles() {
      try {
        const { data, error } = await supabase
          .from('newsletters')
          .select('id, title, summary, gw_number')
          .order('gw_number', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(5);

        if (!error && data && data.length > 0) {
          setLatestGw(data[0].gw_number || 2);
          const formatted = data.map(
            (row) => `🔥 ${row.title.toUpperCase()}: ${row.summary}`
          );
          setItems(formatted);
        } else {
          setItems([
            '🔥 HEADLINE: BRUNO FERNANDES MENGAMUK DI MATCHDAY 3 GW2, HATTRICK SPEKTAKULER GUNCANG PAPAN ATAS!',
            '🏆 AROMATHERASI FC REBUT TAKHTA KLASEMEN SEMENTARA PASCA MATCHDAY 3 (164 TOTAL PTS)!',
            '⚡ RAYAN CHERKI & HAALAND LEDAKKAN MATCHDAY 1, POIN GANDA GUNCANG PAPAN ATAS!',
            '🎭 REVIEW TRANSFER GW2: PERJUDIAN BAKAR POIN PENALTI (-4 HINGGA -28 HIT) PASCA DEADLINE DITUTUP!',
          ]);
        }
      } catch (err) {
        console.error('[GlobalNewsTicker] Fetch error:', err);
        setItems([
          '🔥 HEADLINE: BRUNO FERNANDES MENGAMUK DI MATCHDAY 3 GW2, HATTRICK SPEKTAKULER GUNCANG PAPAN ATAS!',
          '🏆 AROMATHERASI FC REBUT TAKHTA KLASEMEN SEMENTARA PASCA MATCHDAY 3 (164 TOTAL PTS)!',
        ]);
      }
    }

    fetchTickerArticles();
  }, []);

  const displayItems = items.length > 0 ? items : [
    '⚡ EDITORIAL DIGEST: BRUNO FERNANDES HATTRICK SPECTACULAR IN MATCHDAY 3 • AROMATHERASI FC REBUT TAKHTA KLASEMEN SEMENTARA!',
  ];
  const repeatedItems = [...displayItems, ...displayItems, ...displayItems];

  // Calculate dynamic duration to match NewsletterPage speed (around 20-22 chars/sec)
  const totalChars = repeatedItems.reduce((acc, curr) => acc + curr.length, 0);
  const durationSeconds = Math.max(20, Math.round(totalChars / 20));

  const marqueeStyle = `
    @keyframes globalMarquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-33.333%); }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px #CCFF00; }
      50% { opacity: 0.4; transform: scale(0.85); box-shadow: 0 0 2px #CCFF00; }
    }
    .global-ticker-container:hover .global-ticker-track {
      animation-play-state: paused !important;
    }
    .global-ticker-container:hover {
      box-shadow: 0 4px 20px rgba(204, 255, 0, 0.4) !important;
    }
    @media (max-width: 639px) {
      .ticker-cta-badge {
        display: none !important;
      }
      .ticker-badge-text-full {
        display: none !important;
      }
      .ticker-badge-text-compact {
        display: inline !important;
      }
      .ticker-badge-left {
        padding: 0 10px !important;
        gap: 6px !important;
      }
      .ticker-item-text {
        font-size: 11px !important;
        padding-right: 32px !important;
      }
    }
    @media (min-width: 640px) {
      .ticker-badge-text-compact {
        display: none !important;
      }
      .ticker-badge-text-full {
        display: inline !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marqueeStyle }} />
      <div
        onClick={onNavigateToNewsletter}
        className="global-ticker-container"
        title="Klik untuk membaca Halaman Newsletter"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '36px',
          backgroundColor: '#D4FF00',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          zIndex: 10000,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(212, 255, 0, 0.2)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.2s ease',
        }}
      >
        {/* Static Left Badge */}
        <div
          className="ticker-badge-left"
          style={{
            flexShrink: 0,
            backgroundColor: '#000000',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            gap: '8px',
            zIndex: 3,
            position: 'relative',
          }}
        >
          {/* Pulsing Live Dot */}
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#CCFF00',
              display: 'block',
              animation: 'pulseGlow 1.6s ease-in-out infinite',
            }}
          />

          {/* Badge Label (Desktop Full / Mobile Compact) */}
          <span
            className="ticker-badge-text-full"
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              color: '#CCFF00',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
            }}
          >
            • GW{latestGw} UPDATES
          </span>
          <span
            className="ticker-badge-text-compact"
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              color: '#CCFF00',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
            }}
          >
            GW{latestGw}
          </span>

          {/* Smooth Fade Overlay */}
          <div
            style={{
              position: 'absolute',
              right: '-16px',
              top: 0,
              bottom: 0,
              width: '16px',
              background: 'linear-gradient(to right, #000000 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />
        </div>

        {/* Marquee Running Text Track (Flex-1) */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div
            className="global-ticker-track"
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              animation: `globalMarquee ${durationSeconds}s linear infinite`,
              willChange: 'transform',
            }}
          >
            {repeatedItems.map((text, idx) => (
              <span
                key={idx}
                className="ticker-item-text"
                style={{
                  fontSize: '11.5px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  color: '#000000',
                  letterSpacing: '0.05em',
                  paddingRight: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {text}
                <span style={{ color: '#000000', margin: '0 8px', opacity: 0.4 }}>•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right CTA Badge (Hidden on mobile) */}
        <div
          className="ticker-cta-badge"
          style={{
            flexShrink: 0,
            padding: '0 14px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#000000',
            color: '#D4FF00',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            fontSize: '10.5px',
            letterSpacing: '0.08em',
            zIndex: 3,
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          READ NEWS ➔
        </div>
      </div>
    </>
  );
};
