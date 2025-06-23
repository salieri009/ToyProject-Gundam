import React from 'react';
import { Cloud, Droplets, Wind, MapPin, Thermometer } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { formatTemperature } from '../services/weatherService';
import { WeatherIcon } from './WeatherIcon';

export const WeatherDisplay: React.FC = () => {
  const { currentWeather, isLoading, error, location, useCelsius, toggleTemperatureUnit } = useWeather();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !currentWeather) {
    return (
      <div className="text-center p-4 bg-red-900 rounded-lg text-red-100">
        {error || 'Unable to load weather data. Please try again.'}
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl p-6 mb-6 border border-gray-800">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-4">
            <WeatherIcon condition={currentWeather.condition} size={64} />
          </div>
          <div>
            <div className="flex items-center">
              <MapPin size={16} className="text-gray-400 mr-1" />
              <h3 className="text-lg font-medium text-gray-300">{currentWeather.location}</h3>
            </div>
            <h2 className="text-4xl font-bold text-white mt-1">
              {formatTemperature(currentWeather.temperature, useCelsius)}
            </h2>
            <p className="text-lg text-gray-300 capitalize">
              {currentWeather.condition.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <button 
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors mt-1"
              onClick={toggleTemperatureUnit}
            >
              Switch to {useCelsius ? '°F' : '°C'}
            </button>
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex items-center">
            <Droplets size={20} className="text-blue-400 mr-2" />
            <div>
              <p className="text-sm text-gray-400">Humidity</p>
              <p className="text-lg font-medium text-gray-300">{currentWeather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center">
            <Wind size={20} className="text-blue-400 mr-2" />
            <div>
              <p className="text-sm text-gray-400">Wind</p>
              <p className="text-lg font-medium text-gray-300">{currentWeather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};