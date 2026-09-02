import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArticleShareButton } from '../components/newsletter/ArticleShareButton';

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
  image_url?: string | null;
  key_highlights: string[] | null;
  related_stats: { label: string; value: string }[] | null;
  created_at: string;
}

function parseMarkdownTables(markdown: string): string {
  const lines = markdown.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    
    // Parse table rows
    const rows = tableBuffer
      .filter((l) => l.trim().startsWith('|'))
      .map((l) =>
        l
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((cell) => cell.trim())
      );

    if (rows.length >= 2) {
      const headerCells = rows[0];
      const isSeparator = rows[1].every((c) => /^:?-+:?$/.test(c.replace(/\s+/g, '')));
      const dataRows = isSeparator ? rows.slice(2) : rows.slice(1);

      let tableHtml = `<div style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 20px 0; border: 1px solid #262626; border-radius: 12px; background-color: #121212; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">`;
      tableHtml += `<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; font-family: var(--font-mono); white-space: nowrap;">`;
      
      // Header
      tableHtml += `<thead><tr style="background-color: rgba(255,255,255,0.04); border-bottom: 1px solid #262626;">`;
      headerCells.forEach((cell, idx) => {
        const align = idx === 0 || idx === 2 ? 'center' : 'left';
        tableHtml += `<th style="padding: 10px 14px; color: #888888; font-weight: 800; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; text-align: ${align}; border-right: 1px solid rgba(255,255,255,0.03);">${cell}</th>`;
      });
      tableHtml += `</tr></thead>`;

      // Body
      tableHtml += `<tbody>`;
      dataRows.forEach((row, rIdx) => {
        const bg = rIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
        tableHtml += `<tr style="border-bottom: 1px solid #1e1e1e; background-color: ${bg};">`;
        row.forEach((cell, cIdx) => {
          let cellStyle = 'padding: 10px 14px; color: #D1D5DB; vertical-align: middle;';
          let cellContent = cell;
          
          if (cIdx === 0) {
            cellStyle += ' text-align: center; font-weight: 800; color: #CCFF00;';
          } else if (cIdx === 2) {
            cellStyle += ' text-align: center; font-weight: 900; color: #CCFF00; font-size: 14px;';
          } else if (cIdx === 3) {
            // Chip status column - render badge pill
            let badgeBg = 'rgba(255,255,255,0.06)';
            let badgeColor = '#AAA';
            let badgeBorder = '#333';
            if (cell.includes('Bench Boost')) {
              badgeBg = 'rgba(0,255,136,0.12)';
              badgeColor = '#00FF88';
              badgeBorder = 'rgba(0,255,136,0.3)';
            } else if (cell.includes('Triple Captain')) {
              badgeBg = 'rgba(255,77,77,0.12)';
              badgeColor = '#FF4D4D';
              badgeBorder = 'rgba(255,77,77,0.3)';
            } else if (cell.includes('Tanpa Chip')) {
              badgeBg = 'rgba(204,255,0,0.1)';
              badgeColor = '#CCFF00';
              badgeBorder = 'rgba(204,255,0,0.25)';
            }
            
            cellContent = `<span style="display:inline-block; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:800; background:${badgeBg}; color:${badgeColor}; border:1px solid ${badgeBorder};">${cell}</span>`;
          }

          tableHtml += `<td style="${cellStyle}">${cellContent}</td>`;
        });
        tableHtml += `</tr>`;
      });
      tableHtml += `</tbody></table></div>`;

      result.push(tableHtml);
    }

    tableBuffer = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      tableBuffer.push(line);
    } else {
      if (inTable) {
        flushTable();
        inTable = false;
      }
      result.push(line);
    }
  }

  if (inTable) {
    flushTable();
  }

  return result.join('\n');
}

function parseManagerCards(markdown: string): string {
  return markdown.replace(
    /### ([0-9]+)\.\s+(.*?)\s+\(\*(.*?)\*\)\s*—\s*(.*?)\n-\s*\*\*Status\*\*:\s*\*\*(.*?)\*\*\n-\s*\*\*Analisis\*\*:\s*(.*?)(?=\n\n|\n###|\n---|$)/gs,
    (_, num, manager, team, pts, status, analysis) => {
      const cleanStatus = status.trim();
      const isSuccess = cleanStatus.includes('SUKSES') || cleanStatus.includes('CUAN') || cleanStatus.includes('MODERAT');
      const statusColor = isSuccess ? '#34D399' : '#F87171';

      return `<div style="background-color: rgba(23, 23, 23, 0.4); border: 1px solid rgba(38, 38, 38, 0.8); border-radius: 12px; padding: 16px; margin: 12px 0 14px 0;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="font-weight: 600; color: #F3F4F6; font-size: 14px;">${num}. ${manager.trim()}</span>
            <span style="font-size: 12px; color: #9CA3AF; font-weight: 400;">(${team.trim()})</span>
          </div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #CCFF00; font-size: 14px;">
            ${pts.trim()}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px; font-size: 12px; color: ${statusColor}; font-weight: 500;">
          <span style="font-size: 10px;">●</span>
          <span>${cleanStatus}</span>
        </div>
        <p style="font-size: 13.5px; color: #D1D5DB; line-height: 1.6; margin: 8px 0 0 0;">
          ${analysis.trim()}
        </p>
      </div>`;
    }
  );
}

