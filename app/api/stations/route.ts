/**
 * /api/stations — Full CPCB station registry
 *
 * GET /api/stations           → all stations with AQI (paginated)
 * GET /api/stations?page=2    → page 2 (50 per page for UI)
 * GET /api/stations?city=Delhi
 * GET /api/stations?state=Maharashtra
 * GET /api/stations?search=Anand+Vihar
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchAllCPCBStations } from '@/lib/cpcbFetcher';
import { generateAllCitiesAQI } from '@/lib/mockData';

export const runtime = 'nodejs';
export const revalidate = 900;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page    = parseInt(searchParams.get('page') || '1');
  const city    = searchParams.get('city')?.toLowerCase();
  const state   = searchParams.get('state')?.toLowerCase();
  const search  = searchParams.get('search')?.toLowerCase();
  const PER_PAGE = 50;

  try {
    const { stations, source, error } = await fetchAllCPCBStations();

    if (source === 'error' || stations.length === 0) {
      return NextResponse.json({
        stations: generateAllCitiesAQI().map(c => ({
          station: c.station, city: c.city, state: c.state,
          lat: c.lat, lng: c.lng, aqi: c.aqi, category: c.category,
          pm25: c.pm25, pm10: c.pm10, no2: c.no2, so2: c.so2,
          co: c.co, o3: c.o3, nh3: 0,
          lastUpdate: c.timestamp, dominantPollutant: 'PM2.5',
          dominantSource: c.dominantSource,
          distanceKm: 0,
        })),
        source: 'mock_fallback',
        error,
      });
    }

    let filtered = stations;
    if (city)   filtered = filtered.filter(s => s.city.toLowerCase().includes(city));
    if (state)  filtered = filtered.filter(s => s.state.toLowerCase().includes(state));
    if (search) filtered = filtered.filter(s =>
      s.station.toLowerCase().includes(search) ||
      s.city.toLowerCase().includes(search) ||
      s.state.toLowerCase().includes(search)
    );

    const total = filtered.length;
    const start = (page - 1) * PER_PAGE;
    const pageData = filtered.slice(start, start + PER_PAGE);

    // Build unique states and cities for filter UI
    const uniqueStates = [...new Set(stations.map(s => s.state))].sort();
    const uniqueCities = [...new Set(stations.map(s => s.city))].sort();

    return NextResponse.json({
      stations: pageData,
      source: 'live_cpcb',
      pagination: {
        page, perPage: PER_PAGE,
        total, totalPages: Math.ceil(total / PER_PAGE),
        hasNext: start + PER_PAGE < total,
        hasPrev: page > 1,
      },
      meta: {
        totalStations: stations.length,
        states: uniqueStates,
        citiesCount: uniqueCities.length,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
