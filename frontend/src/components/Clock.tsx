import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';

export const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const { use24HourFormat } = useWeather();

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    if (use24HourFormat) {
      return date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="text-center mb-6">
      <h2 className="text-5xl font-bold text-gray-800 tracking-tight mb-2">
        {formatTime(date)}
      </h2>
      <p className="text-lg text-gray-600">
        {formatDate(date)}
      </p>
      <button 
        className="mt-2 text-sm text-blue-500 hover:text-blue-700 transition-colors"
        onClick={() => {}}
      >
        {use24HourFormat ? '12-hour format' : '24-hour format'}
      </button>
    </div>
  );
};