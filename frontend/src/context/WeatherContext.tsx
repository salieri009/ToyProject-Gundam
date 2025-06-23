import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchWeatherData, fetchForecastData } from '../services/weatherService';
import { WeatherData, ForecastData } from '../types/weather';

interface WeatherContextType {
  location: string;
  setLocation: (location: string) => void;
  currentWeather: WeatherData | null;
  forecast: ForecastData[];
  isLoading: boolean;
  error: string | null;
  useCelsius: boolean;
  toggleTemperatureUnit: () => void;
  use24HourFormat: boolean;
  toggleTimeFormat: () => void;
  refreshWeather: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<string>('Seoul');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useCelsius, setUseCelsius] = useState<boolean>(true);
  const [use24HourFormat, setUse24HourFormat] = useState<boolean>(true);

  const toggleTemperatureUnit = () => setUseCelsius(!useCelsius);
  const toggleTimeFormat = () => setUse24HourFormat(!use24HourFormat);

  const refreshWeather = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherData(location);
      setCurrentWeather(weatherData);
      
      const forecastData = await fetchForecastData(location);
      setForecast(forecastData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWeather();
  }, [location]);

  const value = {
    location,
    setLocation,
    currentWeather,
    forecast,
    isLoading,
    error,
    useCelsius,
    toggleTemperatureUnit,
    use24HourFormat,
    toggleTimeFormat,
    refreshWeather
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};