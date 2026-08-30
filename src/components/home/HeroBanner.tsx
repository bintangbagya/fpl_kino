import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <section
      style={{
        border: '1px solid rgba(204,255,0,0.3)',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #141414 60%, #0f1a00 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1,
        boxShadow: '0 12px 32px rgba(204,255,0,0.08)',
        boxSizing: 'border-box',
        width: '100%',
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

      {/* Decorative background ball */}
      <div
        style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          fontSize: '180px',
          opacity: 0.04,
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        ⚽
      </div>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            UNOFFICIAL LEAGUE
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            color: '#FFFFFF',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          FPL Kino Indonesia <span style={{ color: '#CCFF00' }}>2026/27</span>
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '2px',
            flexWrap: 'wrap',
          }}
        >
          {['PLAY', 'COMPETE', 'CONNECT'].map((word, idx) => (
            <React.Fragment key={word}>
              {idx > 0 && (
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#CCFF00',
                  }}
                />
              )}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  color: '#9E9E9E',
                  letterSpacing: '0.12em',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                }}
              >
                {word}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
