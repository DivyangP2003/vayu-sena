'use client';
import { useState, useRef, useCallback } from 'react';
import { Search, MapPin, Loader2, Wind, AlertTriangle, X, Navigation } from 'lucide-react';
import { AQI_LEVELS, getAQICategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SearchResult {
  location: {
    query: string;
    displayName: string;
    lat: number;
    lng: number;
    city?: string;
    state?: string;
  };
  aqi: {
    value: number;
    category: string;
    label: string;
    color: string;
    health: string;
    interpolationMethod: string;
  };
  pollutants: { pm25: number; pm10: number; no2: number; dominantPollutant: string };
  dominantSource: string;
  nearestStations: {
    name: string; city: string; state: string;
    lat: number; lng: number; aqi: number; category: string;
    distanceKm: number; lastUpdate: string;
  }[];
  dataSource: string;
  stationsUsed: number;
  timestamp: string;
}

interface LocationSearchProps {
  onResult?: (result: SearchResult) => void;
  className?: string;
}

const QUICK_SEARCHES = [
  'Connaught Place, Delhi',
  'Bandra, Mumbai',
  'Koramangala, Bengaluru',
  'Salt Lake, Kolkata',
  'Anna Nagar, Chennai',
  'HITEC City, Hyderabad',
];

export default function LocationSearch({ onResult, className }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string, lat?: number, lng?: number) => {
    if (!q && (!lat || !lng)) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const body: Record<string, unknown> = {};
      if (q) body.query = q;
      if (lat) body.lat = lat;
      if (lng) body.lng = lng;

      const res = await fetch('/api/location-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Location not found');
        return;
      }
      setResult(data);
      if (onResult) onResult(data);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [onResult]);

  const handleGPS = () => {
    if (!navigator.geolocation) { setError('GPS not available on this device'); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGpsLoading(false);
        search('', pos.coords.latitude, pos.coords.longitude);
      },
      () => { setGpsLoading(false); setError('Could not get your location'); }
    );
  };

  const level = result ? AQI_LEVELS[result.aqi.category as keyof typeof AQI_LEVELS] : null;

  return (
    <div className={cn('w-full', className)}>
      {/* Search bar */}
      <div className="relative flex gap-2">
        <div className="flex-1 relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d6b52] pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search(query)}
            placeholder="Search any location in India..."
            className="w-full bg-[#111f17] border border-[rgba(0,255,136,0.12)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#e8f5ee] placeholder-[#3d6b52] font-mono focus:outline-none focus:border-[rgba(0,255,136,0.35)] transition-colors"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResult(null); setError(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d6b52] hover:text-[#7ab898]"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <button
          onClick={() => search(query)}
          disabled={loading || !query}
          className="px-4 py-2.5 rounded-xl bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.25)] text-[#00ff88] text-sm font-medium hover:bg-[rgba(0,255,136,0.15)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Analyse'}
        </button>

        <button
          onClick={handleGPS}
          disabled={gpsLoading}
          title="Use my current location"
          className="px-3 py-2.5 rounded-xl border border-[rgba(0,255,136,0.1)] bg-[#111f17] text-[#7ab898] hover:text-[#00ff88] hover:border-[rgba(0,255,136,0.3)] transition-all disabled:opacity-40"
        >
          {gpsLoading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
        </button>
      </div>

      {/* Quick searches */}
      {!result && !loading && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_SEARCHES.map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); search(q); }}
              className="text-[10px] font-mono text-[#3d6b52] hover:text-[#7ab898] border border-[rgba(0,255,136,0.06)] hover:border-[rgba(0,255,136,0.15)] px-2 py-1 rounded-md transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-[rgba(255,68,68,0.06)] border border-[rgba(255,68,68,0.15)]">
          <AlertTriangle size={12} className="text-[#ff4444] mt-0.5 flex-shrink-0" />
          <span className="text-xs text-[#ff4444]">{error}</span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-4 rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4 animate-pulse">
          <div className="h-4 bg-[#1a2e22] rounded w-2/3 mb-3" />
          <div className="h-8 bg-[#1a2e22] rounded w-1/3 mb-3" />
          <div className="h-3 bg-[#1a2e22] rounded w-full mb-2" />
          <div className="h-3 bg-[#1a2e22] rounded w-4/5" />
        </div>
      )}

      {/* Result card */}
      {result && level && !loading && (
        <div className="mt-4 rounded-xl border bg-[#111f17] overflow-hidden"
          style={{ borderColor: `${result.aqi.color}30` }}>

          {/* Header */}
          <div className="p-4 border-b" style={{ borderColor: `${result.aqi.color}15`, background: `${result.aqi.color}08` }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={10} style={{ color: result.aqi.color }} />
                  <span className="text-[10px] font-mono" style={{ color: result.aqi.color }}>
                    {result.location.city || result.location.state || 'India'}
                  </span>
                  {result.dataSource === 'live_cpcb' && (
                    <span className="text-[9px] font-mono text-[#3d6b52] border border-[rgba(0,255,136,0.1)] rounded px-1 py-0.5">LIVE</span>
                  )}
                </div>
                <p className="text-xs text-[#7ab898] truncate">{result.location.displayName}</p>
              </div>

              {/* AQI circle */}
              <div
                className="w-16 h-16 rounded-full flex flex-col items-center justify-center flex-shrink-0 border-2"
                style={{
                  borderColor: result.aqi.color,
                  background: `radial-gradient(circle, ${result.aqi.color}18, transparent)`,
                  boxShadow: `0 0 16px ${result.aqi.color}30`,
                }}
              >
                <span className="text-xl font-display font-800" style={{ color: result.aqi.color }}>
                  {result.aqi.value}
                </span>
                <span className="text-[8px] font-mono" style={{ color: result.aqi.color }}>AQI</span>
              </div>
            </div>

            <div className="mt-2">
              <span className="text-sm font-display font-600" style={{ color: result.aqi.color }}>
                {result.aqi.label}
              </span>
              <p className="text-xs text-[#7ab898] mt-1 leading-relaxed">{result.aqi.health}</p>
            </div>
          </div>

          {/* Pollutants */}
          <div className="grid grid-cols-3 divide-x divide-[rgba(0,255,136,0.06)] border-b border-[rgba(0,255,136,0.06)]">
            {[
              { label: 'PM2.5', value: result.pollutants.pm25, unit: 'µg/m³', color: '#00ff88' },
              { label: 'PM10',  value: result.pollutants.pm10, unit: 'µg/m³', color: '#a8ff3e' },
              { label: 'NO₂',  value: result.pollutants.no2,  unit: 'µg/m³', color: '#ffb800' },
            ].map(p => (
              <div key={p.label} className="p-3 text-center">
                <div className="text-[10px] font-mono text-[#3d6b52]">{p.label}</div>
                <div className="text-base font-display font-700" style={{ color: p.color }}>{p.value}</div>
                <div className="text-[9px] font-mono text-[#3d6b52]">{p.unit}</div>
              </div>
            ))}
          </div>

          {/* Source + nearest stations */}
          <div className="p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Wind size={10} className="text-[#ffb800]" />
              <span className="text-xs text-[#7ab898]">Main source: <span className="text-[#e8f5ee]">{result.dominantSource}</span></span>
            </div>

            {result.nearestStations.length > 0 && (
              <>
                <div className="text-[10px] font-mono text-[#3d6b52] uppercase tracking-widest mb-2">
                  Nearest CPCB stations ({result.stationsUsed} used for interpolation)
                </div>
                <div className="space-y-1.5">
                  {result.nearestStations.map((s, i) => {
                    const sLevel = AQI_LEVELS[s.category as keyof typeof AQI_LEVELS];
                    return (
                      <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-[rgba(0,255,136,0.03)] border border-[rgba(0,255,136,0.05)]">
                        <div className="flex-1 min-w-0">
                          <span className="text-[#e8f5ee] font-medium truncate block">{s.name}</span>
                          <span className="text-[#3d6b52] text-[10px]">{s.city} · {s.distanceKm}km away</span>
                        </div>
                        <span className="font-mono font-600 ml-2 flex-shrink-0" style={{ color: sLevel?.color }}>
                          {s.aqi}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="mt-3 text-[9px] font-mono text-[#3d6b52]">
              {result.aqi.interpolationMethod} · {new Date(result.timestamp).toLocaleTimeString('en-IN')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
