import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const airport = searchParams.get('airport') || 'jfk';

        // Map of airport codes to terminal map URLs
        const terminalMaps: Record<string, string> = {
            'jfk': 'https://www.jfkairport.com/map',
            'lhr': 'https://www.heathrow.com/airport-guide/terminal-maps',
            'lax': 'https://www.flylax.com/lax-airport-maps',
            'ord': 'https://www.flychicago.com/ohare/maps',
            'dfw': 'https://www.dfwairport.com/map/',
            'atl': 'https://www.atl.com/maps/',
            'den': 'https://www.flydenver.com/maps',
            'sfo': 'https://www.flysfo.com/maps-directions',
        };

        const mapUrl = terminalMaps[airport.toLowerCase()] || 'https://www.google.com/maps';

        return Response.redirect(mapUrl, 302);
    } catch (error) {
        console.error('Terminal map redirect error:', error);
        return Response.redirect('https://www.google.com/maps', 302);
    }
}
