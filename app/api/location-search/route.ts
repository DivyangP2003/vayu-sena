/**
 * /api/location-search — Location-based AQI analysis
 *
 * POST { query: "Lajpat Nagar, Delhi" }
 * or
 * GET  /api/location-search?q=Anand+Vihar&lat=28.6&lng=77.3
 *
 * Returns:
 *  - Geocoded location
 *  - Nearest CPCB stations (up to 10, within 100km)
 *  - Interpolated AQI at the exact point
 *  - Health advisory
 *  - Dominant source
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  geocodeLocation,
  fetchAllCPCBStations,
  findNearestStations,
} from '@/lib/cpcbFetcher';
import { generateMockAQI } from '@/lib/mockData';
import { getAQICategory, AQI_LEVELS } from '@/lib/types';

export const runtime = 'nodejs';

// Inverse-distance weighted interpolation of AQI at a point
function idwInterpolate(
  lat: number, lng: number,
  stations: (ReturnType<typeof findNearestStations>[number])[]
): number {
  if (stations.length === 0) return 0;
  if (stations[0].distanceKm < 1) return stations[0].aqi; // on top of a station

  let weightedSum = 0;
  let totalWeight = 0;
  for (const s of stations.slice(0, 5)) {
    const w = 1 / Math.max(0.1, s.distanceKm ** 2);
    weightedSum += s.aqi * w;
    totalWeight += w;
  }
  return Math.round(weightedSum / totalWeight);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  if (!query && (!latParam || !lngParam)) {
    return NextResponse.json({ error: 'Provide ?q=location or ?lat=&lng=' }, { status: 400 });
  }

  return handleSearch(query, latParam ? parseFloat(latParam) : undefined, lngParam ? parseFloat(lngParam) : undefined);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const query: string = body.query || body.q || '';
  const lat: number | undefined = body.lat;
  const lng: number | undefined = body.lng;

  if (!query && (!lat || !lng)) {
    return NextResponse.json({ error: 'Provide query or lat/lng' }, { status: 400 });
  }

  return handleSearch(query || null, lat, lng);
}

async function handleSearch(query: string | null, lat?: number, lng?: number) {
  try {
    let resolvedLat = lat;
    let resolvedLng = lng;
    let locationName = query || `${lat?.toFixed(3)}, ${lng?.toFixed(3)}`;
    let city: string | undefined;
    let state: string | undefined;

    // Step 1: Geocode if no coords provided
    if (!resolvedLat || !resolvedLng) {
      if (!query) {
        return NextResponse.json({ error: 'No location provided' }, { status: 400 });
      }
      const geo = await geocodeLocation(query);
      if (!geo) {
        return NextResponse.json({
          error: `Could not find location: "${query}". Try a more specific query like "Connaught Place, Delhi"`,
          suggestions: [
            'Try adding city name (e.g. "Bandra, Mumbai")',
            'Use a landmark or area name',
            'Try the district or tehsil name',
          ],
        }, { status: 404 });
      }
      resolvedLat = geo.lat;
      resolvedLng = geo.lng;
      locationName = geo.displayName;
      city = geo.city;
      state = geo.state;
    }

    // Step 2: Fetch all live stations
    const { stations, source } = await fetchAllCPCBStations();

    // Step 3: Find nearest stations
    const nearest = findNearestStations(resolvedLat!, resolvedLng!, stations, 10);

    // Step 4: Interpolate AQI at the exact point
    const interpolatedAQI = nearest.length > 0
      ? idwInterpolate(resolvedLat!, resolvedLng!, nearest)
      : (city ? generateMockAQI(city).aqi : 150);

    const category = getAQICategory(interpolatedAQI);
    const level = AQI_LEVELS[category];

    // Step 5: Dominant source from nearest station
    const dominantSource = nearest[0]?.dominantSource ?? 'Vehicle Traffic';
    const dominantPollutant = nearest[0]?.dominantPollutant ?? 'PM2.5';

    // Step 6: Average pollutants from nearest stations (weighted)
    let avgPM25 = 0, avgPM10 = 0, avgNO2 = 0;
    if (nearest.length > 0) {
      const weights = nearest.slice(0, 5).map(s => 1 / Math.max(0.1, s.distanceKm));
      const wSum = weights.reduce((a, b) => a + b, 0);
      nearest.slice(0, 5).forEach((s, i) => {
        avgPM25 += (s.pm25 * weights[i]) / wSum;
        avgPM10 += (s.pm10 * weights[i]) / wSum;
        avgNO2  += (s.no2  * weights[i]) / wSum;
      });
    }

    return NextResponse.json({
      location: {
        query,
        displayName: locationName,
        lat: resolvedLat,
        lng: resolvedLng,
        city,
        state,
      },
      aqi: {
        value: interpolatedAQI,
        category,
        label: level.label,
        color: level.color,
        health: level.health,
        interpolationMethod: nearest.length > 0 ? 'IDW from live CPCB stations' : 'Estimated',
      },
      pollutants: {
        pm25: Math.round(avgPM25),
        pm10: Math.round(avgPM10),
        no2:  Math.round(avgNO2),
        dominantPollutant,
      },
      dominantSource,
      nearestStations: nearest.slice(0, 5).map(s => ({
        name: s.station,
        city: s.city,
        state: s.state,
        lat: s.lat,
        lng: s.lng,
        aqi: s.aqi,
        category: s.category,
        distanceKm: Math.round(s.distanceKm * 10) / 10,
        lastUpdate: s.lastUpdate,
      })),
      dataSource: source === 'live' ? 'live_cpcb' : 'estimated',
      stationsUsed: nearest.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Search failed', details: String(err) }, { status: 500 });
  }
}

