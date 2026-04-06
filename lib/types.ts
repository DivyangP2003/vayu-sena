// ============================================================
// VAYU SAINIK — Types & Constants
// ============================================================

export type AQICategory =
  | 'good'
  | 'satisfactory'
  | 'moderate'
  | 'poor'
  | 'very_poor'
  | 'severe';

export interface AQIData {
  city: string;
  state: string;
  station: string;
  lat: number;
  lng: number;
  aqi: number;
  category: AQICategory;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  timestamp: string;
  trend: 'improving' | 'worsening' | 'stable';
  dominantSource: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  windDir: string;
  description: string;
  visibility: number;
}

export interface CitizenReport {
  id: string;
  lat: number;
  lng: number;
  city: string;
  description: string;
  sourceType: 'traffic' | 'construction' | 'burning' | 'industrial' | 'dust' | 'other';
  severity: 1 | 2 | 3 | 4 | 5;
  imageUrl?: string;
  estimatedPM25?: number;
  timestamp: string;
  upvotes: number;
  status: 'pending' | 'verified' | 'resolved';
}

export interface FlashNote {
  id: string;
  title: string;
  content: string;
  city: string;
  category: 'health' | 'source' | 'forecast' | 'alert' | 'tip';
  generatedAt: string;
  aqiContext: number;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: 'policy' | 'research' | 'alert' | 'general';
}

export const INDIA_CITIES: { name: string; state: string; lat: number; lng: number }[] = [
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178 },
];

export const AQI_LEVELS: Record<AQICategory, {
  label: string;
  color: string;
  bg: string;
  border: string;
  range: string;
  health: string;
  icon: string;
}> = {
  good: {
    label: 'Good',
    color: '#00ff88',
    bg: 'rgba(0,255,136,0.1)',
    border: 'rgba(0,255,136,0.3)',
    range: '0–50',
    health: 'Air quality is satisfactory. Minimal risk.',
    icon: '✓',
  },
  satisfactory: {
    label: 'Satisfactory',
    color: '#a8ff3e',
    bg: 'rgba(168,255,62,0.1)',
    border: 'rgba(168,255,62,0.3)',
    range: '51–100',
    health: 'Acceptable. Sensitive groups may experience minor issues.',
    icon: '↗',
  },
  moderate: {
    label: 'Moderate',
    color: '#ffb800',
    bg: 'rgba(255,184,0,0.1)',
    border: 'rgba(255,184,0,0.3)',
    range: '101–200',
    health: 'Children, elderly & those with respiratory issues should limit outdoor activity.',
    icon: '⚠',
  },
  poor: {
    label: 'Poor',
    color: '#ff6b00',
    bg: 'rgba(255,107,0,0.1)',
    border: 'rgba(255,107,0,0.3)',
    range: '201–300',
    health: 'Everyone may experience health effects. Avoid prolonged outdoor exposure.',
    icon: '!',
  },
  very_poor: {
    label: 'Very Poor',
    color: '#ff4444',
    bg: 'rgba(255,68,68,0.1)',
    border: 'rgba(255,68,68,0.3)',
    range: '301–400',
    health: 'Health alert — everyone may experience serious health effects.',
    icon: '✕',
  },
  severe: {
    label: 'Severe',
    color: '#cc00ff',
    bg: 'rgba(204,0,255,0.1)',
    border: 'rgba(204,0,255,0.3)',
    range: '400+',
    health: 'Emergency conditions. Avoid all outdoor activity.',
    icon: '☠',
  },
};

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'satisfactory';
  if (aqi <= 200) return 'moderate';
  if (aqi <= 300) return 'poor';
  if (aqi <= 400) return 'very_poor';
  return 'severe';
}

export function getAQIColor(aqi: number): string {
  return AQI_LEVELS[getAQICategory(aqi)].color;
}

export const SOURCE_TYPES = {
  traffic: { label: 'Vehicle Traffic', icon: '🚗', color: '#ff6b00' },
  construction: { label: 'Construction Dust', icon: '🏗️', color: '#ffb800' },
  burning: { label: 'Biomass/Stubble Burning', icon: '🔥', color: '#ff4444' },
  industrial: { label: 'Industrial Emissions', icon: '🏭', color: '#cc00ff' },
  dust: { label: 'Road/Soil Dust', icon: '💨', color: '#a8ff3e' },
  other: { label: 'Other / Unknown', icon: '❓', color: '#7ab898' },
};
