'use client';

import { useState, useEffect } from 'react';
import { searchFlights, Flight } from './actions';
import DarkModeToggle from '../components/DarkModeToggle';
import BoardingPass from '../components/BoardingPass';
import { triggerHaptic } from '../utils/haptic';

export default function Home() {
    const [query, setQuery] = useState('');
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Auto-refresh logic (every 30 seconds if data is fresh)
    useEffect(() => {
        if (!flight || !lastUpdated) return;

        const checkStale = setInterval(() => {
            const now = new Date();
            const diff = (now.getTime() - lastUpdated.getTime()) / 1000 / 60; // minutes

            if (diff > 5) {
                // Data is stale, trigger refresh
                handleRefresh();
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(checkStale);
    }, [flight, lastUpdated]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setFlight(null);

        try {
            const results = await searchFlights(query);
            if (results.length > 0) {
                setFlight(results[0]);
                setLastUpdated(new Date());
                triggerHaptic('success');
            } else {
                setError('Flight not found. Please check the flight number.');
                triggerHaptic('error');
            }
        } catch (err) {
            setError('Unable to connect. Please check your internet connection and try again.');
            triggerHaptic('error');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (!query.trim()) return;
        triggerHaptic('medium');

        try {
            const results = await searchFlights(query);
            if (results.length > 0) {
                setFlight(results[0]);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error('Auto-refresh failed:', err);
        }
    };

    return (
        <main className="container">
            <DarkModeToggle />

            <div className="header">
                <h1>FlightTracker</h1>
                <p className="subtitle">Real-time flight status and details</p>
            </div>

            <form onSubmit={handleSearch} className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter flight number (e.g., AA100)"
                    className="search-input"
                    aria-label="Flight number search"
                />
                <button
                    type="submit"
                    className="search-button"
                    disabled={loading}
                    aria-label="Search for flight"
                >
                    {loading ? 'Searching...' : 'Track Flight'}
                </button>
            </form>

            {loading && <BoardingPass flight={null} loading={true} />}

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}

            {flight && <BoardingPass flight={flight} />}
        </main>
    );
}
