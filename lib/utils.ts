import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AQICategory, AQI_LEVELS } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAQI(aqi: number): string {
  return Math.round(aqi).toString();
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function timeAgo(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getHealthTip(category: AQICategory): string {
  const tips: Record<AQICategory, string> = {
    good: 'Great day for outdoor activities. Open your windows to ventilate your home.',
    satisfactory: 'Mostly good. Sensitive individuals may want to limit prolonged exertion outdoors.',
    moderate: 'Consider wearing N95 mask outdoors. Avoid rush-hour commutes if possible.',
    poor: 'Wear N95 mask. Keep windows closed. Avoid outdoor exercise.',
    very_poor: 'Stay indoors. Use air purifier. Seek medical attention if experiencing symptoms.',
    severe: 'Emergency conditions. Do not go outdoors. Seal windows and doors.',
  };
  return tips[category];
}

export function getPM25Category(pm25: number): string {
  if (pm25 < 12) return 'Good (WHO guideline met)';
  if (pm25 < 35) return 'Moderate';
  if (pm25 < 55) return 'Unhealthy for Sensitive Groups';
  if (pm25 < 150) return 'Unhealthy';
  if (pm25 < 250) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function interpolateColor(value: number, min: number, max: number, colorA: string, colorB: string): string {
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  return `color-mix(in srgb, ${colorB} ${Math.round(t * 100)}%, ${colorA})`;
}

export const AQI_GRADIENT_STOPS = [
  { aqi: 0, color: '#00ff88' },
  { aqi: 100, color: '#a8ff3e' },
  { aqi: 200, color: '#ffb800' },
  { aqi: 300, color: '#ff6b00' },
  { aqi: 400, color: '#ff4444' },
  { aqi: 500, color: '#cc00ff' },
];

export function aqiToGradientColor(aqi: number): string {
  const stops = AQI_GRADIENT_STOPS;
  for (let i = 0; i < stops.length - 1; i++) {
    if (aqi >= stops[i].aqi && aqi <= stops[i + 1].aqi) {
      const t = (aqi - stops[i].aqi) / (stops[i + 1].aqi - stops[i].aqi);
      return stops[i].color; // Simplified
    }
  }
  return stops[stops.length - 1].color;
}
