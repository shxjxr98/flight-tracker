import React from 'react';

interface Flight {
    flightNumber: string;
    airline: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    timeZone: string;
    status: string;
}

interface BoardingPassProps {
    flight: Flight | null;
    loading?: boolean;
}

const BoardingPass: React.FC<BoardingPassProps> = ({ flight, loading = false }) => {
    if (loading) {
        return <div className="flight-card-modern skeleton-pass"></div>;
    }

    if (!flight) {
        return null;
    }

    // Extract airport codes
    const departureCode = flight.startLocation.split('(')[1]?.replace(')', '') || 'DEN';
    const arrivalCode = flight.endLocation.split('(')[1]?.replace(')', '') || 'SLC';

    // Extract city names
    const departureCity = flight.startLocation.split('(')[0].trim() || 'Denver';
    const arrivalCity = flight.endLocation.split('(')[0].trim() || 'Salt Lake City';

    // Format times
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Calculate flight duration
    const calculateDuration = () => {
        const start = new Date(flight.startTime).getTime();
        const end = new Date(flight.endTime).getTime();
        const diff = end - start;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h${minutes}m`;
    };

    // Calculate landing time (hardcoded for demo)
    const landingTime = "27m";

    return (
        <div className="flight-card-modern">
            {/* Status Bar */}
            <div className="fc-status-bar">
                <div className="fc-status-left">
                    <span className="fc-status-label">In Flight</span>
                </div>
                <div className="fc-status-right">
                    <span className="fc-landing-time">Landing in {landingTime}</span>
                </div>
            </div>

            {/* Airport Section */}
            <div className="fc-airports">
                <div className="fc-airport">
                    <div className="fc-airport-code">{departureCode} MAIN</div>
                    <div className="fc-airport-city">{departureCity}</div>
                </div>
                <div className="fc-airport">
                    <div className="fc-airport-code">{arrivalCode} T1</div>
                    <div className="fc-airport-city">{arrivalCity}</div>
                </div>
            </div>

            {/* Time Section */}
            <div className="fc-times">
                <div className="fc-time-block">
                    <div className="fc-time-large">{formatTime(flight.startTime)}</div>
                    <div className="fc-time-date">{formatDate(flight.startTime)}</div>
                </div>

                <div className="fc-duration">
                    <svg className="fc-plane-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                    <div className="fc-duration-text">{calculateDuration()}</div>
                </div>

                <div className="fc-time-block">
                    <div className="fc-time-large">{formatTime(flight.endTime)}</div>
                    <div className="fc-time-date">{formatDate(flight.endTime)}</div>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="fc-bottom-info">
                <div className="fc-info-item">
                    <svg className="fc-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <div className="fc-info-label">Check-in Area</div>
                </div>
                <div className="fc-info-item">
                    <svg className="fc-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <div className="fc-info-label">Gate</div>
                    <div className="fc-info-value">A73</div>
                </div>
                <div className="fc-info-item">
                    <svg className="fc-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div className="fc-info-label">Baggage Claim</div>
                </div>
            </div>
        </div>
    );
};

export default BoardingPass;
