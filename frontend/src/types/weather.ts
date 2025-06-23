export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  timestamp: number;
}

export interface ForecastData {
  timestamp: number;
  temperature: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export type WeatherCondition = 
  | 'clear'
  | 'cloudy'
  | 'partlyCloudy'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'fog'
  | 'drizzle';