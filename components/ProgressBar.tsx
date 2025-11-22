'use client';

interface ProgressBarProps {
    progress: number; // 0-100
    status: string;
}

export default function ProgressBar({ progress, status }: ProgressBarProps) {
    const getColor = () => {
        if (status === 'cancelled') return '#DC2626';
        if (status === 'delayed') return '#FFBE00';
        return '#0078D2';
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--muted-foreground)',
            }}>
                <span>Flight Progress</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--muted)',
                borderRadius: '1rem',
                overflow: 'hidden',
                position: 'relative',
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: getColor(),
                    borderRadius: '1rem',
                    transition: 'width 0.5s ease',
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        background: getColor(),
                        borderRadius: '50%',
                        border: '2px solid var(--card)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }} />
                </div>
            </div>
        </div>
    );
}
