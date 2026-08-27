import React, { useState } from 'react';
import { mockNewsletters } from '../data/newsletterData';

export const NewsletterPage: React.FC = () => {
  const [selectedGw, setSelectedGw] = useState('GW12');

  const activeNewsletter = mockNewsletters.find((n) => n.gameweek === selectedGw) || mockNewsletters[0];

  const styleSheet = `
    .gw-btn {
      background-color: #141414;
      border: 1px solid #222222;
      color: #FFFFFF;
      padding: 10px 20px;
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.08em;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .gw-btn:hover {
      background-color: #222222;
      border-color: #333333;
    }
    .gw-btn.active {
      background-color: #CCFF00;
      border-color: #CCFF00;
      color: #000000;
      box-shadow: 0 0 12px rgba(204, 255, 0, 0.2);
    }
    .story-card {
      background-color: #141414;
      border: 1px solid #222222;
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .story-card:hover {
      border-color: #CCFF00;
      transform: translateY(-1px);
    }
  `;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        position: 'relative',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />

      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at top right, rgba(204, 255, 0, 0.05) 0%, rgba(13, 13, 13, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header Banner Card */}
      <section
        style={{
          border: '1px solid #222222',
          backgroundColor: '#141414',
          borderRadius: '14px',
          padding: '24px 32px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 1,
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            fontSize: '200px',
            color: '#CCFF00',
            opacity: 0.05,
            pointerEvents: 'none',
            userSelect: 'none',
            fontStyle: 'normal',
          }}
        >
          sports_soccer
        </span>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p
            className="font-label-caps"
            style={{
              color: '#CCFF00',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: '11px',
              margin: 0,
            }}
          >
            WEEKLY DIGEST
          </p>
          <h1
            className="font-display-lg"
            style={{
              color: '#FFFFFF',
              margin: '4px 0 8px 0',
              lineHeight: 0.9,
            }}
          >
            NEWSLETTER
          </h1>
          <div
            className="font-label-caps"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9E9E9E',
              letterSpacing: '0.15em',
              fontSize: '11px',
            }}
          >
            <span>PLAY</span>
            <span style={{ color: '#CCFF00' }}>•</span>
            <span>COMPETE</span>
            <span style={{ color: '#CCFF00' }}>•</span>
            <span>CONNECT</span>
          </div>
        </div>
      </section>

      {/* Main Stories Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="font-headline-lg" style={{ color: '#FFFFFF', margin: 0 }}>
            {selectedGw} GAMEWEEK HIGHLIGHTS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeNewsletter.stories.map((story, index) => {
              const isWhiteTitle = story.category.includes('🔥') || story.category.includes('💀');
              return (
                <div key={index} className="story-card">
                  <div
                    className="font-label-caps"
                    style={{
                      color: '#FFFFFF',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {story.category}
                  </div>
                  <h3
                    className="font-headline-lg"
                    style={{
                      fontSize: '24px',
                      color: isWhiteTitle ? '#FFFFFF' : '#CCFF00',
                      margin: '4px 0',
                      lineHeight: 1,
                    }}
                  >
                    {story.title}
                  </h3>
                  <p
                    className="font-body-md"
                    style={{
                      color: '#FFFFFF',
                      fontWeight: 700,
                      margin: '2px 0 6px 0',
                    }}
                  >
                    {story.hook}
                  </p>
                  <p
                    className="font-body-sm"
                    style={{
                      color: '#c4c9ac',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {story.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gameweek Switcher Section */}
        <div
          style={{
            marginTop: '16px',
            borderTop: '1px solid #222222',
            paddingTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h3
            className="font-headline-lg"
            style={{
              fontSize: '18px',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            PREVIOUS GAMEWEEKS
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {mockNewsletters.map((newsletter) => (
              <button
                key={newsletter.gameweek}
                className={`gw-btn ${selectedGw === newsletter.gameweek ? 'active' : ''}`}
                onClick={() => setSelectedGw(newsletter.gameweek)}
              >
                {newsletter.gameweek}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
