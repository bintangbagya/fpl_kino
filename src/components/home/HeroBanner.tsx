import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '32px 48px',
        backgroundColor: '#141414',
        border: '1px solid #222222',
        boxShadow: '0 0 20px rgba(204,255,0,0.1)',
      }}
    >
      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, #131313, rgba(19, 19, 19, 0.6), transparent)',
          zIndex: 1,
        }}
      />

      {/* Hero Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            className="font-label-caps"
            style={{
              color: '#CCFF00',
              fontWeight: 700,
              letterSpacing: '0.3em',
              marginBottom: '4px',
              textTransform: 'uppercase',
              fontSize: '11px',
            }}
          >
            UNOfficial LEAGUE
          </span>
          <h1
            className="font-display-lg"
            style={{
              color: '#FFFFFF',
              fontSize: '48px',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            FPL Kino Indonesia
            <br />
            <span style={{ color: '#CCFF00' }}>2026/27</span>
          </h1>
        </div>

        {/* Slogan */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            flexWrap: 'wrap',
          }}
        >
          <span
            className="font-label-caps"
            style={{
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.1em',
              fontSize: '16px',
            }}
          >
            PLAY
          </span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#CCFF00',
            }}
          />
          <span
            className="font-label-caps"
            style={{
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.1em',
              fontSize: '16px',
            }}
          >
            COMPETE
          </span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#CCFF00',
            }}
          />
          <span
            className="font-label-caps"
            style={{
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.1em',
              fontSize: '16px',
            }}
          >
            CONNECT
          </span>
        </div>
      </div>

      {/* Right Watermark */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.18,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '240px',
            color: '#CCFF00',
          }}
        >
          sports_soccer
        </span>
      </div>
    </div>
  );
};
