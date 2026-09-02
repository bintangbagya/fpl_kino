import React from 'react';
import { useGwStatus } from '../../hooks/useGwStatus';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
}) => {
  const { displayText, isLive } = useGwStatus();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: t.navHome, icon: 'home', drawerLabel: t.navHome },
    { id: 'league', label: t.navLeague, icon: 'leaderboard', drawerLabel: t.navLeague },
    { id: 'cup', label: t.navCup, icon: 'emoji_events', drawerLabel: t.navCup },
    { id: 'prizes', label: t.navPrizePool, icon: 'redeem', drawerLabel: t.navPrizePool },
    { id: 'stats', label: t.navHallOfFame, icon: 'military_tech', drawerLabel: t.navHallOfFame },
    { id: 'newsletter', label: t.navNewsletter, icon: 'mail', drawerLabel: t.navNewsletter },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 49,
            transition: 'opacity 0.3s ease',
          }}
          className="lg-hide"
        />
      )}

      {/* Desktop Fixed Sidebar (w-72) */}
      <aside
        style={{
          width: '288px',
          height: 'calc(100vh - 36px)',
          backgroundColor: '#141414',
          borderRight: '1px solid #222222',
          position: 'fixed',
          top: '36px',
          left: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        className="desktop-sidebar-only"
      >
        <div>
          {/* Logo Header */}
          <div
            style={{
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              borderBottom: '1px solid #222222',
            }}
          >
            <span
              onClick={() => onSelectTab('home')}
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '20px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                lineHeight: 1,
                cursor: 'pointer',
                userSelect: 'none',
              }}
              title="Kembali ke Halaman Utama"
            >
              FPL KINO <span style={{ color: '#CCFF00' }}>HUB</span>
            </span>
            <LanguageToggle />
          </div>

          {/* Navigation Links */}
          <nav
            style={{
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: isActive ? '1px solid rgba(204,255,0,0.3)' : '1px solid transparent',
                    backgroundColor: isActive ? 'rgba(204,255,0,0.08)' : 'transparent',
                    color: isActive ? '#CCFF00' : '#9E9E9E',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    width: '100%',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#1C1C1C';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9E9E9E';
                    }
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: '3px',
                        backgroundColor: '#CCFF00',
                        borderRadius: '0 4px 4px 0',
                      }}
                    />
                  )}
                  <span
                    className="material-symbols-outlined"
                    style={{
                      marginRight: '16px',
                      fontSize: '20px',
                      color: isActive ? '#CCFF00' : '#9E9E9E',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: isActive ? 800 : 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* GW Status & User Account Box (Bottom Left Sidebar) */}
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* User Account Card */}
          {user && (
            <div
              style={{
                backgroundColor: '#181818',
                border: '1px solid #282828',
                borderRadius: '12px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#3B82F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12px',
                    flexShrink: 0,
                  }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      color: '#E5E7EB',
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.name || user.email.split('@')[0]}
                  </div>
                  <div
                    style={{
                      color: '#9CA3AF',
                      fontSize: '10px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                title="Keluar / Sign Out"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}

          <div
            style={{
              padding: '16px',
              backgroundColor: '#141414',
              borderRadius: '14px',
              border: `1px solid ${isLive ? 'rgba(0,255,136,0.3)' : '#222222'}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: isLive ? '#00FF88' : '#CCFF00',
                opacity: isLive ? 0.8 : 0.4,
              }}
            />
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 700,
                color: '#666666',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              GW STATUS
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: isLive ? '#00FF88' : '#9E9E9E',
                  boxShadow: isLive ? '0 0 8px rgba(0,255,136,0.7)' : 'none',
                  animation: isLive ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: isLive ? '#00FF88' : '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {displayText}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Slide-in Drawer from Right (w-[280px]) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '280px',
          backgroundColor: '#111111',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #222222',
        }}
        className="lg-hide"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid #222222',
          }}
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
            MENU
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9E9E9E',
              cursor: 'pointer',
              padding: '8px',
            }}
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className="font-headline-lg"
                style={{
                  fontSize: '18px',
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  padding: '16px',
                  backgroundColor: isActive ? '#CCFF00' : 'transparent',
                  color: isActive ? '#000000' : '#9E9E9E',
                  borderBottom: '1px solid #222222',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {item.drawerLabel}
              </button>
            );
          })}
        </nav>

        {/* Mobile GW Status Box */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#141414',
            margin: '16px',
            borderRadius: '14px',
            border: `1px solid ${isLive ? 'rgba(0,255,136,0.3)' : '#222222'}`,
          }}
        >
          <div
            className="font-label-caps"
            style={{
              fontSize: '10px',
              color: '#9E9E9E',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            GW STATUS
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isLive ? '#00FF88' : '#9E9E9E',
                boxShadow: isLive ? '0 0 8px rgba(0,255,136,0.7)' : 'none',
                animation: isLive ? 'pulse 1.5s ease-in-out infinite' : 'none',
                flexShrink: 0,
              }}
            />
            <span
              className="font-label-caps"
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: isLive ? '#00FF88' : '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {displayText}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
