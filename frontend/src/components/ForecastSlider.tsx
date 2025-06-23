import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { ForecastItem } from './ForecastItem';
import { format, addDays, subDays } from 'date-fns';

export const ForecastSlider: React.FC = () => {
  const { forecast, isLoading } = useWeather();
  const [currentIndex, setCurrentIndex] = useState(3); // Start at center (day 3 of 7)
  const containerRef = useRef<HTMLDivElement>(null);

  const totalDays = 7; // Total days to show
  const pastDays = 3; // Days to show in the past
  const futureDays = 3; // Days to show in the future
  const maxIndex = totalDays - 1;

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center bg-black">
        <div className="animate-pulse h-full w-full bg-gray-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="forecast-section">
      <h3 className="text-lg font-medium text-white mb-3">Weather Timeline</h3>
      
      <div className="relative">
        <div ref={containerRef} className="forecast-container">
          {Array.from({ length: totalDays }).map((_, idx) => {
            const date = subDays(new Date(), pastDays - idx);
            const isToday = idx === pastDays;
            return (
              <ForecastItem
                key={idx}
                forecast={{
                  ...forecast[idx % forecast.length],
                  timestamp: date.getTime()
                }}
                index={idx}
                isFirst={idx === 0}
                isLast={idx === totalDays - 1}
                isToday={isToday}
              />
            );
          })}
          <div 
            className="today-marker"
            style={{ left: `${(pastDays / totalDays) * 100}%` }}
          ></div>
        </div>
        
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/80 p-1 rounded-r-lg disabled:opacity-50"
        >
          <ChevronLeft className="text-white" />
        </button>
        
        <button 
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/80 p-1 rounded-l-lg disabled:opacity-50"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
      
      <div className="time-ruler">
        {Array.from({ length: totalDays }).map((_, idx) => {
          const date = subDays(new Date(), pastDays - idx);
          const isToday = idx === pastDays;
          return (
            <div key={idx} className={`time-mark ${isToday ? 'today' : ''}`}>
              <span className="time-label">
                {format(date, 'MMM d')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};