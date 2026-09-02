import React, { useState, useEffect } from 'react';
import { getArticlePublicUrl } from '../../utils/slugify';

interface ArticleShareButtonProps {
  title: string;
  summary: string;
  storyId?: string;
  gwNumber?: number;
}

export const ArticleShareButton: React.FC<ArticleShareButtonProps> = ({
  title,
  summary,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const articleUrl = getArticlePublicUrl(title);

  const handleShareWhatsApp = () => {
    const cleanSummary = summary ? summary.replace(/\n+/g, ' ').trim() : '';
    const fullMessage = `FPL KINO NEWSLETTER\n\n${title}\n\n${cleanSummary}\n\nRead the full article:\n${articleUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(articleUrl)
        .then(() => {
          setToastMessage('Link copied to clipboard!');
        })
        .catch(() => {
          fallbackCopyText(articleUrl);
        });
    } else {
      fallbackCopyText(articleUrl);
    }
    setIsOpen(false);
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setToastMessage('Link copied!');
    } catch {
      setToastMessage('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `FPL KINO NEWSLETTER: ${title}`,
          url: articleUrl,
        });
        setIsOpen(false);
      } catch (e) {
        // User cancelled or feature unavailable
      }
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Share Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(204, 255, 0, 0.1)',
          border: '1px solid rgba(204, 255, 0, 0.35)',
          color: '#CCFF00',
          padding: '8px 16px',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(204, 255, 0, 0.2)';
          e.currentTarget.style.borderColor = '#CCFF00';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(204, 255, 0, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(204, 255, 0, 0.35)';
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
          share
        </span>
        <span>BAGIKAN</span>
      </button>

      {/* Share Options Dropdown Popover */}
      {isOpen && (
        <>
          {/* Overlay background to close popover when clicked outside */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              zIndex: 1000,
              width: '240px',
              backgroundColor: '#181818',
              border: '1px solid rgba(204,255,0,0.3)',
              borderRadius: '12px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: '#888',
                fontWeight: 800,
                letterSpacing: '0.1em',
                padding: '6px 10px 4px 10px',
                textTransform: 'uppercase',
                borderBottom: '1px solid #282828',
                marginBottom: '4px',
              }}
            >
              Bagikan Artikel
            </div>

            {/* Option 1: WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#25D366',
                padding: '10px 12px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.71-.518-5.253-1.418l-.376-.223-3.905 1.024 1.042-3.805-.246-.391c-1.002-1.593-1.532-3.435-1.532-5.328 0-5.513 4.486-9.999 9.999-9.999 2.671 0 5.183 1.04 7.07 2.928 1.887 1.887 2.926 4.4 2.925 7.072 0 5.514-4.486 10-9.999 10m0-21.843c-6.536 0-11.843 5.307-11.843 11.843 0 2.09.544 4.135 1.579 5.938l-1.677 6.126 6.269-1.644c1.733.945 3.693 1.444 5.672 1.444 6.537 0 11.843-5.307 11.843-11.843 0-3.166-1.233-6.142-3.473-8.382-2.24-2.24-5.216-3.472-8.381-3.472" />
              </svg>
              <span>Share to WhatsApp</span>
            </button>

            {/* Option 2: Copy Link */}
            <button
              onClick={handleCopyLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                padding: '10px 12px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#CCFF00' }}>
                content_copy
              </span>
              <span>Copy Link</span>
            </button>

            {/* Option 3: Web Share API (Device Native Share if supported) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                  borderTop: '1px solid #282828',
                  marginTop: '2px',
                  paddingTop: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#AAA' }}>
                  ios_share
                </span>
                <span>Opsi Berbagi Lainnya</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* Floating Toast Feedback */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#0D0D0D',
            border: '1px solid #CCFF00',
            color: '#CCFF00',
            padding: '12px 20px',
            borderRadius: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 800,
            boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 15px rgba(204, 255, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
