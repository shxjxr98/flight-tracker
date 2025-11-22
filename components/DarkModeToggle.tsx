'use client';

import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check localStorage and system preference
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialDark = stored === 'dark' || (!stored && prefersDark);

        setIsDark(initialDark);
        document.documentElement.setAttribute('data-theme', initialDark ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        const theme = newTheme ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="dark-mode-toggle"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            style={{
                background: isDark ? '#2A2A2A' : '#FFFFFF',
                border: `2px solid ${isDark ? '#444' : '#E0E0E0'}`,
                borderRadius: '2rem',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#1A1A1A',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <span style={{ fontSize: '1.25rem' }}>{isDark ? '🌙' : '☀️'}</span>
            <span>{isDark ? 'Dark' : 'Light'}</span>
        </button>
    );
}
