import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { flight, email } = await req.json();

        if (!email || !flight) {
            return Response.json({ error: 'Email and flight required' }, { status: 400 });
        }

        // For now, we'll simulate the alert subscription
        // In production, you would:
        // 1. Send email via Resend
        // 2. Store subscription in Vercel KV or Upstash Redis
        // 3. Set up push notifications

        console.log(`Alert subscription for ${email} on flight ${flight}`);

        // Simulate success response
        return Response.json({
            ok: true,
            message: `Alert subscription confirmed for ${flight}. You'll receive updates at ${email}.`
        });

    } catch (error) {
        console.error('Alert subscription error:', error);
        return Response.json({ error: 'Failed to subscribe to alerts' }, { status: 500 });
    }
}
