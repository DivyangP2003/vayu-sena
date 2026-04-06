'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { RefreshCw, Loader2, Database } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { AQI_LEVELS } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import LocationSearch from '@/components/ui/LocationSearch';

const IndiaMap = dynamic(() => import('@/components/map/IndiaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0f0d] rounded-xl gap-3">
      <div className="w-8 h-8 border border-[rgba(0,255,136,0.3)] border-t-[#00ff88] rounded-full animate-spin" />
      <p className="text-xs font-mono text-[#3d6b52]">Loading CPCB stations...</p>
    </div>
  ),
});

interface StationData {
  station: string; city: string; state: string;
  lat: number; lng: number; aqi: number; category: string;
  pm25: number; pm10: number; no2: number; so2: number; co: number; o3: number; nh3: number;
  lastUpdate: string; dominantPollutant: string; dominantSource: string;
}

export default function MapPage() {
  const [stations, setStations] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number; label: string; aqi?: number } | null>(null);
  const [stateFilter, setStateFilter] = useState('');
  const [states, setStates] = useState<string[]>([]);

  const loadStations = useCallback(async () => {
    setLoading(true);
    try {
      const url = stateFilter
        ? `/api/aqi?state=${encodeURIComponent(stateFilter)}`
        : '/api/aqi';
      const res = await fetch(url);
      const data = await res.json();
      setStations(data.data || []);
      setDataSource(data.source || '');
      setLastUpdated(new Date().toISOString());

      // Load states list for filter
      if (!stateFilter && data.data?.length > 0) {
        const uniqueStates = [...new Set((data.data as StationData[]).map(s => s.state))].sort() as string[];
        setStates(uniqueStates);
      }
    } catch (e) {
      console.error('Failed to load stations', e);
    } finally {
      setLoading(false);
    }
  }, [stateFilter]);

  useEffect(() => { loadStations(); }, [loadStations]);

  const handleSearchResult = (result: any) => {
    setSearchMarker({
      lat: result.location.lat,
      lng: result.location.lng,
      label: result.location.city || result.location.displayName?.split(',')[0] || 'Location',
      aqi: result.aqi.value,
    });
  };

  const level = selectedStation ? AQI_LEVELS[selectedStation.category as keyof typeof AQI_LEVELS] : null;

  // Stats
  const severe   = stations.filter(s => s.aqi > 300).length;
  const poor     = stations.filter(s => s.aqi > 200 && s.aqi <= 300).length;
  const moderate = stations.filter(s => s.aqi > 100 && s.aqi <= 200).length;
  const good     = stations.filter(s => s.aqi <= 100).length;

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col pt-14">
      <Navbar />

      <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 56px)' }}>

        {/* ── Map ────────────────────────────────────────────────────────── */}
        <div className="flex-1 relative">

          {/* Top bar over map */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[rgba(10,15,13,0.92)] border border-[rgba(0,255,136,0.1)] rounded-lg px-3 py-1.5 backdrop-blur-sm">
              {loading
                ? <Loader2 size={10} className="text-[#3d6b52] animate-spin" />
                : <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
              }
              <span className="text-xs font-mono text-[#7ab898]">
                {loading ? 'Loading...' : `${stations.length} stations live`}
              </span>
              {dataSource && (
                <span className="text-[9px] font-mono text-[#3d6b52] border border-[rgba(0,255,136,0.08)] rounded px-1">
                  {dataSource === 'live_cpcb' ? 'CPCB' : 'EST'}
                </span>
              )}
            </div>
            <button onClick={loadStations} disabled={loading}
              className="bg-[rgba(10,15,13,0.92)] border border-[rgba(0,255,136,0.1)] rounded-lg p-1.5 text-[#3d6b52] hover:text-[#7ab898] backdrop-blur-sm disabled:opacity-40">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* AQI legend */}
          <div className="absolute bottom-3 left-3 z-10 bg-[rgba(10,15,13,0.92)] border border-[rgba(0,255,136,0.06)] rounded-lg p-2.5 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-[#3d6b52] uppercase tracking-widest mb-1.5">AQI</div>
            {Object.entries(AQI_LEVELS).map(([, lvl]) => (
              <div key={lvl.label} className="flex items-center gap-1.5 mb-1 last:mb-0">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lvl.color }} />
                <span className="text-[9px] font-mono text-[#3d6b52]">{lvl.label}</span>
              </div>
            ))}
          </div>

          {lastUpdated && (
            <div className="absolute bottom-3 right-3 z-10 bg-[rgba(10,15,13,0.92)] border border-[rgba(0,255,136,0.06)] rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
              <span className="text-[9px] font-mono text-[#3d6b52]">{formatTime(lastUpdated)}</span>
            </div>
          )}

          <IndiaMap
  data={stations}
  onStationSelect={(station) => {
    const fullData = stations.find(
      (s) =>
        s.station === station.station &&
        s.city === station.city
    );
    setSelectedStation(fullData || null);
  }}
  selectedStation={selectedStation?.station}   // ✅ add this back
  searchMarker={searchMarker}                 // ✅ keep this too
