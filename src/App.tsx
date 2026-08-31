import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { GlobalNewsTicker } from './components/layout/GlobalNewsTicker';
import { HomePage } from './pages/HomePage';
import { LeaguePage } from './pages/LeaguePage';
import { CupPage } from './pages/CupPage';
import { PrizePoolPage } from './pages/PrizePoolPage';
import { HallOfFamePage } from './pages/HallOfFamePage';
import { NewsletterPage } from './pages/NewsletterPage';

export const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
};

export default App;
