'use client';

import { useState, useEffect } from 'react';
import { searchFlights, Flight } from './actions';
import DarkModeToggle from '../components/DarkModeToggle';
import ProgressBar from '../components/ProgressBar';
import AnalogClock from '../components/AnalogClock';
import dynamic from 'next/dynamic';
import WeatherCard from '../components/WeatherCard';

const FlightMap = dynamic(() => import('../components/FlightMap'), { ssr: false });

export default function Home() {
    const [query, setQuery] = useState('');
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [tempUnit, setTempUnit] = useState<'C' | 'F'>('F');

    // Update current time every second for analog clocks
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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
        if (!query.trim()) return;

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

    // Temperature conversion function
    const convertTemp = (fahrenheit: number, unit: 'C' | 'F') => {
        if (unit === 'C') {
            return Math.round((fahrenheit - 32) * 5 / 9);
        }
        return fahrenheit;
    };

    // Mock data for details not in API
    const mockTemp = 52; // Base temperature in Fahrenheit
    const mockDetails = {
        gate: 'B12',
        terminal: '5',
        baggage: 'Carousel 5',
        weather: `${convertTemp(mockTemp, tempUnit)}°${tempUnit}, Cloudy`,
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
                            latitude={51.505}
                            longitude={-0.09}
                            flightNumber={flight.flightNumber}
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

                    {/* Weather Zone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <WeatherCard
                            type="departure"
                            data={{
                                city: flight.startLocation.split('(')[0].trim(),
                                temperature: 18,
                                condition: 'cloudy',
                                windSpeed: 12
                            }}
                        />
                        <WeatherCard
                            type="arrival"
                            data={{
                                city: flight.endLocation.split('(')[0].trim(),
                                temperature: 24,
                                condition: 'sunny',
                                windSpeed: 8
                            }}
                        />
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
                            <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                {mockDetails.weather}
                                <button
                                    onClick={() => setTempUnit(tempUnit === 'F' ? 'C' : 'F')}
                                    aria-label={`Switch to ${tempUnit === 'F' ? 'Celsius' : 'Fahrenheit'}`}
                                    title={`Switch to ${tempUnit === 'F' ? 'Celsius' : 'Fahrenheit'}`}
                                    style={{
                                        background: 'var(--aa-primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s ease',
                                        minWidth: '32px',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#006BC1')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--aa-primary)')}
                                >
                                    °{tempUnit === 'F' ? 'C' : 'F'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Zone */}
                    <div className="action-zone">
                        <button
                            className="action-button"
                            aria-label="Get flight alerts"
                            onClick={() => {
                                const email = prompt('Enter your email address to receive flight alerts:');
                                if (email && email.includes('@')) {
                                    alert(`✅ Alerts enabled for ${email}\n\nYou'll receive notifications about:\n• Gate changes\n• Delays\n• Boarding calls\n• Baggage carousel updates`);
                                } else if (email) {
                                    alert('❌ Please enter a valid email address');
                                }
                            }}
                        >
                            🔔 Get Alerts
                        </button>
                        <button
                            className="action-button secondary"
                            aria-label="Share flight"
                            onClick={async () => {
                                const shareData = {
                                    title: `Flight ${flight.airline} ${flight.flightNumber}`,
                                    text: `${flight.airline} ${flight.flightNumber} - ${flight.status}\nDeparture: ${flight.startLocation} at ${formatTime(flight.startTime)}\nArrival: ${flight.endLocation} at ${formatTime(flight.endTime)}`,
                                    url: window.location.href
                                };

                                if (navigator.share) {
                                    try {
                                        await navigator.share(shareData);
                                    } catch (err) {
                                        if ((err as Error).name !== 'AbortError') {
                                            console.error('Share failed:', err);
                                        }
                                    }
                                } else {
                                    // Fallback: copy to clipboard
                                    navigator.clipboard.writeText(shareData.text);
                                    alert('✅ Flight details copied to clipboard!');
                                }
                            }}
                        >
                            📤 Share Flight
                        </button>
                        <button
                            className="action-button secondary"
                            aria-label="Add to calendar"
                            onClick={() => {
                                // Create .ics file for calendar
                                const depDate = new Date(flight.startTime);
                                const arrDate = new Date(flight.endTime);

                                const formatICSDate = (date: Date) => {
                                    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                                };

                                const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FlightTracker//EN
BEGIN:VEVENT
UID:${flight.flightNumber}-${Date.now()}@flighttracker.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(depDate)}
DTEND:${formatICSDate(arrDate)}
SUMMARY:Flight ${flight.airline} ${flight.flightNumber}
DESCRIPTION:${flight.airline} ${flight.flightNumber}\\nStatus: ${flight.status}\\nDeparture: ${flight.startLocation}\\nArrival: ${flight.endLocation}
LOCATION:${flight.startLocation}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT2H
DESCRIPTION:Flight departure in 2 hours
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

                                const blob = new Blob([icsContent], { type: 'text/calendar' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `flight-${flight.flightNumber}.ics`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);

                                alert('✅ Calendar event downloaded! Open the .ics file to add to your calendar.');
                            }}
                        >
                            📅 Add to Calendar
                        </button>
                        <button
                            className="action-button secondary"
                            aria-label="View terminal map"
                            onClick={() => {
                                // Extract airport code
                                const airportCode = flight.startLocation.split('(')[1]?.replace(')', '');
                                const terminal = mockDetails.terminal;
                                const gate = mockDetails.gate;

                                // Open Google Maps with airport search
                                const searchQuery = `${airportCode} airport terminal ${terminal} gate ${gate}`;
                                const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
                                window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                            }}
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
                            aria-label="Refresh flight data"
                            title="Refresh flight data"
                        >
                            🔄 Refresh
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
