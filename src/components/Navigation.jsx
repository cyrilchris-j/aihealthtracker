import React, { useState } from 'react';

const Navigation = ({ currentPage, onNavigate }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'habits', label: 'My Habits', icon: '✅' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'insights', label: 'AI Insights', icon: '🤖' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <nav style={styles.nav}>
            <div className="container">
                <div className="flex items-center justify-between" style={{ padding: '1rem 0' }}>
                    <div className="flex items-center gap-md">
                        <h1 style={styles.logo}>
                            <span style={styles.logoIcon}>🎯</span>
                            Habit Tracker
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div style={styles.desktopNav}>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`btn ${currentPage === item.id ? 'btn-primary' : 'btn-ghost'}`}
                                style={styles.navButton}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="btn btn-ghost btn-icon"
                        style={styles.mobileMenuButton}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div style={styles.mobileNav} className="fade-in">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`btn ${currentPage === item.id ? 'btn-primary' : 'btn-ghost'}`}
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        margin: 0,
    },
    logoIcon: {
        fontSize: '1.75rem',
    },
    desktopNav: {
        display: 'flex',
        gap: '0.5rem',
    },
    navButton: {
        fontSize: '0.875rem',
    },
    mobileMenuButton: {
        display: 'none',
        fontSize: '1.5rem',
    },
    mobileNav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        paddingBottom: '1rem',
    },
};

// Media query for mobile
if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const updateStyles = (e) => {
        if (e.matches) {
            styles.desktopNav.display = 'none';
            styles.mobileMenuButton.display = 'flex';
        } else {
            styles.desktopNav.display = 'flex';
            styles.mobileMenuButton.display = 'none';
        }
    };

    mediaQuery.addListener(updateStyles);
    updateStyles(mediaQuery);
}

export default Navigation;
