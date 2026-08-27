import React from 'react';

interface TopHeaderProps {
  onOpenSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenSidebar }) => {
  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#141414',
        borderBottom: '1px solid #222222',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
      }}
      className="lg-hide"
    >
      <span
        className="font-headline-lg"
        style={{
          fontSize: '20px',
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          textTransform: 'uppercase',
          fontStyle: 'italic',
        }}
      >
        FPL KINO <span style={{ color: '#CCFF00' }}>HUB</span>
      </span>

      <button
        onClick={onOpenSidebar}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Open navigation menu"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>
          menu
        </span>
      </button>
    </header>
  );
};
