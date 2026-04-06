/**
 * /api/aqi — Real-time CPCB CAAQMS data
 *
 * GET /api/aqi              → all 500+ stations, live
 * GET /api/aqi?city=Delhi   → stations for a specific city
 * GET /api/aqi?state=Delhi  → stations for a state
 * GET /api/aqi?lat=28.6&lng=77.2&radius=50 → stations near coords
 *
 * Data source: data.gov.in CPCB resource 3b01bcb8-...
 * Revalidates every 15 minutes (CPCB updates hourly).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAllCPCBStations,
  fetchCityStations,
  findNearestStations,
} from '@/lib/cpcbFetcher';
import { generateAllCitiesAQI, generateMockAQI } from '@/lib/mockData';

export const runtime = 'nodejs';
export const revalidate = 900; // 15 min ISR

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city    = searchParams.get('city');
  const state   = searchParams.get('state');
  const lat     = searchParams.get('lat');
  const lng     = searchParams.get('lng');
  const mock    = searchParams.get('mock') === '1';

  // Allow forcing mock for dev
  if (mock) {
    if (city) {
      return NextResponse.json({ data: [generateMockAQI(city)], source: 'mock', count: 1 });
    }
    const all = generateAllCitiesAQI();
    return NextResponse.json({ data: all, source: 'mock', count: all.length });
  }

  try {
    // ── Nearest stations by coordinates ──────────────────────────────────
    if (lat && lng) {
      const { stations, source, error } = await fetchAllCPCBStations();
      if (source === 'error' || stations.length === 0) {
        return NextResponse.json({
          error: 'Could not fetch live data',
          details: error,
          fallback: 'Use ?mock=1 to get synthetic data',
        }, { status: 503 });
      }
      const nearest = findNearestStations(parseFloat(lat), parseFloat(lng), stations, 10);
      return NextResponse.json({
        data: nearest,
        source: 'live_cpcb',
        count: nearest.length,
        queryType: 'nearest',
      });
    }

    // ── Specific city ─────────────────────────────────────────────────────
    if (city) {
      const stations = await fetchCityStations(city);
      if (stations.length === 0) {
        // Fallback to mock if city not found in CPCB
        return NextResponse.json({
          data: [generateMockAQI(city)],
          source: 'mock_fallback',
          count: 1,
          note: 'No live station found for this city — showing estimated data',
        });
      }
      return NextResponse.json({
        data: stations,
        source: 'live_cpcb',
        count: stations.length,
        queryType: 'city',
      });
    }

    // ── All stations ──────────────────────────────────────────────────────
    const { stations, totalFetched, source, error } = await fetchAllCPCBStations();

    if (source === 'error' || stations.length === 0) {
      // Graceful fallback to mock
      const mockData = generateAllCitiesAQI();
      return NextResponse.json({
        data: mockData,
        source: 'mock_fallback',
        count: mockData.length,
        note: `Live data unavailable (${error || 'unknown error'}) — showing estimated data`,
      });
    }

    // Filter by state if requested
    const filtered = state
      ? stations.filter(s => s.state.toLowerCase().includes(state.toLowerCase()))
      : stations;

    return NextResponse.json({
      data: filtered,
      source: 'live_cpcb',
      count: filtered.length,
      totalRecords: totalFetched,
      queryType: state ? 'state' : 'all',
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    const mockData = generateAllCitiesAQI();
    return NextResponse.json({
      data: mockData,
      source: 'mock_fallback',
      count: mockData.length,
      error: String(err),
    });
  }
}
