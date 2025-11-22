import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

interface WeatherData {
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy';
    windSpeed: number;
    city: string;
}

interface WeatherCardProps {
    data: WeatherData;
    type: 'departure' | 'arrival';
}

export default function WeatherCard({ data, type }: WeatherCardProps) {
    const getIcon = (condition: string) => {
        switch (condition) {
            case 'rainy': return <CloudRain className="w-8 h-8 text-blue-400" />;
            case 'cloudy': return <Cloud className="w-8 h-8 text-gray-400" />;
            default: return <Sun className="w-8 h-8 text-yellow-400" />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col gap-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {type === 'departure' ? 'Departure Weather' : 'Arrival Weather'}
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{data.city}</h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {data.temperature}°C
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {getIcon(data.condition)}
                    <div className="flex items-center text-xs text-gray-500">
                        <Wind className="w-3 h-3 mr-1" />
                        {data.windSpeed} km/h
                    </div>
                </div>
            </div>
        </div>
    );
}
