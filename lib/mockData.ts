import { AQIData, CitizenReport, getAQICategory, INDIA_CITIES } from './types';

// -------------------------------------------------------
// Deterministic mock data (seeded by city name)
// Used as fallback when API keys are not configured
// -------------------------------------------------------

function seededRandom(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const normalized = Math.abs(hash % 1000) / 1000;
  return Math.floor(min + normalized * (max - min));
}

const HOUR_OFFSET: Record<string, number> = {
  Delhi: 15,
  Mumbai: -5,
  Bengaluru: -20,
  Kolkata: 8,
  Chennai: -15,
  Hyderabad: -10,
  Ahmedabad: 5,
  Pune: -8,
  Kanpur: 12,
  Lucknow: 10,
};

export function generateMockAQI(cityName: string, hour?: number): AQIData {
  const city = INDIA_CITIES.find(c => c.name === cityName) || INDIA_CITIES[0];
  const h = hour ?? new Date().getHours();
  const baseAQI = seededRandom(city.name, 60, 280);
  // Daily cycle: worse at rush hours (8am, 6pm) and at night
  const hourFactor = Math.sin((h - 6) * Math.PI / 12) * 0.3 + 1;
  const aqi = Math.round(baseAQI * hourFactor + (HOUR_OFFSET[city.name] || 0));
  const pm25 = Math.round(aqi * 0.42);
  const pm10 = Math.round(aqi * 0.68);

  const sources = ['Vehicle Traffic', 'Construction Dust', 'Industrial Emissions', 'Biomass Burning', 'Road Dust'];
  const dominantSource = sources[seededRandom(city.name + h, 0, sources.length)];

  return {
    city: city.name,
    state: city.state,
    station: `${city.name} Central`,
    lat: city.lat,
    lng: city.lng,
    aqi: Math.max(10, aqi),
    category: getAQICategory(Math.max(10, aqi)),
    pm25,
    pm10,
    no2: seededRandom(city.name + 'no2', 20, 80),
    so2: seededRandom(city.name + 'so2', 5, 40),
    co: seededRandom(city.name + 'co', 5, 30),
    o3: seededRandom(city.name + 'o3', 30, 120),
    timestamp: new Date().toISOString(),
    trend: aqi > 200 ? 'worsening' : aqi < 100 ? 'improving' : 'stable',
    dominantSource,
  };
}

export function generateAllCitiesAQI(): AQIData[] {
  return INDIA_CITIES.map(c => generateMockAQI(c.name));
}

export function generateHistoricalAQI(city: string, days: number = 7): { date: string; aqi: number; pm25: number }[] {
  const result = [];
  for (let d = days; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];
    const base = seededRandom(city + dateStr, 60, 280);
    result.push({
      date: dateStr,
      aqi: base,
      pm25: Math.round(base * 0.42),
    });
  }
  return result;
}

export const MOCK_REPORTS: CitizenReport[] = [
  {
    id: '1',
    lat: 28.6329,
    lng: 77.2195,
    city: 'Delhi',
    description: 'Heavy smog from construction site at Connaught Place. Dust is unbearable.',
    sourceType: 'construction',
    severity: 4,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    upvotes: 14,
    status: 'verified',
    estimatedPM25: 165,
  },
  {
    id: '2',
    lat: 28.5535,
    lng: 77.2588,
    city: 'Delhi',
    description: 'Garbage burning near Saket metro. Dense black smoke.',
    sourceType: 'burning',
    severity: 5,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    upvotes: 28,
    status: 'verified',
    estimatedPM25: 220,
  },
  {
    id: '3',
    lat: 28.7041,
    lng: 77.1025,
    city: 'Delhi',
    description: 'Truck exhaust along NH-44 junction, standing traffic for 2km.',
    sourceType: 'traffic',
    severity: 3,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    upvotes: 9,
    status: 'pending',
    estimatedPM25: 120,
  },
  {
    id: '4',
    lat: 19.0820,
    lng: 72.8840,
    city: 'Mumbai',
    description: 'Chemical smell from Dharavi industrial area, eyes burning.',
    sourceType: 'industrial',
    severity: 4,
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    upvotes: 31,
    status: 'verified',
    estimatedPM25: 145,
  },
  {
    id: '5',
    lat: 12.9516,
    lng: 77.5946,
    city: 'Bengaluru',
    description: 'Dust storm from Yelahanka construction zone, visibility poor.',
    sourceType: 'dust',
    severity: 3,
    timestamp: new Date(Date.now() - 9000000).toISOString(),
    upvotes: 6,
    status: 'pending',
    estimatedPM25: 98,
  },
];

export const MOCK_NEWS = [
  {
    title: 'CAQM Tightens Stubble Burning Penalties Ahead of Winter Season',
    description: 'Commission for Air Quality Management imposes stricter fines on farmers burning crop residue in Punjab and Haryana, with satellite monitoring deployed for real-time detection.',
    url: '#',
    source: 'Times of India',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    category: 'policy' as const,
  },
  {
    title: 'Delhi AQI Hits 380 as Weather Office Warns of Pollution Surge',
    description: 'India Meteorological Department forecasts low wind speeds over Delhi-NCR this week, creating conditions for severe pollution accumulation.',
    url: '#',
    source: 'Hindustan Times',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    category: 'alert' as const,
  },
  {
    title: 'IIT Delhi Researchers Train AI Model on Indian Sky Photos to Estimate PM2.5',
    description: 'A new study demonstrates that smartphone camera images can estimate particulate matter concentrations with 82% accuracy, opening doors for sensor-free monitoring.',
    url: '#',
    source: 'The Wire Science',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    category: 'research' as const,
  },
  {
    title: 'SAFAR Launches AQI Forecast for 10 New Indian Cities',
    description: 'The System of Air Quality and Weather Forecasting extends its 72-hour AQI prediction to include Kolkata, Hyderabad, Bengaluru and seven other metros.',
    url: '#',
    source: 'Mint',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    category: 'general' as const,
  },
  {
    title: "Mumbai's Coastal Wind Pattern Brings Temporary AQI Relief, Says Study",
    description: 'Arabian Sea winds dropping AQI below 80 during monsoon — new research maps how sea-breeze circulation naturally cleanses Mumbai\'s air six months a year.',
    url: '#',
    source: 'Indian Express',
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
    category: 'research' as const,
  },
];
