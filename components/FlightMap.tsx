'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface FlightMapProps {
    latitude: number;
    longitude: number;
    flightNumber: string;
}

export default function FlightMap({ latitude, longitude, flightNumber }: FlightMapProps) {
    return (
        <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
            <MapContainer
                center={[latitude, longitude]}
                zoom={6}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        Flight {flightNumber} is here.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
