/**
 * CPCB Real-Time Data Fetcher
 * ─────────────────────────────────────────────────────────────────────────
 * Uses data.gov.in CPCB API (resource: 3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69)
 * This is the official Government of India open API — FREE, no auth needed
 * with the public demo key, or register at data.gov.in for your own key.
 *
 * Endpoint returns ALL ~593 CPCB CAAQMS stations when paginated correctly.
 * Each record = one pollutant reading at one station.
 * We group records by station and compute AQI per station.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { getAQICategory } from './types';

export const DATA_GOV_IN_RESOURCE = '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69';

// Public demo key — works for moderate use. 
// Replace with your own from data.gov.in/user/register
const DEFAULT_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

export interface RawCPCBRecord {
  country: string;
  state: string;
  city: string;
  station: string;
  last_update: string;
  latitude: string;
  longitude: string;
  pollutant_id: string;
  pollutant_min: string;
  pollutant_max: string;
  pollutant_avg: string;
}

export interface StationReading {
  station: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  aqi: number;
  category: ReturnType<typeof getAQICategory>;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  nh3: number;
  lastUpdate: string;
  dominantPollutant: string;
  dominantSource: string;
}

// ─────────────────────────────────────────────────────────────────────────
// AQI Calculation (CPCB standard formula)
// Reference: https://cpcb.nic.in/upload/national-air-quality-index/AQI-Calculator.xlsx
// ─────────────────────────────────────────────────────────────────────────
interface AQIBreakpoint {
  cLow: number; cHigh: number; iLow: number; iHigh: number;
}

const PM25_BP: AQIBreakpoint[] = [
  { cLow: 0,    cHigh: 30,   iLow: 0,   iHigh: 50  },
  { cLow: 31,   cHigh: 60,   iLow: 51,  iHigh: 100 },
  { cLow: 61,   cHigh: 90,   iLow: 101, iHigh: 200 },
  { cLow: 91,   cHigh: 120,  iLow: 201, iHigh: 300 },
  { cLow: 121,  cHigh: 250,  iLow: 301, iHigh: 400 },
  { cLow: 251,  cHigh: 500,  iLow: 401, iHigh: 500 },
];

const PM10_BP: AQIBreakpoint[] = [
  { cLow: 0,   cHigh: 50,   iLow: 0,   iHigh: 50  },
  { cLow: 51,  cHigh: 100,  iLow: 51,  iHigh: 100 },
  { cLow: 101, cHigh: 250,  iLow: 101, iHigh: 200 },
  { cLow: 251, cHigh: 350,  iLow: 201, iHigh: 300 },
  { cLow: 351, cHigh: 430,  iLow: 301, iHigh: 400 },
  { cLow: 431, cHigh: 600,  iLow: 401, iHigh: 500 },
];

const NO2_BP: AQIBreakpoint[] = [
  { cLow: 0,   cHigh: 40,   iLow: 0,   iHigh: 50  },
  { cLow: 41,  cHigh: 80,   iLow: 51,  iHigh: 100 },
  { cLow: 81,  cHigh: 180,  iLow: 101, iHigh: 200 },
  { cLow: 181, cHigh: 280,  iLow: 201, iHigh: 300 },
  { cLow: 281, cHigh: 400,  iLow: 301, iHigh: 400 },
  { cLow: 401, cHigh: 800,  iLow: 401, iHigh: 500 },
];

const SO2_BP: AQIBreakpoint[] = [
  { cLow: 0,   cHigh: 40,   iLow: 0,   iHigh: 50  },
  { cLow: 41,  cHigh: 80,   iLow: 51,  iHigh: 100 },
  { cLow: 81,  cHigh: 380,  iLow: 101, iHigh: 200 },
  { cLow: 381, cHigh: 800,  iLow: 201, iHigh: 300 },
  { cLow: 801, cHigh: 1600, iLow: 301, iHigh: 400 },
  { cLow: 1601,cHigh: 2100, iLow: 401, iHigh: 500 },
];

const CO_BP: AQIBreakpoint[] = [
  { cLow: 0,   cHigh: 1,    iLow: 0,   iHigh: 50  },
  { cLow: 1.1, cHigh: 2,    iLow: 51,  iHigh: 100 },
  { cLow: 2.1, cHigh: 10,   iLow: 101, iHigh: 200 },
  { cLow: 10.1,cHigh: 17,   iLow: 201, iHigh: 300 },
  { cLow: 17.1,cHigh: 34,   iLow: 301, iHigh: 400 },
  { cLow: 34.1,cHigh: 60,   iLow: 401, iHigh: 500 },
];

const O3_BP: AQIBreakpoint[] = [
  { cLow: 0,   cHigh: 50,   iLow: 0,   iHigh: 50  },
  { cLow: 51,  cHigh: 100,  iLow: 51,  iHigh: 100 },
  { cLow: 101, cHigh: 168,  iLow: 101, iHigh: 200 },
  { cLow: 169, cHigh: 208,  iLow: 201, iHigh: 300 },
  { cLow: 209, cHigh: 748,  iLow: 301, iHigh: 400 },
  { cLow: 749, cHigh: 1000, iLow: 401, iHigh: 500 },
];

function calcSubIndex(c: number, breakpoints: AQIBreakpoint[]): number {
  if (isNaN(c) || c < 0) return 0;
  for (const bp of breakpoints) {
    if (c >= bp.cLow && c <= bp.cHigh) {
      return Math.round(((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (c - bp.cLow) + bp.iLow);
    }
  }
  return 500; // off-scale high
}

// ─────────────────────────────────────────────────────────────────────────
// Group raw records by station and compute AQI
// ─────────────────────────────────────────────────────────────────────────
function groupByStation(records: RawCPCBRecord[]): StationReading[] {
  const map = new Map<string, { data: Record<string, number>; meta: RawCPCBRecord }>();

  for (const r of records) {
    const key = `${r.station}||${r.city}`;
    const val = parseFloat(r.pollutant_avg);
    if (!map.has(key)) {
      map.set(key, { data: {}, meta: r });
    }
    const entry = map.get(key)!;
    if (!isNaN(val) && val > 0 && val < 9999) {
      entry.data[r.pollutant_id.toUpperCase()] = val;
    }
  }

  const stations: StationReading[] = [];

  for (const [, { data, meta }] of map) {
    const lat = parseFloat(meta.latitude);
    const lng = parseFloat(meta.longitude);
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) continue;

    const pm25 = data['PM2.5'] ?? 0;
    const pm10 = data['PM10'] ?? 0;
    const no2  = data['NO2']  ?? 0;
    const so2  = data['SO2']  ?? 0;
    const co   = data['CO']   ?? 0;
    const o3   = data['OZONE'] ?? data['O3'] ?? 0;
    const nh3  = data['NH3']  ?? 0;

    // Sub-indices
    const subIndices: { val: number; pollutant: string }[] = [
      { val: calcSubIndex(pm25, PM25_BP), pollutant: 'PM2.5' },
      { val: calcSubIndex(pm10, PM10_BP), pollutant: 'PM10'  },
      { val: calcSubIndex(no2,  NO2_BP),  pollutant: 'NO2'   },
      { val: calcSubIndex(so2,  SO2_BP),  pollutant: 'SO2'   },
      { val: calcSubIndex(co,   CO_BP),   pollutant: 'CO'    },
      { val: calcSubIndex(o3,   O3_BP),   pollutant: 'O3'    },
    ].filter(s => s.val > 0);

    if (subIndices.length === 0) continue;

    const dominant = subIndices.reduce((a, b) => a.val > b.val ? a : b);
    const aqi = dominant.val;

    // Guess dominant source from dominant pollutant
    const sourceMap: Record<string, string> = {
      'PM2.5': 'Vehicle Traffic / Burning',
      'PM10':  'Road Dust / Construction',
      'NO2':   'Vehicle Exhaust',
      'SO2':   'Industrial Emissions',
      'CO':    'Vehicle Traffic',
      'O3':    'Secondary Photochemical',
    };

    stations.push({
      station: meta.station,
      city: meta.city,
      state: meta.state,
      lat, lng,
      aqi,
      category: getAQICategory(aqi),
      pm25: Math.round(pm25),
      pm10: Math.round(pm10),
      no2:  Math.round(no2),
      so2:  Math.round(so2),
      co:   Math.round(co * 10) / 10,
      o3:   Math.round(o3),
      nh3:  Math.round(nh3),
      lastUpdate: meta.last_update,
      dominantPollutant: dominant.pollutant,
      dominantSource: sourceMap[dominant.pollutant] ?? 'Mixed Sources',
    });
  }

  return stations.sort((a, b) => b.aqi - a.aqi);
}

// ─────────────────────────────────────────────────────────────────────────
// Fetch ALL stations via pagination (CPCB API returns max 500 per page)
// ─────────────────────────────────────────────────────────────────────────
export async function fetchAllCPCBStations(apiKey?: string): Promise<{
  stations: StationReading[];
  totalFetched: number;
  source: 'live' | 'error';
  error?: string;
}> {
  const key = apiKey || process.env.DATA_GOV_IN_API_KEY || DEFAULT_KEY;
  const BASE = `https://api.data.gov.in/resource/${DATA_GOV_IN_RESOURCE}`;
  
  const allRecords: RawCPCBRecord[] = [];
  let offset = 0;
  const LIMIT = 500;
  let totalCount = 0;

  try {
    // First request: get total count
    const firstUrl = `${BASE}?api-key=${key}&format=json&limit=${LIMIT}&offset=0`;
    const firstRes = await fetch(firstUrl, {
      next: { revalidate: 900 }, // 15-minute cache
      headers: { 'Accept': 'application/json' },
    });

    if (!firstRes.ok) {
      throw new Error(`API responded with status ${firstRes.status}`);
    }

    const firstData = await firstRes.json();
    totalCount = parseInt(firstData.total || firstData.count || '500');
    allRecords.push(...(firstData.records || []));
    offset += LIMIT;

    // Paginate to get the rest
    const promises: Promise<RawCPCBRecord[]>[] = [];
    while (offset < Math.min(totalCount, 5000)) {
      const url = `${BASE}?api-key=${key}&format=json&limit=${LIMIT}&offset=${offset}`;
      promises.push(
        fetch(url, {
          next: { revalidate: 900 },
          headers: { 'Accept': 'application/json' },
        })
          .then(r => r.json())
          .then(d => d.records || [])
          .catch(() => [] as RawCPCBRecord[])
      );
      offset += LIMIT;
    }

    const pages = await Promise.all(promises);
    for (const page of pages) allRecords.push(...page);

    const stations = groupByStation(allRecords);

    return {
      stations,
      totalFetched: allRecords.length,
      source: 'live',
    };
  } catch (err) {
    return {
      stations: [],
      totalFetched: 0,
      source: 'error',
      error: String(err),
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Fetch stations for a specific city
// ─────────────────────────────────────────────────────────────────────────
export async function fetchCityStations(city: string, apiKey?: string): Promise<StationReading[]> {
  const key = apiKey || process.env.DATA_GOV_IN_API_KEY || DEFAULT_KEY;
  const BASE = `https://api.data.gov.in/resource/${DATA_GOV_IN_RESOURCE}`;
  
  try {
    const url = `${BASE}?api-key=${key}&format=json&limit=500&filters[city]=${encodeURIComponent(city)}`;
    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return groupByStation(data.records || []);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Geocode a location string to lat/lng using Nominatim (free, no key)
// ─────────────────────────────────────────────────────────────────────────
export async function geocodeLocation(query: string): Promise<{
  lat: number; lng: number; displayName: string; city?: string; state?: string;
} | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', India')}&format=json&limit=1&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VayuSainik/1.0 (contact@vayusainik.in)' },
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (!data.length) return null;
    const r = data[0];
    return {
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      displayName: r.display_name,
      city: r.address?.city || r.address?.town || r.address?.village || r.address?.county,
      state: r.address?.state,
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Find nearest stations to a lat/lng using Haversine formula
// ─────────────────────────────────────────────────────────────────────────
export function findNearestStations(
  lat: number,
  lng: number,
  stations: StationReading[],
  count: number = 5
): (StationReading & { distanceKm: number })[] {
  return stations
    .map(s => ({
      ...s,
      distanceKm: haversineKm(lat, lng, s.lat, s.lng),
    }))
    .filter(s => s.distanceKm < 200) // within 200km
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, count);
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