/>
        </div>

        {/* ── Side Panel ─────────────────────────────────────────────────── */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[rgba(0,255,136,0.08)] bg-[#0a0f0d] flex flex-col overflow-hidden">

          {/* Location search */}
          <div className="p-4 border-b border-[rgba(0,255,136,0.06)]">
            <div className="text-[10px] font-mono text-[#3d6b52] uppercase tracking-widest mb-2">Location Analysis</div>
            <LocationSearch onResult={handleSearchResult} />
          </div>

          {/* State filter */}
          <div className="px-4 pt-3 pb-2 border-b border-[rgba(0,255,136,0.06)]">
            <select
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
              className="w-full bg-[#111f17] border border-[rgba(0,255,136,0.1)] rounded-lg px-3 py-2 text-xs text-[#e8f5ee] font-mono focus:outline-none focus:border-[rgba(0,255,136,0.25)]"
            >
              <option value="">All States ({stations.length} stations)</option>
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Quick stats */}
          {!loading && stations.length > 0 && (
            <div className="grid grid-cols-4 divide-x divide-[rgba(0,255,136,0.06)] border-b border-[rgba(0,255,136,0.06)]">
              {[
                { n: severe, label: 'Severe', color: '#cc00ff' },
                { n: poor,   label: 'Poor',   color: '#ff4444' },
                { n: moderate,label:'Mod',    color: '#ffb800' },
                { n: good,   label: 'Good',   color: '#00ff88' },
              ].map(s => (
                <div key={s.label} className="p-2 text-center">
                  <div className="text-base font-display font-700" style={{ color: s.color }}>{s.n}</div>
                  <div className="text-[9px] font-mono" style={{ color: s.color }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Selected station detail */}
          {selectedStation && level && (
            <div className="p-4 border-b border-[rgba(0,255,136,0.06)]">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-display font-700 text-[#e8f5ee] truncate">{selectedStation.station}</div>
                  <div className="text-xs text-[#3d6b52] font-mono">{selectedStation.city}, {selectedStation.state}</div>
                </div>
                <div className="text-xl font-display font-800 ml-2" style={{ color: level.color }}>
                  {selectedStation.aqi}
                </div>
              </div>
              <div style={{ color: level.color }} className="text-xs font-mono mb-2">{level.label}</div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { l: 'PM2.5', v: selectedStation.pm25, c: '#00ff88' },
                  { l: 'PM10',  v: selectedStation.pm10, c: '#a8ff3e' },
                  { l: 'NO₂',  v: selectedStation.no2,  c: '#ffb800' },
                  { l: 'SO₂',  v: selectedStation.so2,  c: '#ff6b00' },
                  { l: 'CO',   v: selectedStation.co,   c: '#ff4444' },
                  { l: 'O₃',  v: selectedStation.o3,   c: '#00d4ff' },
                ].map(p => (
                  <div key={p.l} className="rounded-lg bg-[#111f17] border border-[rgba(0,255,136,0.06)] p-2">
                    <div className="text-[9px] font-mono text-[#3d6b52]">{p.l}</div>
                    <div className="text-sm font-display font-600" style={{ color: p.c }}>{p.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[10px] text-[#3d6b52] font-mono">
                Source: {selectedStation.dominantSource}
              </div>
              {selectedStation.lastUpdate && (
                <div className="text-[9px] text-[#3d6b52] font-mono mt-0.5">{selectedStation.lastUpdate}</div>
              )}
            </div>
          )}

          {/* Station list */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pt-3 pb-1">
              <div className="text-[10px] font-mono text-[#3d6b52] uppercase tracking-widest">
                Stations — sorted by AQI
              </div>
            </div>
            {loading ? (
              <div className="p-4 space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-8 rounded-lg shimmer" />
                ))}
              </div>
            ) : (
              <div className="px-2 pb-4">
                {stations.map((s) => {
                  const lvl = AQI_LEVELS[s.category as keyof typeof AQI_LEVELS];
                  return (
                    <button key={`${s.station}-${s.city}`}
                      onClick={() => setSelectedStation(s)}
                      className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-xs mb-0.5 transition-all text-left ${
                        selectedStation?.station === s.station
                          ? 'bg-[rgba(0,255,136,0.07)] border border-[rgba(0,255,136,0.15)]'
                          : 'hover:bg-[rgba(0,255,136,0.03)]'
                      }`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: lvl?.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[#e8f5ee] truncate font-medium">{s.station}</div>
                          <div className="text-[#3d6b52] text-[9px] truncate">{s.city}</div>
                        </div>
                      </div>
                      <span className="font-mono font-600 ml-2 flex-shrink-0" style={{ color: lvl?.color }}>
                        {s.aqi}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
