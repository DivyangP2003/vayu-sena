'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Layers, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { AQIData, AQI_LEVELS, INDIA_CITIES } from '@/lib/types';
import { generateAllCitiesAQI } from '@/lib/mockData';
import { AQIBadge } from '@/components/ui/AQIBadge';
import { formatTime, getHealthTip } from '@/lib/utils';

const IndiaMap = dynamic(() => import('@/components/map/IndiaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0f0d] rounded-xl">
      <div className="text-center">
        <div className="w-8 h-8 border border-[rgba(0,255,136,0.3)] border-t-[#00ff88] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-[#3d6b52]">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [allCities, setAllCities] = useState<AQIData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Delhi');
  const [selectedData, setSelectedData] = useState<AQIData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    setRefreshing(true);
    const data = generateAllCitiesAQI();
    setAllCities(data);
    setLastUpdated(new Date().toISOString());
    const found = data.find(d => d.city === selectedCity);
    if (found) setSelectedData(found);
    setTimeout(() => setRefreshing(false), 600);
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    const found = allCities.find(d => d.city === selectedCity);
    if (found) setSelectedData(found);
  }, [selectedCity, allCities]);

  const level = selectedData ? AQI_LEVELS[selectedData.category] : null;

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col pt-14">
      <Navbar />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)]">
        {/* Map */}
        <div className="flex-1 relative">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[rgba(10,15,13,0.9)] border border-[rgba(0,255,136,0.1)] rounded-lg px-3 py-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-xs font-mono text-[#7ab898]">Live — {allCities.length} cities</span>
            </div>
            <button onClick={loadData} disabled={refreshing}
              className="bg-[rgba(10,15,13,0.9)] border border-[rgba(0,255,136,0.1)] rounded-lg p-1.5 text-[#3d6b52] hover:text-[#7ab898] transition-colors backdrop-blur-sm disabled:opacity-50">
              <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          {lastUpdated && (
            <div className="absolute bottom-3 left-3 z-10 bg-[rgba(10,15,13,0.9)] border border-[rgba(0,255,136,0.06)] rounded-lg px-3 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-mono text-[#3d6b52]">Updated {formatTime(lastUpdated)}</span>
            </div>
          )}

          {/* AQI Legend */}
          <div className="absolute bottom-3 right-3 z-10 bg-[rgba(10,15,13,0.9)] border border-[rgba(0,255,136,0.06)] rounded-lg p-2.5 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-[#3d6b52] uppercase tracking-widest mb-2">AQI Legend</div>
            {Object.entries(AQI_LEVELS).map(([, lvl]) => (
              <div key={lvl.label} className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lvl.color }} />
                <span className="text-[9px] font-mono text-[#3d6b52]">{lvl.label} ({lvl.range})</span>
              </div>
            ))}
          </div>

          <IndiaMap data={allCities} onCitySelect={setSelectedCity} selectedCity={selectedCity} />
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[rgba(0,255,136,0.08)] bg-[#0a0f0d] overflow-y-auto">
          {selectedData && level ? (
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display font-800 text-lg text-[#e8f5ee]">{selectedData.city}</h2>
                  <p className="text-xs font-mono text-[#3d6b52]">{selectedData.state}</p>
                </div>
                <AQIBadge aqi={selectedData.aqi} size="md" />
              </div>

              <div className="rounded-xl border p-3 mb-4"
                style={{ borderColor: level.border, background: level.bg }}>
                <p className="text-xs leading-relaxed" style={{ color: level.color }}>
                  {getHealthTip(selectedData.category)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'PM2.5', value: `${selectedData.pm25} µg`, color: '#00ff88' },
                  { label: 'PM10', value: `${selectedData.pm10} µg`, color: '#a8ff3e' },
                  { label: 'NO₂', value: `${selectedData.no2} µg`, color: '#ffb800' },
                  { label: 'O₃', value: `${selectedData.o3} µg`, color: '#00d4ff' },
                ].map(p => (
                  <div key={p.label} className="rounded-lg border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-2.5">
                    <div className="text-[10px] font-mono text-[#3d6b52]">{p.label}</div>
                    <div className="text-sm font-display font-600 mt-0.5" style={{ color: p.color }}>{p.value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-3 mb-4">
                <div className="text-[10px] font-mono text-[#3d6b52] uppercase tracking-widest mb-1">Main Source</div>
                <div className="text-sm font-display font-600 text-[#e8f5ee]">{selectedData.dominantSource}</div>
              </div>

              <div className="text-[10px] font-mono text-[#3d6b52] text-center">
                Tap any circle on the map to switch city
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="text-xs font-mono text-[#3d6b52]">Click a city on the map to view details</div>
            </div>
          )}

          {/* City list */}
          <div className="border-t border-[rgba(0,255,136,0.06)] p-4">
            <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">All Cities</div>
            <div className="space-y-1">
              {[...allCities].sort((a, b) => b.aqi - a.aqi).map(c => {
                const lvl = AQI_LEVELS[c.category];
                return (
                  <button key={c.city}
                    onClick={() => setSelectedCity(c.city)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                      selectedCity === c.city
                        ? 'bg-[rgba(0,255,136,0.07)] border border-[rgba(0,255,136,0.2)]'
                        : 'hover:bg-[rgba(0,255,136,0.03)]'
                    }`}>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lvl.color }} />
                      <span className="text-[#e8f5ee]">{c.city}</span>
                    </div>
                    <span className="font-mono" style={{ color: lvl.color }}>{c.aqi}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