function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  // Fix Supabase Storage domain typo if present in content
  let fixedMarkdown = markdown.replace(/thbsqxhlaoksxugpxcw\.supabase\.co/g, 'thbsqxhxlaoksxugpxcw.supabase.co');
  
  // Strip leading # Heading (H1) if present at top of markdown to prevent title duplication
  fixedMarkdown = fixedMarkdown.replace(/^\s*#\s+[^\n]+\n*/i, '').trim();

  // Step 1: Parse Manager Cards
  fixedMarkdown = parseManagerCards(fixedMarkdown);

  // Step 2: Parse Markdown Tables
  let html = parseMarkdownTables(fixedMarkdown);

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr style="border:0; border-top:1px solid #282828; margin: 24px 0;" />');

  // Headings
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-family:var(--font-headline); font-size:22px; font-weight:900; color:#FFFFFF; margin: 24px 0 12px 0; text-transform:uppercase; border-bottom:1px solid #222; padding-bottom:8px;">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-family:var(--font-headline); font-size:17px; font-weight:900; color:#CCFF00; margin: 22px 0 10px 0; text-transform:uppercase;">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-family:var(--font-headline); font-size:15px; font-weight:800; color:#FFFFFF; margin: 18px 0 8px 0; text-transform:uppercase;">$1</h3>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left: 3px solid #CCFF00; padding: 12px 18px; margin: 20px 0; color: #E5E7EB; font-style: italic; background: rgba(204,255,0,0.04); border-radius: 0 8px 8px 0; font-size:14px; line-height:1.6;">$1</blockquote>');

  // Numbered list items (1. , 2. , etc)
  html = html.replace(/^([0-9]+)\.\s+(.*$)/gim, '<div style="display:flex; align-items:center; gap:12px; padding:10px 16px; margin-bottom:8px; background:#181818; border:1px solid #282828; border-radius:10px; color:#E5E7EB; font-size:14px;"><span style="font-family:var(--font-mono); font-weight:900; color:#CCFF00; min-width:24px;">$1.</span><div style="flex:1;">$2</div></div>');

  // Bullet list items (- )
  html = html.replace(/^- (.*$)/gim, '<div style="display:flex; align-items:flex-start; gap:10px; padding:6px 0; color:#D1D5DB; font-size:14px; line-height:1.6;"><span style="color:#CCFF00; font-weight:900; font-size:16px; line-height:1;">•</span><div style="flex:1;">$1</div></div>');

  // Images ![alt](url) with optional caption on next line *caption*
  html = html.replace(
    /!\[(.*?)\]\((.*?)\)\s*\n?\*(.*?)\*/g,
    '<figure style="margin: 20px 0; display: flex; flex-direction: column; align-items: center; justify-content: center;"><img src="$2" alt="$1" style="width: 100%; max-width: 320px; aspect-ratio: 4/5; object-fit: cover; border-radius: 12px; border: 1px solid #282828; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" /><figcaption style="color: #9CA3AF; font-style: italic; font-size: 12px; text-align: center; margin-top: 8px; margin-bottom: 12px;">$3</figcaption></figure>'
  );

  // Standalone images ![alt](url)
  html = html.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    '<div style="margin: 20px 0; display: flex; flex-direction: column; align-items: center; justify-content: center;"><img src="$2" alt="$1" style="width: 100%; max-width: 320px; aspect-ratio: 4/5; object-fit: cover; border-radius: 12px; border: 1px solid #282828; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" /></div>'
  );

  // Bold & Italic (Strictly Inline)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FFFFFF; font-weight: 700; display: inline;">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em style="color: #D1D5DB; font-style: italic; font-weight: normal; display: inline;">$1</em>');

  // Paragraphs
  html = html.split('\n\n').map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr') || trimmed.startsWith('<div') || trimmed.startsWith('<figure')) {
      return trimmed;
    }
    return `<p style="color:#D1D5DB; line-height:1.75; font-size:14.5px; margin-bottom:16px;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
  }).join('');

  // Step 2: If lead paragraph is immediately followed by a hero figure, wrap them into responsive 2-column grid
  const heroMatch = html.match(/^(<p style=".*?">.*?<\/p>)\s*(<figure class="hero-figure">.*?<\/figure>)/s);
  if (heroMatch) {
    const leadP = heroMatch[1];
    const figureEl = heroMatch[2];
    const gridHtml = `<div class="hero-2col-grid"><div class="hero-lead-col" style="display:flex; flex-direction:column; justify-content:center;">${leadP}</div><div class="hero-img-col" style="display:flex; flex-direction:column; align-items:center; justify-content:center;">${figureEl}</div></div>`;
    html = html.replace(/^(<p style=".*?">.*?<\/p>)\s*(<figure class="hero-figure">.*?<\/figure>)/s, gridHtml);
  }

  return html;
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
        const rawId = storyId.startsWith('news_') ? storyId.replace('news_', '') : storyId;

        // 1. Query from public.newsletters table
        const { data: nlt } = await supabase
          .from('newsletters')
          .select('*')
          .eq('id', rawId)
          .maybeSingle();

        if (nlt) {
          const tagList = Array.isArray(nlt.tags) ? nlt.tags : [];
          const primaryTag = tagList.length > 0 ? tagList[0] : 'RECAP';

          let emoji = '🏆';
          if (tagList.includes('MVP') || tagList.includes('TopScorer')) emoji = '⚡';
          else if (tagList.includes('Captain') || tagList.includes('ChipEvaluation')) emoji = '🎯';
          else if (tagList.includes('Banter')) emoji = '🎭';

          setDetail({
            id: nlt.id,
            gw_number: nlt.gw_number,
            edition_date: nlt.created_at ? nlt.created_at.split('T')[0] : '2026-08-30',
            story_id: storyId,
            title: nlt.title,
            subtitle: nlt.summary || null,
            author: 'FPL Kino Editorial Team',
            category: `GW${nlt.gw_number} • ${primaryTag.toUpperCase()}`,
            emoji,
            full_content: nlt.content,
            key_highlights: [
              `Gameweek ${nlt.gw_number} Official Report`,
              `Topik: ${nlt.title}`,
              `Tags: ${tagList.join(' • ')}`,
            ],
            related_stats: [
              { label: 'Gameweek', value: `GW${nlt.gw_number}` },
              { label: 'Kategori', value: primaryTag },
              { label: 'Diterbitkan', value: nlt.created_at ? nlt.created_at.split('T')[0] : '2026-08-30' },
            ],
            created_at: nlt.created_at,
          });
          setLoading(false);
          return;
        }

        // 2. Query from newsletter_articles
        const { data: art, error: err } = await supabase
          .from('newsletter_articles')
          .select('*')
          .eq('gw_number', gwNumber)
          .eq('logical_article_id', storyId)
          .maybeSingle();

        if (err) throw err;

        if (art) {
          const facts = art.key_facts_used_json || {};
          const highlights: string[] = [];
          if (facts.new_leader) highlights.push(`Leader Baru: ${facts.new_leader} (${facts.new_leader_pts || 98} pts)`);
          if (facts.prev_leader) highlights.push(`Leader Lama: ${facts.prev_leader} (${facts.prev_leader_pts || 74} pts)`);
          if (facts.point_gap) highlights.push(`Selisih Poin: +${facts.point_gap} pts`);

          setDetail({
            id: 1,
            gw_number: art.gw_number,
            edition_date: art.created_at ? art.created_at.split('T')[0] : '2026-08-29',
            story_id: art.logical_article_id,
            title: art.headline,
            subtitle: art.subheadline,
            author: 'AI Editorial & Analyst Engine',
            category: art.final_editorial_angle || '🔥 GW2 • TITLE RACE SHIFT',
            emoji: '🏆',
            full_content: art.article_body,
            key_highlights: highlights.length > 0 ? highlights : [
              'Fazlun Febriansyah mengudeta takhta puncak klasemen di GW2.',
              'Poin total Fazlun mencapai 98 pts, unggul +24 pts dari Desta Arya Nugraha.'
            ],
            related_stats: [
              { label: 'Source Detector', value: 'DET_RANK_TITLE_CHANGE' },
              { label: 'Readiness Status', value: art.readiness_status || 'APPROVED_PASS' },
              { label: 'Editorial Angle', value: art.final_editorial_angle || 'Title Race Shift' }
            ],
            created_at: art.created_at
          });
        } else {
          // Fallback legacy table
          const { data: legacy } = await supabase
            .from('newsletter_details')
            .select('*')
            .eq('gw_number', gwNumber)
            .eq('story_id', storyId)
            .maybeSingle();
          setDetail(legacy);
        }
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
    .hero-2col-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      align-items: center;
      margin: 20px 0 28px 0;
    }
    @media (min-width: 768px) {
      .hero-2col-grid {
        grid-template-columns: 7fr 5fr !important;
      }
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

      {/* Top back button & Share button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#1E1E1E',
            border: '1px solid #333333',
            color: '#D1D5DB',
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

        {detail && (
          <ArticleShareButton
            title={detail.title}
            summary={detail.subtitle || ''}
            storyId={detail.story_id}
            gwNumber={detail.gw_number}
          />
        )}
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

          {/* Featured Image */}
          {detail.image_url && (
            <div
              style={{
                marginBottom: '28px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(204,255,0,0.3)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                background: 'radial-gradient(circle at center, rgba(204,255,0,0.08) 0%, #0a0a0a 90%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px 0',
              }}
            >
              <img
                src={detail.image_url}
                alt={detail.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '520px',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: '8px',
                }}
              />
            </div>
          )}



          {/* Article Body Content */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownToHtml(detail.full_content),
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
              flexWrap: 'wrap',
              gap: '12px',
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
            <ArticleShareButton
              title={detail.title}
              summary={detail.subtitle || ''}
              storyId={detail.story_id}
              gwNumber={detail.gw_number}
            />
          </div>
        </article>
      )}
    </div>
  );
};
