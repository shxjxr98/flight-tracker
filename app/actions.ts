'use server';

export interface Flight {
    flightNumber: string;
    airline: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    timeZone: string;
    status: 'On Time' | 'Delayed' | 'Cancelled';
}

export async function searchFlights(query: string): Promise<Flight[]> {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    if (!apiKey) {
        throw new Error('API key not configured');
    }

    // AviationStack expects flight_iata (e.g. AA123)
    const response = await fetch(
        `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${query}`,
        { cache: 'no-store' }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch flight data');
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
        return [];
    }

    // Map the first result to our Flight interface
    // Note: AviationStack returns an array of flights. We'll map all valid ones.
    return data.data.map((flight: any) => {
        const status = mapStatus(flight.flight_status);

        return {
            flightNumber: flight.flight.iata,
            airline: flight.airline.name,
            startTime: flight.departure.scheduled,
            endTime: flight.arrival.scheduled,
            startLocation: `${flight.departure.airport} (${flight.departure.iata})`,
            endLocation: `${flight.arrival.airport} (${flight.arrival.iata})`,
            timeZone: flight.departure.timezone || 'UTC', // API might not always return timezone code directly like 'EST'
            status: status,
        };
    });
}

function mapStatus(apiStatus: string): 'On Time' | 'Delayed' | 'Cancelled' {
    switch (apiStatus) {
        case 'active':
        case 'scheduled':
        case 'landed':
            return 'On Time';
        case 'delayed':
            return 'Delayed';
        case 'cancelled':
            return 'Cancelled';
        default:
            return 'On Time';
    }
}
