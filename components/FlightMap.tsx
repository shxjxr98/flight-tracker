'use client';

interface FlightMapProps {
    departure: string;
    arrival: string;
    progress: number; // 0-100
}

export default function FlightMap({ departure, arrival, progress }: FlightMapProps) {
    // Calculate plane position along the arc
    const planeX = 50 + (progress / 100) * 200;
    const planeY = 100 - Math.sin((progress / 100) * Math.PI) * 40;

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <svg width="100%" height="150" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet">
                {/* Flight path arc */}
                <path
                    d="M 50 100 Q 150 40, 250 100"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />

                {/* Completed path */}
                <path
                    d={`M 50 100 Q 150 40, ${planeX} ${planeY}`}
                    fill="none"
                    stroke="var(--aa-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Departure pin */}
                <g>
                    <circle cx="50" cy="100" r="8" fill="var(--aa-primary)" />
                    <text
                        x="50"
                        y="125"
                        textAnchor="middle"
                        fill="var(--foreground)"
                        fontSize="12"
                        fontWeight="600"
                    >
                        {departure}
                    </text>
                </g>

                {/* Arrival pin */}
                <g>
                    <circle cx="250" cy="100" r="8" fill="var(--success)" />
                    <text
                        x="250"
                        y="125"
                        textAnchor="middle"
                        fill="var(--foreground)"
                        fontSize="12"
                        fontWeight="600"
                    >
                        {arrival}
                    </text>
                </g>

                {/* Plane icon */}
                <g transform={`translate(${planeX}, ${planeY})`}>
                    <circle r="6" fill="var(--card)" stroke="var(--aa-primary)" strokeWidth="2" />
                    <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="10"
                    >
                        ✈️
                    </text>
                </g>
            </svg>
        </div>
    );
}
