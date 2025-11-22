import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const flight = searchParams.get('flight') || 'AA100';
        const status = searchParams.get('status') || 'On Time';
        const from = searchParams.get('from') || 'JFK';
        const to = searchParams.get('to') || 'LHR';

        return new ImageResponse(
            (
                <div
                    style= {{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0078D2 0%, #005A9E 100%)',
            color: 'white',
            fontFamily: 'system-ui, sans-serif',
            padding: '60px',
        }}
                >
        <div style={ { fontSize: 72, fontWeight: 'bold', marginBottom: 20 } }>
                        ✈️ { flight }
    </div>
        < div style = {{ fontSize: 48, marginBottom: 40, opacity: 0.9 }
}>
    { from } → { to }
</div>
    < div
style = {{
    fontSize: 36,
        padding: '20px 40px',
            background: status.toLowerCase().includes('on time')
                ? 'rgba(22, 163, 74, 0.3)'
                : status.toLowerCase().includes('delayed')
                    ? 'rgba(255, 190, 0, 0.3)'
                    : 'rgba(220, 38, 38, 0.3)',
                borderRadius: 20,
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                        }}
                    >
    { status }
    </div>
    < div style = {{ fontSize: 24, marginTop: 40, opacity: 0.7 }}>
        Track this flight on FlightTracker
            </div>
            </div>
            ),
{
    width: 1200,
        height: 630,
            }
        );
    } catch (error) {
    console.error('Share image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
}
}
