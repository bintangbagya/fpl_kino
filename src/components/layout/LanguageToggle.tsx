import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageToggle: React.FC<{ style?: React.CSSProperties; className?: string }> = ({
  style,
  className,
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
        border: '1px solid #333333',
        borderRadius: '100px',
        padding: '2px',
        userSelect: 'none',
        ...style,
      }}
    >
      <button
        onClick={() => setLanguage('id')}
        style={{
          backgroundColor: language === 'id' ? '#CCFF00' : 'transparent',
          color: language === 'id' ? '#000000' : '#9E9E9E',
          fontWeight: language === 'id' ? 800 : 500,
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          padding: '3px 9px',
          borderRadius: '100px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          lineHeight: 1.2,
        }}
        aria-label="Switch to Bahasa Indonesia"
      >
        ID
      </button>
      <span style={{ color: '#444444', fontSize: '10px', margin: '0 2px' }}>|</span>
      <button
        onClick={() => setLanguage('en')}
        style={{
          backgroundColor: language === 'en' ? '#CCFF00' : 'transparent',
          color: language === 'en' ? '#000000' : '#9E9E9E',
          fontWeight: language === 'en' ? 800 : 500,
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          padding: '3px 9px',
          borderRadius: '100px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          lineHeight: 1.2,
        }}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};
