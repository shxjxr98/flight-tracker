'use client';

import { useState, useEffect } from 'react';
import { searchFlights, Flight } from './actions';
import DarkModeToggle from '../components/DarkModeToggle';
import ProgressBar from '../components/ProgressBar';
import AnalogClock from '../components/AnalogClock';
import FlightMap from '../components/FlightMap';

export default function Home() {
    const [query, setQuery] = useState('');
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [alertsEnabled, setAlertsEnabled] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshThrottle, setRefreshThrottle] = useState(false);
    const [toast, setToast] = useState('');

    // Check alerts status on mount
    useEffect(() => {
        const stored = localStorage.getItem('flight-alerts-enabled');
        if (stored === 'true') {
            setAlertsEnabled(true);
        }
    }, []);

    // Update current time every second for analog clocks
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Keyboard shortcut for refresh
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'r' && flight) {
                e.preventDefault();
                handleRefresh();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [flight, query]);

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
            } else {
                setError('Flight not found. Please check the flight number.');
            }
        } catch (err) {
            setError('Unable to connect. Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (!query.trim() || refreshThrottle) return;

        setRefreshing(true);
        setRefreshThrottle(true);

        try {
            const results = await searchFlights(query);
            if (results.length > 0) {
                setFlight(results[0]);
                setLastUpdated(new Date());
                showToast('Flight data refreshed');
            }
        } catch (err) {
            setError('Can\'t reach server. Please try again.');
        } finally {
            setRefreshing(false);
            // Throttle for 5 seconds
            setTimeout(() => setRefreshThrottle(false), 5000);
        }
    };

    // 1. Get Alerts
    const handleGetAlerts = async () => {
        if (alertsEnabled) {
            // Toggle off
            setAlertsEnabled(false);
            localStorage.setItem('flight-alerts-enabled', 'false');
            showToast('Alerts disabled');
            return;
        }

        // Request notification permission
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setAlertsEnabled(true);
                localStorage.setItem('flight-alerts-enabled', 'true');
                showToast('Alerts enabled!');
                // In production, subscribe to push service here
            } else {
                // Fallback to email
                const flightId = flight ? `${flight.airline}${flight.flightNumber}` : 'Flight';
                const date = flight ? formatDate(flight.startTime) : '';
                window.location.href = `mailto:alerts@americanairlines.com?subject=Alert me for ${flightId} on ${date}&body=Please send me alerts for this flight.`;
            }
        } else {
            // No notification support, use email
            const flightId = flight ? `${flight.airline}${flight.flightNumber}` : 'Flight';
            const date = flight ? formatDate(flight.startTime) : '';
            window.location.href = `mailto:alerts@americanairlines.com?subject=Alert me for ${flightId} on ${date}&body=Please send me alerts for this flight.`;
        }
    };

    // 2. Share Flight
    const handleShareFlight = async () => {
        if (!flight) return;

        const flightId = `${flight.airline}${flight.flightNumber}`;
        const date = new Date(flight.startTime).toISOString().split('T')[0];
        const shareData = {
            title: `${flightId} flight status`,
            text: `${flightId} ${flight.startLocation.split('(')[1]?.replace(')', '')}→${flight.endLocation.split('(')[1]?.replace(')', '')} on ${formatDate(flight.startTime)} is ${flight.status}. Track live:`,
            url: `${window.location.origin}?flight=${flightId}&date=${date}`
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                showToast('Link copied to clipboard!');
            } catch (err) {
                showToast('Unable to copy link');
            }
        }
    };

    // 3. Add to Calendar
    const handleAddToCalendar = () => {
        if (!flight) return;

        const formatICSDate = (dateString: string) => {
            return new Date(dateString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const flightId = `${flight.airline}${flight.flightNumber}`;
        const depCode = flight.startLocation.split('(')[1]?.replace(')', '');
        const arrCode = flight.endLocation.split('(')[1]?.replace(')', '');
        const depName = flight.startLocation.split('(')[0].trim();
        const arrName = flight.endLocation.split('(')[0].trim();

        const icsBody = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FlightTracker//Flight//EN
BEGIN:VEVENT
UID:${flightId}-${Date.now()}@flighttracker.com
DTSTART:${formatICSDate(flight.startTime)}
DTEND:${formatICSDate(flight.endTime)}
SUMMARY:Flight ${flightId} ${depCode}→${arrCode}
DESCRIPTION:${flightId} on ${formatDate(flight.startTime)}. Status: ${flight.status}
LOCATION:${depName} (${depCode}) → ${arrName} (${arrCode})
END:VEVENT
END:VCALENDAR`.trim();

        const blob = new Blob([icsBody], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${flightId}-${formatDate(flight.startTime).replace(/\s/g, '')}.ics`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Calendar event downloaded');
    };

    // 4. Terminal Map
    const handleTerminalMap = () => {
        if (!flight) return;

        const depCode = flight.startLocation.split('(')[1]?.replace(')', '');
        const arrCode = flight.endLocation.split('(')[1]?.replace(')', '');

        // Determine which terminal to show based on flight progress
        const progress = getProgress();
        let terminal = '';

        if (progress < 50) {
            // Show departure terminal
            if (depCode === 'JFK') terminal = 'JFK Terminal 8';
            else terminal = `${depCode} Airport Terminal`;
        } else {
            // Show arrival terminal
            if (arrCode === 'LHR') terminal = 'LHR Terminal 3';
            else terminal = `${arrCode} Airport Terminal`;
        }

        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(terminal)}`;
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    };

    // Toast notification helper
    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(''), 3000);
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

    const getProgress = () => {
        if (!flight) return 0;
        const now = new Date().getTime();
        const start = new Date(flight.startTime).getTime();
        const end = new Date(flight.endTime).getTime();
        const progress = ((now - start) / (end - start)) * 100;
        return Math.max(0, Math.min(100, progress));
    };

    const getMicroCopy = () => {
        if (!flight) return '';
        const status = flight.status.toLowerCase();

        if (status.includes('on time')) {
            return "We're on time. Relax—you've got time until boarding.";
        } else if (status.includes('delayed')) {
            return "Running a bit late. We'll keep you updated.";
        } else if (status.includes('boarding')) {
            return "Boarding now. Time to head to the gate!";
        } else if (status.includes('landed')) {
            return "Welcome! Check the baggage carousel for your luggage.";
        }
        return '';
    };

    const getStatusClass = () => {
        if (!flight) return 'status-on-time';
        const status = flight.status.toLowerCase();
        if (status.includes('delayed')) return 'status-delayed';
        if (status.includes('cancelled')) return 'status-cancelled';
        if (status.includes('landed')) return 'status-landed';
        return 'status-on-time';
    };

    // Mock data for details not in API
    const mockDetails = {
        gate: 'B12',
        terminal: '5',
        baggage: 'Carousel 5',
        weather: '52°F, Cloudy',
    };

    return (
        <main className="container">
            <DarkModeToggle />

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    background: 'var(--aa-primary)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    animation: 'slideUp 0.3s ease-out',
                }}>
                    {toast}
                </div>
            )}

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

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}

            {flight && (
                <div className="flight-card" role="region" aria-label="Flight information">
                    {/* Hero Zone */}
                    <div className="hero-zone">
                        <div className="flight-info">
                            <div className="airline-logo" aria-label="Airline logo">
                                AA
                            </div>
                            <div>
                                <div className="flight-number">
                                    {flight.airline} {flight.flightNumber}
                                </div>
                                {getMicroCopy() && (
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                                        {getMicroCopy()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`status-badge ${getStatusClass()}`} role="status" aria-live="polite">
                            {flight.status}
                        </div>
                    </div>

                    {/* Progress Zone */}
                    <div className="progress-zone">
                        <ProgressBar progress={getProgress()} status={flight.status.toLowerCase()} />
                        <FlightMap
                            departure={flight.startLocation.split('(')[1]?.replace(')', '') || 'DEP'}
                            arrival={flight.endLocation.split('(')[1]?.replace(')', '') || 'ARR'}
                            progress={getProgress()}
                        />
                    </div>

                    {/* Time Zone */}
                    <div className="time-zone">
                        {/* Departure */}
                        <div className="time-card">
                            <div className="time-label">Departure</div>
                            <div className="airport-code">
                                {flight.startLocation.split('(')[1]?.replace(')', '')}
                            </div>
                            <div className="airport-name">
                                {flight.startLocation.split('(')[0].trim()}
                            </div>
                            <AnalogClock
                                time={new Date(flight.startTime)}
                                label="Local Time"
                            />
                            <div className="digital-time">
                                {formatTime(flight.startTime)}
                            </div>
                            <div className="timezone-label">
                                {formatDate(flight.startTime)} • {flight.timeZone}
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="time-card">
                            <div className="time-label">Arrival</div>
                            <div className="airport-code">
                                {flight.endLocation.split('(')[1]?.replace(')', '')}
                            </div>
                            <div className="airport-name">
                                {flight.endLocation.split('(')[0].trim()}
                            </div>
                            <AnalogClock
                                time={new Date(flight.endTime)}
                                label="Local Time"
                            />
                            <div className="digital-time">
                                {formatTime(flight.endTime)}
                            </div>
                            <div className="timezone-label">
                                {formatDate(flight.endTime)} • {flight.timeZone}
                            </div>
                        </div>
                    </div>

                    {/* Details Zone */}
                    <div className="details-zone">
                        <div className="detail-item">
                            <div className="detail-label">Gate</div>
                            <div className="detail-value">{mockDetails.gate}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Terminal</div>
                            <div className="detail-value">{mockDetails.terminal}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Baggage</div>
                            <div className="detail-value">{mockDetails.baggage}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Weather</div>
                            <div className="detail-value">{mockDetails.weather}</div>
                        </div>
                    </div>

                    {/* Action Zone */}
                    <div className="action-zone">
                        <button
                            className="action-button"
                            onClick={handleGetAlerts}
                            aria-label={alertsEnabled ? "Disable flight alerts" : "Get flight alerts"}
                        >
                            {alertsEnabled ? '🔔 Alerts ON' : '🔔 Get Alerts'}
                        </button>
                        <button
                            className="action-button secondary"
                            onClick={handleShareFlight}
                            aria-label="Share flight"
                        >
                            📤 Share Flight
                        </button>
                        <button
                            className="action-button secondary"
                            onClick={handleAddToCalendar}
                            aria-label="Add to calendar"
                        >
                            📅 Add to Calendar
                        </button>
                        <button
                            className="action-button secondary"
                            onClick={handleTerminalMap}
                            aria-label="View terminal map"
                        >
                            🗺️ Terminal Map
                        </button>
                    </div>

                    {/* Status Bar */}
                    <div className="status-bar">
                        <div className="last-updated">
                            <span>Last updated:</span>
                            <span style={{ fontWeight: '600', marginLeft: '0.25rem' }}>
                                {lastUpdated?.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <button
                            className="refresh-button"
                            onClick={handleRefresh}
                            disabled={refreshThrottle}
                            aria-label="Refresh flight data"
                            title={refreshThrottle ? "Please wait 5 seconds" : "Refresh flight data (Ctrl+R)"}
                        >
                            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
                        </button>
                    </div>

                    {/* Screen reader announcement */}
                    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                        Flight {flight.airline} {flight.flightNumber}, {flight.status},
                        departs {flight.startLocation.split('(')[1]?.replace(')', '')}
                        {formatTime(flight.startTime)} local time,
                        arrives {flight.endLocation.split('(')[1]?.replace(')', '')}
                        {formatTime(flight.endTime)} local time.
                    </div>
                </div>
            )}
        </main>
    );
}
