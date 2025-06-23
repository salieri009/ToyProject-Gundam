import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudSun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  CloudDrizzle,
  HelpCircle
} from 'lucide-react';
import { WeatherCondition } from '../types/weather';

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 24, 
  className = ''
}) => {
  const getIcon = () => {
    switch (condition as WeatherCondition) {
      case 'clear':
        return <Sun size={size} className={`text-yellow-500 ${className}`} />;
      case 'cloudy':
        return <Cloud size={size} className={`text-gray-500 ${className}`} />;
      case 'partlyCloudy':
        return <CloudSun size={size} className={`text-gray-400 ${className}`} />;
      case 'rain':
        return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
      case 'snow':
        return <CloudSnow size={size} className={`text-blue-200 ${className}`} />;
      case 'thunderstorm':
        return <CloudLightning size={size} className={`text-purple-500 ${className}`} />;
      case 'fog':
        return <CloudFog size={size} className={`text-gray-400 ${className}`} />;
      case 'drizzle':
        return <CloudDrizzle size={size} className={`text-blue-300 ${className}`} />;
      default:
        return <HelpCircle size={size} className={`text-gray-500 ${className}`} />;
    }
  };

  return getIcon();
};