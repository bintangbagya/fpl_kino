import React from 'react';
import { LanguageToggle } from './LanguageToggle';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';

interface TopHeaderProps {
  onOpenSidebar: () => void;
  onNavigateHome?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenSidebar, onNavigateHome }) => {
  const { user, signOut } = useAuth();

  return (
    <header
      style={{
        height: '56px',
        backgroundColor: '#141414',
        borderBottom: '1px solid #222222',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        position: 'fixed',
        top: '36px',
        left: 0,
        right: 0,
        zIndex: 40,
        boxSizing: 'border-box',
      }}
      className="lg-hide"
    >
      {/* Brand Logo */}
      <span
        onClick={onNavigateHome}
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '16px',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          textTransform: 'uppercase',
          cursor: 'pointer',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
        title="Kembali ke Halaman Utama"
      >
        FPL KINO <span style={{ color: '#CCFF00' }}>HUB</span>
      </span>

      {/* Right Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Compact User Icon Button (Icon Only - No Text Label) */}
        {user && (
          <button
            onClick={() => {
              if (window.confirm(`Logout dari ${user.email}?`)) {
                signOut();
              }
            }}
            title={`Logged in as: ${user.email}\nKlik untuk Sign Out`}
            aria-label="User Profile"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1E1E1E',
              border: '1px solid #333333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#3B82F6',
              padding: 0,
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <User size={16} color="#3B82F6" />
          </button>
        )}

        {/* Language Switcher */}
        <LanguageToggle />

        {/* Mobile Sidebar Hamburger Button */}
        <button
          onClick={onOpenSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
            menu
          </span>
        </button>
      </div>
    </header>
  );
};
