import { NextRequest } from 'next/server';
import ics from 'ics';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const flight = searchParams.get('flight') || 'AA100';
        const from = searchParams.get('from') || 'JFK';
        const to = searchParams.get('to') || 'LHR';
        const departureDate = searchParams.get('departure') || '2025-11-22T14:20:00';
        const arrivalDate = searchParams.get('arrival') || '2025-11-23T02:25:00';

        // Parse dates
        const depDate = new Date(departureDate);
        const arrDate = new Date(arrivalDate);

        // Calculate duration
        const durationMs = arrDate.getTime() - depDate.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        const event: ics.EventAttributes = {
            start: [
                depDate.getFullYear(),
                depDate.getMonth() + 1,
                depDate.getDate(),
                depDate.getHours(),
                depDate.getMinutes(),
            ],
            duration: { hours, minutes },
            title: `${flight} ${from} → ${to}`,
            description: `Flight ${flight} from ${from} to ${to}`,
            location: `${from} Airport`,
            url: `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}?flight=${flight}`,
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
        };

        const { error, value } = ics.createEvent(event);

        if (error || !value) {
            console.error('iCal generation error:', error);
            return new Response('Failed to generate calendar event', { status: 500 });
        }

        return new Response(value, {
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': `attachment; filename="${flight}.ics"`,
            },
        });
    } catch (error) {
        console.error('iCal route error:', error);
        return new Response('Failed to generate calendar file', { status: 500 });
    }
}
