import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LanguageToggle } from './LanguageToggle';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

interface TopHeaderProps {
  onOpenSidebar: () => void;
  onNavigateHome?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenSidebar, onNavigateHome }) => {
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    async function fetchLastUpdated() {
      try {
        const { data } = await supabase
          .from('fpl_sync_logs')
          .select('completed_at')
          .in('status', ['completed', 'success'])
          .order('completed_at', { ascending: false })
          .limit(1);

        if (data?.[0]?.completed_at) {
          setUpdatedAt(new Date(data[0].completed_at));
        }
      } catch (err) {
        console.error('[TopHeader] Error fetching sync log:', err);
      }
    }

    fetchLastUpdated();
  }, []);

  const getLabel = () => {
    if (!updatedAt) return null;
    const diffMs = Date.now() - updatedAt.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMin / 60);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  const label = getLabel();

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
        top: '36px',
        left: 0,
        right: 0,
        zIndex: 40,
      }}
      className="lg-hide"
    >
      <span
        onClick={onNavigateHome}
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '18px',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          textTransform: 'uppercase',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        title="Kembali ke Halaman Utama"
      >
        FPL KINO <span style={{ color: '#CCFF00' }}>HUB</span>
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {label && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              color: '#9E9E9E',
              letterSpacing: '0.05em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '3px 8px',
              borderRadius: '100px',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#CCFF00' }}>
              sync
            </span>
            {label}
          </span>
        )}

        {user && (
          <div
            title={user.email}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1F1F1F',
              border: '1px solid #333333',
              borderRadius: '20px',
              padding: '3px 8px',
              fontSize: '11px',
              color: '#E5E7EB',
            }}
          >
            <User size={12} color="#3B82F6" />
            <span
              style={{
                maxWidth: '90px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 600,
              }}
            >
              {user.email.split('@')[0]}
            </span>
            <button
              onClick={() => signOut()}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogOut size={12} />
            </button>
          </div>
        )}

        <LanguageToggle />

        <button
          onClick={onOpenSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
            menu
          </span>
        </button>
      </div>
    </header>
  );
};
