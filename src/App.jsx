import React, { useState } from 'react';
import { HabitProvider, useHabit } from './context/HabitContext';
import ProfileSetup from './components/ProfileSetup';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import HabitsPage from './components/HabitsPage';
import AnalyticsPage from './components/AnalyticsPage';
import InsightsPage from './components/InsightsPage';
import SettingsPage from './components/SettingsPage';
import './index.css';

const AppContent = () => {
  const { userProfile, loading } = useHabit();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>
        <p style={styles.loadingText}>Loading your habits...</p>
      </div>
    );
  }

  // Show profile setup if no profile exists
  if (!userProfile && !showProfileSetup) {
    return <ProfileSetup onComplete={() => setShowProfileSetup(true)} />;
  }

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'habits':
        return <HabitsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'insights':
        return <InsightsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={styles.app}>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main style={styles.main}>
        {renderPage()}
      </main>
      <footer style={styles.footer}>
        <div className="container">
          <p className="text-center text-secondary text-sm">
            Built with ❤️ to help you build better habits
          </p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <HabitProvider>
      <AppContent />
    </HabitProvider>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
  },
  footer: {
    padding: '2rem 0',
    borderTop: '1px solid var(--border-color)',
    marginTop: '3rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '1rem',
  },
  loadingText: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
};

export default App;
