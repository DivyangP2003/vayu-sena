import { NextRequest, NextResponse } from 'next/server';
import { generateAllCitiesAQI } from '@/lib/mockData';
import { AQI_LEVELS, getAQICategory } from '@/lib/types';

export async function GET(request: NextRequest) {
  const allCities = generateAllCitiesAQI();
  const alerts = allCities
    .filter(c => c.aqi > 200)
    .sort((a, b) => b.aqi - a.aqi)
    .slice(0, 5)
    .map(c => ({
      city: c.city,
      state: c.state,
      aqi: c.aqi,
      category: c.category,
      categoryLabel: AQI_LEVELS[c.category].label,
      color: AQI_LEVELS[c.category].color,
      message: `${c.city}: AQI ${c.aqi} — ${AQI_LEVELS[c.category].health}`,
      timestamp: c.timestamp,
    }));

  return NextResponse.json({ alerts, count: alerts.length });
}
