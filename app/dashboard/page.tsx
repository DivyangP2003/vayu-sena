'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Wind, Droplets, Eye, Thermometer, ChevronDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AQIBadge } from '@/components/ui/AQIBadge';
import { AQICard } from '@/components/ui/AQIBadge';
import FlashNotes from '@/components/ui/FlashNotes';
import { AQIData, AQI_LEVELS, INDIA_CITIES } from '@/lib/types';
import { generateMockAQI, generateAllCitiesAQI } from '@/lib/mockData';
import { formatTime, getHealthTip } from '@/lib/utils';

const AQIHistoryChart = dynamic(() => import('@/components/charts/AQIHistoryChart'), { ssr: false });
const PollutantChart = dynamic(() => import('@/components/charts/PollutantChart'), { ssr: false });

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
  const initialCity = searchParams.get('city') || 'Delhi';

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [cityData, setCityData] = useState<AQIData | null>(null);
  const [allCities, setAllCities] = useState<AQIData[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const all = generateAllCitiesAQI();
    setAllCities(all);
    const found = all.find(c => c.city.toLowerCase() === selectedCity.toLowerCase());
    setCityData(found || generateMockAQI(selectedCity));
  }, [selectedCity]);

  if (!cityData) return null;

  const level = AQI_LEVELS[cityData.category];

  return (
    <div className="min-h-screen bg-[#0a0f0d] bg-grid pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-1">Air Quality Dashboard</div>
            <div className="flex items-center gap-3">
              {/* City selector */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 font-display font-800 text-2xl sm:text-3xl text-[#e8f5ee] hover:text-[#00ff88] transition-colors"
                >
                  {selectedCity}
                  <ChevronDown size={18} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-[rgba(0,255,136,0.15)] bg-[#111f17] shadow-lg z-30 max-h-64 overflow-y-auto">
                    {INDIA_CITIES.map(c => (
                      <button key={c.name}
                        onClick={() => { setSelectedCity(c.name); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[rgba(0,255,136,0.06)] ${
                          selectedCity === c.name ? 'text-[#00ff88]' : 'text-[#7ab898]'
                        }`}>
                        {c.name} <span className="text-xs text-[#3d6b52]">— {c.state}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-[#3d6b52] mt-1 font-mono">
              Updated: {formatTime(cityData.timestamp)} · Station: {cityData.station}
            </div>
          </div>

          <AQIBadge aqi={cityData.aqi} size="xl" />
        </div>

        {/* Health tip */}
        <div className="rounded-xl border p-4 mb-6 flex items-start gap-3"
          style={{ borderColor: level.border, background: level.bg }}>
          <div className="text-lg mt-0.5">{level.icon}</div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: level.color }}>{level.label} Air Quality</div>
            <p className="text-sm text-[#e8f5ee]">{getHealthTip(cityData.category)}</p>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: pollutants + charts */}
          <div className="lg:col-span-2 space-y-6">

            {/* Pollutant stats */}
            <div>
              <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Pollutant Breakdown</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { label: 'PM2.5', value: cityData.pm25, unit: 'µg', color: '#00ff88' },
                  { label: 'PM10', value: cityData.pm10, unit: 'µg', color: '#a8ff3e' },
                  { label: 'NO₂', value: cityData.no2, unit: 'µg', color: '#ffb800' },
                  { label: 'SO₂', value: cityData.so2, unit: 'µg', color: '#ff6b00' },
                  { label: 'CO', value: cityData.co, unit: 'mg', color: '#ff4444' },
                  { label: 'O₃', value: cityData.o3, unit: 'µg', color: '#00d4ff' },
                ].map(p => (
                  <StatCard key={p.label} {...p} />
                ))}
              </div>
            </div>

            {/* Pollutant chart */}
            <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
              <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-4">Pollutant Comparison</div>
              <PollutantChart data={cityData} />
            </div>

            {/* History chart */}
            <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
              <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-4">14-day AQI Trend</div>
              <AQIHistoryChart city={selectedCity} />
            </div>

            {/* Flash notes */}
            <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
              <FlashNotes city={selectedCity} />
            </div>
          </div>

          {/* Right: city list + source */}
          <div className="space-y-4">
            {/* Source attribution */}
            <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
              <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Dominant Source</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ffb800]" />
                <span className="text-sm font-display font-600 text-[#e8f5ee]">{cityData.dominantSource}</span>
              </div>
              <p className="text-xs text-[#3d6b52] mt-2 leading-relaxed">
                Based on wind trajectory analysis and emission inventory overlay for {selectedCity} today.
              </p>

              {/* Source breakdown bars */}
              <div className="mt-4 space-y-2">
                {[
                  { label: 'Traffic', pct: 35, color: '#ff6b00' },
                  { label: 'Construction', pct: 25, color: '#ffb800' },
                  { label: 'Burning', pct: 20, color: '#ff4444' },
                  { label: 'Industrial', pct: 15, color: '#cc00ff' },
                  { label: 'Dust', pct: 5, color: '#7ab898' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#7ab898]">{s.label}</span>
                      <span className="font-mono text-[#3d6b52]">{s.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1a2e22] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${s.pct}%`, backgroundColor: s.color, opacity: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other cities */}
            <div>
              <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Other Cities</div>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {allCities.filter(c => c.city !== selectedCity).map(c => (
                  <AQICard
                    key={c.city}
                    {...c}
                    onClick={() => setSelectedCity(c.city)}
                    selected={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center text-[#3d6b52] font-mono text-sm">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
