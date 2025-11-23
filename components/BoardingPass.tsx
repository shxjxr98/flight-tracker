import React from 'react';
import { Flight } from '../app/actions';

interface BoardingPassProps {
    flight: Flight | null;
    loading?: boolean;
}

const BoardingPass: React.FC<BoardingPassProps> = ({ flight, loading }) => {
    if (loading) {
        return <div className="boarding-pass skeleton-pass"></div>;
    }

    if (!flight) return null;

    const originCode = flight.startLocation.split('(')[1]?.replace(')', '') || 'ORG';
    const destCode = flight.endLocation.split('(')[1]?.replace(')', '') || 'DST';
    const originCity = flight.startLocation.split('(')[0].trim();
    const destCity = flight.endLocation.split('(')[0].trim();

    return (
        <div className="boarding-pass">
            {/* Main Section (Left) */}
            <div className="bp-main">
                <div className="bp-header">
                    <span className="bp-airline">{flight.airline}</span>
                </div>

                <div className="bp-route">
                    <span className="bp-code">{originCode}</span>
                    <div className="bp-plane-icon">✈</div>
                    <span className="bp-code">{destCode}</span>
                </div>

                <div className="bp-footer">
                    <div className="bp-passenger">
                        <span className="bp-label">Passenger</span>
                        <span className="bp-value">Guest User</span>
                    </div>
                    <div className="bp-number">
                        <span className="bp-label">Flight No.</span>
                        <span className="bp-value">{flight.flightNumber}</span>
                    </div>
                </div>
            </div>

            {/* Divider with Notches */}
            <div className="bp-divider">
                <div className="notch-top"></div>
                <div className="dashed-line"></div>
                <div className="notch-bottom"></div>
            </div>

            {/* Stub Section (Right) */}
            <div className="bp-stub">
                <div className="bp-stub-header">
                    <div className="bp-passenger-stub">
                        <span className="bp-value">Guest User</span>
                        <span className="bp-label-sm">BOARDING PASS</span>
                    </div>
                </div>

                <div className="bp-timeline">
                    <div className="bp-timeline-item">
                        <div className="bp-dot"></div>
                        <div className="bp-timeline-content">
                            <span className="bp-label-xs">From</span>
                            <span className="bp-city">{originCity}</span>
                        </div>
                    </div>
                    <div className="bp-timeline-line"></div>
                    <div className="bp-timeline-item">
                        <div className="bp-dot"></div>
                        <div className="bp-timeline-content">
                            <span className="bp-label-xs">To</span>
                            <span className="bp-city">{destCity}</span>
                        </div>
                    </div>
                </div>

                <div className="bp-details-grid">
                    <div className="bp-detail">
                        <span className="bp-icon">📅</span>
                        <div>
                            <span className="bp-label-xs">Date</span>
                            <span className="bp-value-sm">{new Date(flight.startTime).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="bp-detail">
                        <span className="bp-icon">🕒</span>
                        <div>
                            <span className="bp-label-xs">Time</span>
                            <span className="bp-value-sm">{new Date(flight.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                    <div className="bp-detail">
                        <span className="bp-icon">🚪</span>
                        <div>
                            <span className="bp-label-xs">Gate</span>
                            <span className="bp-value-sm">B12</span>
                        </div>
                    </div>
                    <div className="bp-detail">
                        <span className="bp-icon">💺</span>
                        <div>
                            <span className="bp-label-xs">Seat</span>
                            <span className="bp-value-sm">12B</span>
                        </div>
                    </div>
                </div>

                <button className="bp-action-btn">
                    Track Flights free
                </button>
            </div>
        </div>
    );
};

export default BoardingPass;
