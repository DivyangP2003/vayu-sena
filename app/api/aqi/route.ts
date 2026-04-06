import { NextRequest, NextResponse } from 'next/server';
import { generateAllCitiesAQI, generateMockAQI } from '@/lib/mockData';
import { getAQICategory, INDIA_CITIES } from '@/lib/types';

async function fetchOpenAQData(city: string) {
  const apiKey = process.env.OPENAQ_API_KEY;
  if (!apiKey || apiKey === 'your_openaq_api_key_here') return null;

  try {
    const cityCoords = INDIA_CITIES.find(c => c.name.toLowerCase() === city.toLowerCase());
    if (!cityCoords) return null;

    const url = `https://api.openaq.org/v3/locations?coordinates=${cityCoords.lat},${cityCoords.lng}&radius=25000&limit=5&order_by=lastUpdated&sort=desc`;
    const res = await fetch(url, {
      headers: { 'X-API-Key': apiKey },
      next: { revalidate: 900 }, // 15 min cache
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results?.length) return null;

    const location = data.results[0];
    const measurements = location.sensors || [];
    const pm25 = measurements.find((s: { parameter: { name: string } }) => s.parameter?.name === 'pm25');
    const pm10 = measurements.find((s: { parameter: { name: string } }) => s.parameter?.name === 'pm10');
    const no2 = measurements.find((s: { parameter: { name: string } }) => s.parameter?.name === 'no2');

    const aqiValue = pm25?.summary?.avg
      ? Math.round(pm25.summary.avg * 2.5) // rough conversion
      : generateMockAQI(city).aqi;

    return {
      city,
      state: cityCoords.state,
      station: location.name || `${city} Station`,
      lat: cityCoords.lat,
      lng: cityCoords.lng,
      aqi: aqiValue,
      category: getAQICategory(aqiValue),
      pm25: pm25?.summary?.avg ? Math.round(pm25.summary.avg) : generateMockAQI(city).pm25,
      pm10: pm10?.summary?.avg ? Math.round(pm10.summary.avg) : generateMockAQI(city).pm10,
      no2: no2?.summary?.avg ? Math.round(no2.summary.avg) : generateMockAQI(city).no2,
      so2: generateMockAQI(city).so2,
      co: generateMockAQI(city).co,
      o3: generateMockAQI(city).o3,
      timestamp: new Date().toISOString(),
      trend: 'stable' as const,
      dominantSource: 'Vehicle Traffic',
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  try {
    if (city) {
      // Try real API first
      const realData = await fetchOpenAQData(city);
      if (realData) {
        return NextResponse.json({ data: realData, source: 'openaq' });
      }
      // Fallback to mock
      return NextResponse.json({ data: generateMockAQI(city), source: 'mock' });
    }

    // Return all cities
    const allData = generateAllCitiesAQI();
    return NextResponse.json({ data: allData, source: 'mock', count: allData.length });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch AQI data', details: String(error) },
      { status: 500 }
    );
  }
}
