'use server';

export interface Flight {
    flightNumber: string;
    airline: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    timeZone: string;
    status: 'On Time' | 'Delayed' | 'Cancelled' | 'Boarding' | 'Landed';
}

// Mock flight database for development/testing
const MOCK_FLIGHTS: Record<string, Flight> = {
    'AA100': {
        flightNumber: 'AA100',
        airline: 'American Airlines',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
        startLocation: 'John F. Kennedy International Airport (JFK)',
        endLocation: 'Los Angeles International Airport (LAX)',
        timeZone: 'EST',
        status: 'On Time',
    },
    'BA11': {
        flightNumber: 'BA11',
        airline: 'British Airways',
        startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
        startLocation: 'London Heathrow Airport (LHR)',
        endLocation: 'Singapore Changi Airport (SIN)',
        timeZone: 'GMT',
        status: 'Boarding',
    },
    'DL123': {
        flightNumber: 'DL123',
        airline: 'Delta Air Lines',
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        startLocation: 'Hartsfield-Jackson Atlanta International Airport (ATL)',
        endLocation: 'Miami International Airport (MIA)',
        timeZone: 'EST',
        status: 'Delayed',
    },
    'UA456': {
        flightNumber: 'UA456',
        airline: 'United Airlines',
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        startLocation: 'San Francisco International Airport (SFO)',
        endLocation: 'Tokyo Narita International Airport (NRT)',
        timeZone: 'PST',
        status: 'Landed',
    },
    'EK202': {
        flightNumber: 'EK202',
        airline: 'Emirates',
        startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 15 * 60 * 60 * 1000).toISOString(),
        startLocation: 'Dubai International Airport (DXB)',
        endLocation: 'New York John F. Kennedy International Airport (JFK)',
        timeZone: 'GST',
        status: 'On Time',
    },
};

export async function searchFlights(query: string): Promise<Flight[]> {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;

    // Normalize query (remove spaces, convert to uppercase)
    const normalizedQuery = query.trim().toUpperCase();

    // Try real API first if key exists
    if (apiKey) {
        try {
            const response = await fetch(
                `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${normalizedQuery}`,
                { cache: 'no-store' }
            );

            if (response.ok) {
                const data = await response.json();

                // Check for API errors (like rate limit)
                if (data.error) {
                    console.warn('API Error:', data.error.message);
                    // Fall through to mock data
                } else if (data.data && data.data.length > 0) {
                    // Return real API data
                    return data.data.map((flight: any) => ({
                        flightNumber: flight.flight.iata,
                        airline: flight.airline.name,
                        startTime: flight.departure.scheduled,
                        endTime: flight.arrival.scheduled,
                        startLocation: `${flight.departure.airport} (${flight.departure.iata})`,
                        endLocation: `${flight.arrival.airport} (${flight.arrival.iata})`,
                        timeZone: flight.departure.timezone || 'UTC',
                        status: mapStatus(flight.flight_status),
                    }));
                }
            }
        } catch (error) {
            console.warn('API request failed, using mock data:', error);
            // Fall through to mock data
        }
    }

    // Use mock data as fallback
    console.log('Using mock data for flight:', normalizedQuery);

    // Check if we have mock data for this flight
    if (MOCK_FLIGHTS[normalizedQuery]) {
        return [MOCK_FLIGHTS[normalizedQuery]];
    }

    // Return empty array if flight not found
    return [];
}

function mapStatus(apiStatus: string): 'On Time' | 'Delayed' | 'Cancelled' | 'Boarding' | 'Landed' {
    switch (apiStatus?.toLowerCase()) {
        case 'active':
        case 'scheduled':
            return 'On Time';
        case 'landed':
            return 'Landed';
        case 'delayed':
            return 'Delayed';
        case 'cancelled':
            return 'Cancelled';
        case 'boarding':
            return 'Boarding';
        default:
            return 'On Time';
    }
}
