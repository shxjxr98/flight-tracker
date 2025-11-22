'use client';

import { useState } from 'react';
import { searchFlights, Flight } from './actions';

export default function Home() {
    const [query, setQuery] = useState('');
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            } else {
                setError('Flight not found. Please check the flight number.');
            }
        } catch (err) {
            setError('An error occurred while searching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <main className="container">
            <h1>FlightTracker</h1>
            <p className="subtitle">Real-time flight status and details</p>

            <form onSubmit={handleSearch} className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter flight number (e.g., AA123)"
                    className="search-input"
                />
                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? 'Searching...' : 'Track Flight'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {flight && (
                <div className="flight-card">
                    <div className="flight-header">
                        <div className="flight-number">
                            {flight.airline} {flight.flightNumber}
                        </div>
                        <div className={`flight-status status-${flight.status.toLowerCase().replace(' ', '-')}`}>
                            {flight.status}
                        </div>
                    </div>

                    <div className="route-container">
                        <div className="location" style={{ textAlign: 'left' }}>
                            <div className="location-code">{flight.startLocation.split('(')[1].replace(')', '')}</div>
                            <div className="location-name">{flight.startLocation.split('(')[0].trim()}</div>
                        </div>
                        <div className="route-line"></div>
                        <div className="location" style={{ textAlign: 'right' }}>
                            <div className="location-code">{flight.endLocation.split('(')[1].replace(')', '')}</div>
                            <div className="location-name">{flight.endLocation.split('(')[0].trim()}</div>
                        </div>
                    </div>

                    <div className="time-info">
                        <div className="time-block">
                            <h3>Departure</h3>
                            <div className="time-value">
                                {formatTime(flight.startTime)}
                                <span className="timezone">{flight.timeZone}</span>
                            </div>
                            <div className="time-date">
                                {formatDate(flight.startTime)}
                            </div>
                        </div>
                        <div className="time-block">
                            <h3>Arrival</h3>
                            <div className="time-value">
                                {formatTime(flight.endTime)}
                                <span className="timezone">{flight.timeZone}</span>
                            </div>
                            <div className="time-date">
                                {formatDate(flight.endTime)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
