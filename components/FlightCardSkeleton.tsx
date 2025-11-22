'use client';

export default function FlightCardSkeleton() {
    return (
        <div className="flight-card skeleton-container" role="status" aria-label="Loading flight information">
            {/* Hero Zone Skeleton */}
            <div className="hero-zone">
                <div className="flight-info">
                    <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '0.5rem' }} />
                    <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '0.5rem' }} />
                        <div className="skeleton" style={{ width: '300px', height: '20px' }} />
                    </div>
                </div>
                <div className="skeleton" style={{ width: '100px', height: '32px', borderRadius: '2rem' }} />
            </div>

            {/* Progress Zone Skeleton */}
            <div className="progress-zone">
                <div className="skeleton" style={{ width: '100%', height: '8px', borderRadius: '1rem', marginBottom: '1.5rem' }} />
                <div className="skeleton" style={{ width: '100%', height: '150px', borderRadius: '0.75rem' }} />
            </div>

            {/* Time Zone Skeleton */}
            <div className="time-zone">
                <div className="time-card">
                    <div className="skeleton" style={{ width: '80px', height: '16px', margin: '0 auto 0.5rem' }} />
                    <div className="skeleton" style={{ width: '100px', height: '40px', margin: '0 auto 0.5rem' }} />
                    <div className="skeleton" style={{ width: '150px', height: '20px', margin: '0 auto 1rem' }} />
                    <div className="skeleton" style={{ width: '120px', height: '120px', margin: '0 auto 1rem', borderRadius: '50%' }} />
                    <div className="skeleton" style={{ width: '100px', height: '32px', margin: '0 auto 0.5rem' }} />
                    <div className="skeleton" style={{ width: '120px', height: '16px', margin: '0 auto' }} />
                </div>
                <div className="time-card">
                    <div className="skeleton" style={{ width: '80px', height: '16px', margin: '0 auto 0.5rem' }} />
                    <div className="skeleton" style={{ width: '100px', height: '40px', margin: '0 auto 0.5rem' }} />
                    <div className="skeleton" style={{ width: '150px', height: '20px', margin: '0 auto 1rem' }} />
                    <div className="skeleton" style={{ width: '120px', height: '120px', margin: '0 auto 1rem', borderRadius: '50%' }} />
                    <div className="skeleton" style={{ width: '100px', height: '32px', margin: '0 auto 0.5rem' }} />
                    <div className="skeleton" style={{ width: '120px', height: '16px', margin: '0 auto' }} />
                </div>
            </div>

            {/* Details Zone Skeleton */}
            <div className="details-zone">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="detail-item">
                        <div className="skeleton" style={{ width: '60px', height: '16px', margin: '0 auto 0.5rem' }} />
                        <div className="skeleton" style={{ width: '80px', height: '24px', margin: '0 auto' }} />
                    </div>
                ))}
            </div>

            {/* Action Zone Skeleton */}
            <div className="action-zone">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton" style={{ flex: 1, minWidth: '150px', height: '48px', borderRadius: '0.75rem' }} />
                ))}
            </div>

            {/* Status Bar Skeleton */}
            <div className="status-bar">
                <div className="skeleton" style={{ width: '150px', height: '20px' }} />
                <div className="skeleton" style={{ width: '80px', height: '20px' }} />
            </div>

            <span className="sr-only">Loading flight information...</span>
        </div>
    );
}
