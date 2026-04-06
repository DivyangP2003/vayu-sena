'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Wind, ChevronDown, Database, Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AQIBadge } from '@/components/ui/AQIBadge';
import FlashNotes from '@/components/ui/FlashNotes';
import LocationSearch from '@/components/ui/LocationSearch';
import { AQI_LEVELS } from '@/lib/types';
import { formatTime, getHealthTip } from '@/lib/utils';

const AQIHistoryChart = dynamic(() => import('@/components/charts/AQIHistoryChart'), { ssr: false });
const PollutantChart  = dynamic(() => import('@/components/charts/PollutantChart'), { ssr: false });

interface StationData {
  station: string; city: string; state: string;
  lat: number; lng: number; aqi: number; category: string;
  pm25: number; pm10: number; no2: number; so2: number; co: number; o3: number; nh3: number;
  lastUpdate: string; dominantPollutant: string; dominantSource: string;
}

function StatCard({ label, value, unit, color }: { label: string; value: string | number; unit: string; color?: string }) {
  return (
    <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
      <div className="text-xs font-mono text-[#3d6b52] mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-display font-700" style={{ color: color || '#e8f5ee' }}>{value}</span>
        <span className="text-xs font-mono text-[#3d6b52]">{unit}</span>
      </div>
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const initCity = searchParams.get('city') || 'Delhi';

  const [cityFilter, setCityFilter] = useState(initCity);
  const [stations, setStations] = useState<StationData[]>([]);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [allCities, setAllCities] = useState<{ city: string; avgAqi: number; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Load stations for selected city
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/aqi?city=${encodeURIComponent(cityFilter)}`);
        const data = await res.json();
        const list: StationData[] = data.data || [];
        setStations(list);
        setDataSource(data.source || '');
        if (list.length > 0) {
          // Pick worst-AQI station as default
          setSelectedStation(list.sort((a, b) => b.aqi - a.aqi)[0]);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [cityFilter]);

  // Load all cities summary (once)
  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/stations?page=1');
      const data = await res.json();
      if (data.stations) {
        // Group by city
        const cityMap = new Map<string, { total: number; count: number }>();
        for (const s of data.stations as StationData[]) {
          const e = cityMap.get(s.city) || { total: 0, count: 0 };
          e.total += s.aqi; e.count++;
          cityMap.set(s.city, e);
        }
        const cities = [...cityMap.entries()]
          .map(([city, { total, count }]) => ({ city, avgAqi: Math.round(total / count), count }))
          .sort((a, b) => b.avgAqi - a.avgAqi);
        setAllCities(cities);
      }
    };
    load();
  }, []);

  const display = selectedStation;
  const level = display ? AQI_LEVELS[display.category as keyof typeof AQI_LEVELS] : null;

  // For chart compatibility: convert to legacy AQIData shape
  const chartData = display ? {
    city: display.city, state: display.state, station: display.station,
    lat: display.lat, lng: display.lng, aqi: display.aqi,
    category: display.category as any,
    pm25: display.pm25, pm10: display.pm10, no2: display.no2,
    so2: display.so2, co: display.co, o3: display.o3,
    timestamp: display.lastUpdate || new Date().toISOString(),
    trend: 'stable' as const, dominantSource: display.dominantSource,
  } : null;

  return (
    <div className="min-h-screen bg-[#0a0f0d] bg-grid pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest">Dashboard</span>
              {dataSource && (
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                  dataSource === 'live_cpcb'
                    ? 'text-[#00ff88] border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.06)]'
                    : 'text-[#ffb800] border-[rgba(255,184,0,0.2)] bg-[rgba(255,184,0,0.06)]'
                }`}>
                  {dataSource === 'live_cpcb' ? '● LIVE CPCB' : '◌ ESTIMATED'}
                </span>
              )}
            </div>

            {/* City selector */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 font-display font-800 text-2xl sm:text-3xl text-[#e8f5ee] hover:text-[#00ff88] transition-colors"
              >
                {cityFilter}
                <ChevronDown size={18} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-[rgba(0,255,136,0.15)] bg-[#111f17] shadow-xl z-30 max-h-72 overflow-y-auto">
                  {allCities.map(c => {
                    const lvl = AQI_LEVELS[c.avgAqi > 300 ? 'very_poor' : c.avgAqi > 200 ? 'poor' : c.avgAqi > 100 ? 'moderate' : 'good'];
                    return (
                      <button key={c.city}
                        onClick={() => { setCityFilter(c.city); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors hover:bg-[rgba(0,255,136,0.06)] ${
                          cityFilter === c.city ? 'text-[#00ff88]' : 'text-[#7ab898]'
                        }`}>
                        <span>{c.city}</span>
                        <span className="font-mono text-xs" style={{ color: lvl.color }}>{c.avgAqi}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {display && (
              <div className="text-xs text-[#3d6b52] mt-1 font-mono">
                {stations.length} station{stations.length !== 1 ? 's' : ''} · {display.lastUpdate || 'Real-time'}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-all ${
                showSearch
                  ? 'border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.08)] text-[#00ff88]'
                  : 'border-[rgba(0,255,136,0.1)] bg-[#111f17] text-[#7ab898] hover:text-[#e8f5ee]'
              }`}>
              <Search size={12} /> Location Search
            </button>
            {display && <AQIBadge aqi={display.aqi} size="xl" />}
          </div>
        </div>

        {/* Location Search panel */}
        {showSearch && (
          <div className="rounded-xl border border-[rgba(0,255,136,0.1)] bg-[#111f17] p-4 mb-6">
            <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">
              Search any location — ward, area, landmark
            </div>
            <LocationSearch />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6 animate-pulse">
            {[...Array(6)].map((_, i) => <div key={i} className="h-20 rounded-xl shimmer" />)}
          </div>
        ) : display && level ? (
          <>
            {/* Health advisory */}
            <div className="rounded-xl border p-4 mb-6 flex items-start gap-3"
              style={{ borderColor: level.border, background: level.bg }}>
              <div className="text-lg">{level.icon}</div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: level.color }}>
                  {level.label} — {display.station}
                </div>
                <p className="text-sm text-[#e8f5ee]">{getHealthTip(display.category as any)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left col */}
              <div className="lg:col-span-2 space-y-6">
                {/* Pollutants */}
                <div>
                  <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Live Pollutants</div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { label: 'PM2.5', value: display.pm25, unit: 'µg', color: '#00ff88' },
                      { label: 'PM10',  value: display.pm10, unit: 'µg', color: '#a8ff3e' },
                      { label: 'NO₂',  value: display.no2,  unit: 'µg', color: '#ffb800' },
                      { label: 'SO₂',  value: display.so2,  unit: 'µg', color: '#ff6b00' },
                      { label: 'CO',   value: display.co,   unit: 'mg', color: '#ff4444' },
                      { label: 'O₃',  value: display.o3,   unit: 'µg', color: '#00d4ff' },
                    ].map(p => (
                      <StatCard key={p.label} {...p} />
                    ))}
                  </div>
                </div>

                {/* Charts */}
                {chartData && (
                  <>
                    <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
                      <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-4">Pollutant Breakdown</div>
                      <PollutantChart data={chartData} />
                    </div>
                    <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
                      <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-4">14-Day AQI Trend</div>
                      <AQIHistoryChart city={cityFilter} />
                    </div>
                  </>
                )}

                {/* AI Flash Notes */}
                <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
                  <FlashNotes city={cityFilter} />
                </div>
              </div>

              {/* Right col */}
              <div className="space-y-4">
                {/* Source attribution */}
                <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
                  <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Dominant Source</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#ffb800]" />
                    <span className="text-sm font-display font-600 text-[#e8f5ee]">{display.dominantSource}</span>
                  </div>
                  <div className="text-xs text-[#3d6b52] mb-1 font-mono">Dominant pollutant: {display.dominantPollutant}</div>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: 'Traffic',     pct: 35, color: '#ff6b00' },
                      { label: 'Construction',pct: 22, color: '#ffb800' },
                      { label: 'Burning',     pct: 20, color: '#ff4444' },
                      { label: 'Industrial',  pct: 15, color: '#cc00ff' },
                      { label: 'Dust',        pct: 8,  color: '#7ab898' },
                    ].map(s => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#7ab898]">{s.label}</span>
                          <span className="font-mono text-[#3d6b52]">{s.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#1a2e22] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color, opacity: 0.8 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other stations in this city */}
                {stations.length > 1 && (
                  <div>
                    <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">
                      Stations in {cityFilter} ({stations.length})
                    </div>
                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {stations.map(s => {
                        const lvl = AQI_LEVELS[s.category as keyof typeof AQI_LEVELS];
                        return (
                          <button key={s.station}
                            onClick={() => setSelectedStation(s)}
                            className={`w-full text-left rounded-xl p-3 border text-xs transition-all ${
                              selectedStation?.station === s.station
                                ? 'border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.07)]'
                                : 'border-[rgba(0,255,136,0.06)] bg-[#111f17] hover:border-[rgba(0,255,136,0.15)]'
                            }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[#e8f5ee] font-medium truncate pr-2">{s.station}</span>
                              <span className="font-mono font-600 flex-shrink-0" style={{ color: lvl?.color }}>{s.aqi}</span>
                            </div>
                            <div className="text-[#3d6b52] mt-0.5 text-[9px]">{s.dominantSource}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-[#3d6b52] font-mono text-sm">
            No station data found for {cityFilter}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center text-[#3d6b52] font-mono text-sm">Loading...</div>}>
      <Navbar />
      <DashboardContent />
    </Suspense>
  );
}
