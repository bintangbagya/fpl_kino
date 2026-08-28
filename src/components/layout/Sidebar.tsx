import React from 'react';

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
  const navItems = [
    { id: 'home', label: 'HOME', icon: 'home', drawerLabel: 'HOME' },
    { id: 'league', label: 'FPL KINO LEAGUE', icon: 'leaderboard', drawerLabel: 'FPL KINO LEAGUE' },
    { id: 'cup', label: 'FPL KINO CUP', icon: 'emoji_events', drawerLabel: 'FPL KINO CUP' },
    { id: 'prizes', label: 'PRIZE POOL', icon: 'redeem', drawerLabel: 'PRIZE POOL' },
    { id: 'stats', label: 'HALL OF FAME', icon: 'military_tech', drawerLabel: 'HALL OF FAME' },
    { id: 'newsletter', label: 'NEWSLETTER', icon: 'mail', drawerLabel: 'NEWSLETTER' },
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
          height: '100vh',
          backgroundColor: '#141414',
          borderRight: '1px solid #222222',
          position: 'fixed',
          top: 0,
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
              gap: '16px',
              borderBottom: '1px solid #222222',
            }}
          >
            <span
              className="font-headline-lg"
              style={{
                fontSize: '24px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                fontStyle: 'italic',
                lineHeight: 1,
              }}
            >
              FPL KINO <span style={{ color: '#CCFF00' }}>HUB</span>
            </span>
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
                      fontSize: '22px',
                      color: isActive ? '#CCFF00' : '#9E9E9E',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    className="font-label-caps"
                    style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 800 : 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* GW Status Live Box */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#141414',
            margin: '16px',
            borderRadius: '14px',
            border: '1px solid rgba(204,255,0,0.2)',
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
              backgroundColor: '#CCFF00',
              opacity: 0.6,
            }}
          />
          <div
            className="font-label-caps"
            style={{
              fontSize: '10px',
              color: '#9E9E9E',
              marginBottom: '4px',
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
                backgroundColor: '#CCFF00',
                boxShadow: '0 0 8px rgba(204,255,0,0.7)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <span
              className="font-label-caps"
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#CCFF00',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              LIVE NOW
            </span>
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
      </div>
    </>
  );
};
