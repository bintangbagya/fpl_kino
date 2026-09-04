import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface NewsletterPreviewCardProps {
  onNavigateToNewsletter?: () => void;
}

interface NewsletterArticleItem {
  id: string;
  gw_number: number;
  matchday_number: number;
  title: string;
  summary: string;
  tags: string[];
  created_at: string;
}

export const NewsletterPreviewCard: React.FC<NewsletterPreviewCardProps> = ({
  onNavigateToNewsletter,
}) => {
  const [article, setArticle] = useState<NewsletterArticleItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestArticle() {
      try {
        setLoading(true);
        // Query newest article from public.newsletters
        const { data, error } = await supabase
          .from('newsletters')
          .select('id, gw_number, matchday_number, title, summary, tags, created_at')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const item = data[0];
          setArticle({
            id: item.id,
            gw_number: item.gw_number,
            matchday_number: item.matchday_number,
            title: item.title,
            summary: item.summary,
            tags: Array.isArray(item.tags) ? item.tags : [],
            created_at: item.created_at,
          });
        }
      } catch (err) {
        console.error('[NewsletterPreviewCard] fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestArticle();
  }, []);

  const handleClick = () => {
    if (onNavigateToNewsletter) {
      onNavigateToNewsletter();
    }
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#141414',
          border: '1px solid #222222',
          borderRadius: '16px',
          padding: '20px 24px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ width: '130px', height: '20px', backgroundColor: '#222222', borderRadius: '100px' }} />
          <div style={{ width: '80px', height: '20px', backgroundColor: '#222222', borderRadius: '6px' }} />
        </div>
        <div style={{ width: '75%', height: '24px', backgroundColor: '#222222', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ width: '100%', height: '16px', backgroundColor: '#222222', borderRadius: '4px' }} />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: '#141414',
        border: '1px solid rgba(204,255,0,0.3)',
        borderRadius: '16px',
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #141414 60%, #0f1a00 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 12px 32px rgba(204,255,0,0.06)',
        boxSizing: 'border-box',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(204,255,0,0.6)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(204,255,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(204,255,0,0.3)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(204,255,0,0.06)';
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
          opacity: 0.8,
        }}
      />

      {/* Header Row: Badge left */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            backgroundColor: 'rgba(204,255,0,0.15)',
            border: '1px solid rgba(204,255,0,0.35)',
            borderRadius: '100px',
          }}
        >
          <span style={{ fontSize: '11px' }}>🔥</span>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              color: '#CCFF00',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            EDITORIAL HEADLINE
          </span>
        </div>
      </div>

      {/* Judul Headline (Full multi-line title without truncation) */}
      <h3
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'clamp(15px, 2.2vw, 19px)',
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.3,
          margin: 0,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {article.title}
      </h3>

      {/* Summary */}
      <p
        style={{
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          color: '#B0B0B0',
          lineHeight: 1.5,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {article.summary}
      </p>

      {/* CTA Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: '4px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 800,
            color: '#CCFF00',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.05em',
          }}
        >
          <span>Baca Selengkapnya</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
};
