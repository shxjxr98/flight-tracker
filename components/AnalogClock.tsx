'use client';

interface AnalogClockProps {
    time: Date;
    label: string;
}

export default function AnalogClock({ time, label }: AnalogClockProps) {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = (hours * 30) + (minutes * 0.5);
    const minuteAngle = minutes * 6;
    const secondAngle = seconds * 6;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
                {label}
            </div>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' }}>
                {/* Clock face */}
                <circle cx="60" cy="60" r="58" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />

                {/* Hour markers */}
                {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const x1 = 60 + 48 * Math.cos(angle);
                    const y1 = 60 + 48 * Math.sin(angle);
                    const x2 = 60 + 52 * Math.cos(angle);
                    const y2 = 60 + 52 * Math.sin(angle);
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="var(--muted-foreground)"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* Hour hand */}
                <line
                    x1="60"
                    y1="60"
                    x2={60 + 30 * Math.sin(hourAngle * Math.PI / 180)}
                    y2={60 - 30 * Math.cos(hourAngle * Math.PI / 180)}
                    stroke="var(--foreground)"
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Minute hand */}
                <line
                    x1="60"
                    y1="60"
                    x2={60 + 40 * Math.sin(minuteAngle * Math.PI / 180)}
                    y2={60 - 40 * Math.cos(minuteAngle * Math.PI / 180)}
                    stroke="var(--aa-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Second hand */}
                <line
                    x1="60"
                    y1="60"
                    x2={60 + 45 * Math.sin(secondAngle * Math.PI / 180)}
                    y2={60 - 45 * Math.cos(secondAngle * Math.PI / 180)}
                    stroke="var(--destructive)"
                    strokeWidth="1"
                    strokeLinecap="round"
                />

                {/* Center dot */}
                <circle cx="60" cy="60" r="4" fill="var(--foreground)" />
            </svg>
        </div>
    );
}
