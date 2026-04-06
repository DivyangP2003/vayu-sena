'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, Bell, RefreshCw, Clock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AQIData, AQI_LEVELS } from '@/lib/types';
import { generateAllCitiesAQI, MOCK_REPORTS } from '@/lib/mockData';
import { AQIBadge } from '@/components/ui/AQIBadge';
import { formatTime, timeAgo, getHealthTip } from '@/lib/utils';

export default function AlertsPage() {
  const [cities, setCities] = useState<AQIData[]>([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    setRefreshing(true);
    const data = generateAllCitiesAQI();
    setCities(data.sort((a, b) => b.aqi - a.aqi));
    setLastUpdated(new Date().toISOString());
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, []);

  const severe = cities.filter(c => c.aqi > 300);
  const poor = cities.filter(c => c.aqi > 200 && c.aqi <= 300);
  const moderate = cities.filter(c => c.aqi > 100 && c.aqi <= 200);

  return (
    <div className="min-h-screen bg-[#0a0f0d] bg-grid pt-14">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-1">Real-time Monitoring</div>
            <h1 className="font-display font-800 text-3xl text-[#e8f5ee] flex items-center gap-2">
              <AlertTriangle size={24} className="text-[#ff4444]" />
              AQI Alerts
            </h1>
            {lastUpdated && (
              <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-[#3d6b52]">
                <Clock size={10} />
                Updated {formatTime(lastUpdated)} · Auto-refreshes every 60s
              </div>
            )}
          </div>
          <button onClick={load} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(0,255,136,0.15)] bg-[#111f17] text-xs text-[#7ab898] hover:text-[#e8f5ee] hover:border-[rgba(0,255,136,0.3)] transition-all disabled:opacity-50">
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Severe / Very Poor', count: severe.length, color: '#ff4444', bg: 'rgba(255,68,68,0.08)', border: 'rgba(255,68,68,0.2)' },
            { label: 'Poor', count: poor.length, color: '#ff6b00', bg: 'rgba(255,107,0,0.08)', border: 'rgba(255,107,0,0.2)' },
            { label: 'Moderate', count: moderate.length, color: '#ffb800', bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.2)' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-4 text-center"
              style={{ borderColor: s.border, background: s.bg }}>
              <div className="text-2xl font-display font-800" style={{ color: s.color }}>{s.count}</div>
              <div className="text-xs font-mono mt-1" style={{ color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Severe alerts */}
        {severe.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#ff4444] animate-pulse" />
              <h2 className="text-sm font-mono text-[#ff4444] uppercase tracking-widest">Emergency — AQI 300+</h2>
            </div>
            <div className="space-y-3">
              {severe.map(city => {
                const level = AQI_LEVELS[city.category];
                return (
                  <div key={city.city} className="rounded-xl border border-[rgba(255,68,68,0.25)] bg-[rgba(255,68,68,0.05)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AQIBadge aqi={city.aqi} size="sm" showLabel={false} />
                        <div>
                          <div className="font-display font-700 text-[#e8f5ee]">{city.city}, {city.state}</div>
                          <div className="text-xs font-mono text-[#ff4444]">{level.label} · Source: {city.dominantSource}</div>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-[#3d6b52]">PM2.5</div>
                        <div className="text-sm font-mono text-[#ff4444]">{city.pm25} µg</div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 rounded-lg bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.15)]">
                      <p className="text-xs text-[#ff4444]">⚠ {getHealthTip(city.category)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Poor */}
        {poor.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#ff6b00]" />
              <h2 className="text-sm font-mono text-[#ff6b00] uppercase tracking-widest">Poor Air Quality — AQI 201–300</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {poor.map(city => {
                const level = AQI_LEVELS[city.category];
                return (
                  <div key={city.city} className="rounded-xl border border-[rgba(255,107,0,0.15)] bg-[#111f17] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display font-600 text-sm text-[#e8f5ee]">{city.city}</div>
                        <div className="text-xs text-[#3d6b52]">{city.state}</div>
                      </div>
                      <div className="text-xl font-display font-800" style={{ color: level.color }}>{city.aqi}</div>
                    </div>
                    <div className="mt-2 text-xs text-[#7ab898]">{city.dominantSource}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* All cities table */}
        <section>
          <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">All Cities — Ranked by AQI</div>
          <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] overflow-hidden">
            <div className="grid grid-cols-5 px-4 py-2 border-b border-[rgba(0,255,136,0.07)] text-[10px] font-mono text-[#3d6b52] uppercase tracking-widest">
              <span className="col-span-2">City</span>
              <span>AQI</span>
              <span>PM2.5</span>
              <span>Status</span>
            </div>
            {cities.map((city, i) => {
              const level = AQI_LEVELS[city.category];
              return (
                <div key={city.city}
                  className={`grid grid-cols-5 px-4 py-2.5 text-sm border-b border-[rgba(0,255,136,0.04)] last:border-0 hover:bg-[rgba(0,255,136,0.02)] transition-colors`}>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-xs font-mono text-[#3d6b52] w-5">{i + 1}</span>
                    <span className="text-[#e8f5ee] font-display font-500">{city.city}</span>
                  </div>
                  <span className="font-mono font-600" style={{ color: level.color }}>{city.aqi}</span>
                  <span className="font-mono text-[#7ab898] text-xs">{city.pm25}</span>
                  <span className="text-xs font-mono" style={{ color: level.color }}>{level.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent community reports */}
        <section className="mt-8">
          <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Recent Community Reports</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_REPORTS.slice(0, 4).map(r => (
              <div key={r.id} className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{r.sourceType === 'burning' ? '🔥' : r.sourceType === 'construction' ? '🏗️' : r.sourceType === 'traffic' ? '🚗' : '🏭'}</span>
                    <span className="text-xs font-display font-600 text-[#e8f5ee]">{r.city}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    r.status === 'verified' ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88]' : 'bg-[rgba(255,184,0,0.1)] text-[#ffb800]'
                  }`}>{r.status}</span>
                </div>
                <p className="text-xs text-[#7ab898] line-clamp-2 mb-2">{r.description}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#3d6b52]">
                  <span>{timeAgo(r.timestamp)}</span>
                  <span>↑ {r.upvotes} verified</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
