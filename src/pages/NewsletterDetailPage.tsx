import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface NewsletterDetailData {
  id: number;
  gw_number: number;
  edition_date: string;
  story_id: string;
  title: string;
  subtitle: string | null;
  author: string;
  category: string;
  emoji: string;
  full_content: string;
  key_highlights: string[] | null;
  related_stats: { label: string; value: string }[] | null;
  created_at: string;
}

interface NewsletterDetailPageProps {
  gwNumber: number;
  storyId: string;
  onBack: () => void;
}

export const NewsletterDetailPage: React.FC<NewsletterDetailPageProps> = ({
  gwNumber,
  storyId,
  onBack,
}) => {
  const [detail, setDetail] = useState<NewsletterDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from('newsletter_details')
          .select('*')
          .eq('gw_number', gwNumber)
          .eq('story_id', storyId)
          .order('edition_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (err) throw err;
        setDetail(data);
      } catch (e) {
        console.error('[NewsletterDetailPage] fetchDetail error:', e);
        setError(e instanceof Error ? e.message : 'Failed to load article detail');
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [gwNumber, storyId]);

  const styleSheet = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .article-detail-container {
      animation: fadeInUp 0.35s ease both;
    }
    .article-body p {
      margin-bottom: 16px;
      line-height: 1.75;
      color: #D1D5DB;
      font-size: 15px;
    }
    .article-body h3 {
      font-family: var(--font-headline);
      font-size: 20px;
      color: #FFFFFF;
      margin-top: 28px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .article-body blockquote {
      border-left: 3px solid #CCFF00;
      padding-left: 16px;
      margin: 20px 0;
      color: #E5E7EB;
      font-style: italic;
      background: rgba(204,255,0,0.03);
      padding-top: 8px;
      padding-bottom: 8px;
      border-radius: 0 8px 8px 0;
    }
    .back-nav-btn:hover {
      color: #CCFF00 !important;
      border-color: rgba(204,255,0,0.4) !important;
      background: rgba(204,255,0,0.06) !important;
    }
  `;

  return (
    <div className="article-detail-container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />

      {/* Navigation Top Bar */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={onBack}
          className="back-nav-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#141414',
            border: '1px solid #2A2A2A',
            color: '#A0A0A0',
            padding: '8px 16px',
            borderRadius: '100px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span>←</span> KEMBALI KE NEWSLETTER
        </button>
      </div>

      {loading ? (
        <div
          style={{
            padding: '60px',
            textAlign: 'center',
            backgroundColor: '#141414',
            borderRadius: '14px',
            border: '1px solid #222222',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              width: '32px',
              height: '32px',
              border: '3px solid rgba(204,255,0,0.2)',
              borderTopColor: '#CCFF00',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ color: '#777', marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            MEMUAT DETAIL ARTIKEL...
          </p>
        </div>
      ) : error || !detail ? (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#141414',
            borderRadius: '14px',
            border: '1px solid #222222',
          }}
        >
          <p style={{ color: '#FF6B6B', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            ⚠️ {error ?? 'Artikel detail belum tersedia.'}
          </p>
          <button
            onClick={onBack}
            style={{
              marginTop: '16px',
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
            KEMBALI
          </button>
        </div>
      ) : (
        <article
          style={{
            backgroundColor: '#141414',
            border: '1px solid #222222',
            borderRadius: '16px',
            padding: '36px',
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
              height: '3px',
              background: 'linear-gradient(90deg, #CCFF00 0%, #00FF88 100%)',
            }}
          />

          {/* Header Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 800,
                color: '#CCFF00',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(204,255,0,0.08)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(204,255,0,0.2)',
              }}
            >
              {detail.category}
            </span>
            <span style={{ color: '#444' }}>•</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#777' }}>
              ✍️ {detail.author}
            </span>
            <span style={{ color: '#444' }}>•</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#777' }}>
              📅 {detail.edition_date}
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 16px 0',
            }}
          >
            {detail.title}
          </h1>

          {/* Subtitle */}
          {detail.subtitle && (
            <p
              style={{
                fontSize: '16px',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                color: '#9CA3AF',
                lineHeight: 1.5,
                margin: '0 0 28px 0',
                borderBottom: '1px solid #222222',
                paddingBottom: '20px',
              }}
            >
              {detail.subtitle}
            </p>
          )}

          {/* Key Highlights Box */}
          {detail.key_highlights && detail.key_highlights.length > 0 && (
            <div
              style={{
                backgroundColor: '#1A1D14',
                border: '1px solid rgba(204,255,0,0.2)',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '32px',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#CCFF00',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                ⚡ KEY TAKEAWAYS
              </h4>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {detail.key_highlights.map((highlight, idx) => (
                  <li key={idx} style={{ color: '#E5E7EB', fontSize: '13px', lineHeight: 1.5 }}>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Body Content */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{
              __html: detail.full_content
                .replace(/\n\n/g, '</p><p>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>'),
            }}
          />

          {/* Related Stats Box */}
          {detail.related_stats && detail.related_stats.length > 0 && (
            <div
              style={{
                marginTop: '36px',
                paddingTop: '24px',
                borderTop: '1px solid #222222',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#555',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                📊 FAKTA & ANGKA KUNCI
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                {detail.related_stats.map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#1E1E1E',
                      border: '1px solid #2A2A2A',
                      borderRadius: '10px',
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#777', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#CCFF00' }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div
            style={{
              marginTop: '36px',
              paddingTop: '20px',
              borderTop: '1px solid #222222',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={onBack}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #333',
                color: '#AAA',
                padding: '8px 16px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ← Kembali ke Daftar Stories
            </button>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#444' }}>
              FPL KINO HUB • GAMWEEK {detail.gw_number}
            </span>
          </div>
        </article>
      )}
    </div>
  );
};
