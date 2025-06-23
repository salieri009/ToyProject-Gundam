import { WeatherData, ForecastData, WeatherCondition } from '../types/weather';

// Since we're using mock data for now, we'll define some utility functions
const getRandomTemperature = (min = 0, max = 35) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomCondition = (): WeatherCondition => {
  const conditions: WeatherCondition[] = ['clear', 'cloudy', 'partlyCloudy', 'rain', 'snow', 'thunderstorm', 'fog', 'drizzle'];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

// This would normally be a real API call
export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data
  const condition = getRandomCondition();
  
  return {
    location,
    temperature: getRandomTemperature(),
    condition,
    icon: getWeatherIcon(condition),
    humidity: Math.floor(Math.random() * 100),
    windSpeed: Math.floor(Math.random() * 30),
    timestamp: Date.now()
  };
};

export const fetchForecastData = async (location: string): Promise<ForecastData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate 24 hours of forecast data (one entry per hour)
  const forecasts: ForecastData[] = [];
  const now = Date.now();
  
  for (let i = 0; i < 24; i++) {
    const condition = getRandomCondition();
    forecasts.push({
      timestamp: now + i * 60 * 60 * 1000, // Add i hours
      temperature: getRandomTemperature(),
      condition,
      icon: getWeatherIcon(condition),
      precipitation: Math.floor(Math.random() * 100)
    });
  }
  
  return forecasts;
};

// Map weather conditions to appropriate icons
export const getWeatherIcon = (condition: WeatherCondition): string => {
  switch (condition) {
    case 'clear':
      return 'sun';
    case 'cloudy':
      return 'cloud';
    case 'partlyCloudy':
      return 'cloud-sun';
    case 'rain':
      return 'cloud-rain';
    case 'snow':
      return 'cloud-snow';
    case 'thunderstorm':
      return 'cloud-lightning';
    case 'fog':
      return 'cloud-fog';
    case 'drizzle':
      return 'cloud-drizzle';
    default:
      return 'help-circle';
  }
};

// Format temperature according to preferred unit
export const formatTemperature = (temp: number, useCelsius = true): string => {
  if (useCelsius) {
    return `${Math.round(temp)}°C`;
  }
  // Convert to Fahrenheit
  const fahrenheit = (temp * 9/5) + 32;
  return `${Math.round(fahrenheit)}°F`;
};