import React from 'react';
import { ForecastData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '../services/weatherService';
import { useWeather } from '../context/WeatherContext';
import { format } from 'date-fns';

interface ForecastItemProps {
  forecast: ForecastData;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isToday: boolean;
}

export const ForecastItem: React.FC<ForecastItemProps> = ({ 
  forecast, 
  index,
  isFirst,
  isLast,
  isToday
}) => {
  const { useCelsius } = useWeather();

  return (
    <div className={`forecast-item p-4 text-center ${isToday ? 'bg-gray-800/20' : ''}`}>
      <p className={`text-sm font-medium mb-2 ${isToday ? 'text-red-400' : 'text-gray-400'}`}>
        {format(new Date(forecast.timestamp), 'MMM d')}
      </p>
      
      <div className="flex justify-center mb-2">
        <WeatherIcon condition={forecast.condition} size={32} />
      </div>
      
      <p className="text-xl font-bold text-white">
        {formatTemperature(forecast.temperature, useCelsius)}
      </p>
      
      {forecast.precipitation > 0 && (
        <p className="text-xs text-blue-400 mt-1">
          {forecast.precipitation}% precip
        </p>
      )}
    </div>
  );
};