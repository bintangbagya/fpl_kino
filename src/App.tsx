import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { GlobalNewsTicker } from './components/layout/GlobalNewsTicker';
import { HomePage } from './pages/HomePage';
import { LeaguePage } from './pages/LeaguePage';
import { CupPage } from './pages/CupPage';
import { PrizePoolPage } from './pages/PrizePoolPage';
import { HallOfFamePage } from './pages/HallOfFamePage';
import { NewsletterPage } from './pages/NewsletterPage';

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/newsletter')) return 'newsletter';
      if (pathname.startsWith('/league')) return 'league';
      if (pathname.startsWith('/cup')) return 'cup';
      if (pathname.startsWith('/prizes')) return 'prizes';
      if (pathname.startsWith('/stats')) return 'stats';

      const params = new URLSearchParams(window.location.search);
      const article = params.get('article');
      const tab = params.get('tab');
      if (article || tab === 'newsletter') return 'newsletter';
      if (tab && ['home', 'league', 'cup', 'prizes', 'stats'].includes(tab)) return tab;
    }
    return 'home';
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleLocationCheck = () => {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/newsletter')) {
          setActiveTab('newsletter');
        } else {
          const params = new URLSearchParams(window.location.search);
          const article = params.get('article');
          const tab = params.get('tab');
          if (article || tab === 'newsletter') {
            setActiveTab('newsletter');
          }
        }
      };

      handleLocationCheck();
      window.addEventListener('popstate', handleLocationCheck);
      return () => window.removeEventListener('popstate', handleLocationCheck);
    }
  }, []);

  // 1. Loading Splash
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(59, 130, 246, 0.2)',
            borderTopColor: '#3B82F6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '16px',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em' }}>
          MEMUAT FPL KINO HUB...
        </div>
      </div>
    );
  }

  // 2. Require Google SSO Login
  if (!user) {
    return <LoginPage />;
  }

  // 3. Authenticated App Layout
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '36px', // Spacing for fixed top sticky news ticker
      }}
    >
      {/* Global Sticky News Ticker */}
      <GlobalNewsTicker onNavigateToNewsletter={() => setActiveTab('newsletter')} />
      
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <div
        className="main-content-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Top Mobile Header */}
        <TopHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onNavigateHome={() => setActiveTab('home')}
        />

        {/* Page Body Container */}
        <main
          className="app-main-content"
          style={{
            padding: '24px',
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {activeTab === 'home' && (
            <HomePage
              onNavigateToLeague={() => setActiveTab('league')}
              onNavigateToNewsletter={() => setActiveTab('newsletter')}
            />
          )}
          {activeTab === 'league' && <LeaguePage />}
          {activeTab === 'cup' && <CupPage />}
          {activeTab === 'prizes' && <PrizePoolPage />}
          {activeTab === 'stats' && <HallOfFamePage />}
          {activeTab === 'newsletter' && <NewsletterPage />}
          {activeTab !== 'home' && activeTab !== 'league' && activeTab !== 'cup' && activeTab !== 'prizes' && activeTab !== 'stats' && activeTab !== 'newsletter' && (
            <div
              style={{
                padding: '64px 20px',
                textAlign: 'center',
                backgroundColor: '#141414',
                borderRadius: '14px',
                border: '1px solid #222222',
              }}
            >
              <h2 className="font-headline-lg" style={{ color: '#FFFFFF', marginBottom: '8px' }}>
                {activeTab.toUpperCase().replace('-', ' ')} SECTION
              </h2>
              <p style={{ color: '#9E9E9E', marginBottom: '20px' }}>
                This section is coming soon as part of the next feature roadmap.
              </p>
              <button onClick={() => setActiveTab('home')} className="btn-primary">
                RETURN TO HOME
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
