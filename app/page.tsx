'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wind, Map, AlertTriangle, FileText, Zap, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AQIBadge, AQIScaleBar } from '@/components/ui/AQIBadge';
import { AQIData } from '@/lib/types';
import { generateAllCitiesAQI } from '@/lib/mockData';
import { AQI_LEVELS } from '@/lib/types';

function StatTicker({ cities }: { cities: AQIData[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % cities.length), 2000);
    return () => clearInterval(t);
  }, [cities.length]);
  const city = cities[idx];
  if (!city) return null;
  const level = AQI_LEVELS[city.category];
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span className="text-[#3d6b52]">{city.city}</span>
      <span style={{ color: level.color }}>AQI {city.aqi}</span>
      <span className="text-[#3d6b52]">—</span>
      <span style={{ color: level.color }}>{level.label}</span>
    </div>
  );
}

export default function HomePage() {
  const [allCities, setAllCities] = useState<AQIData[]>([]);
  const [worstCity, setWorstCity] = useState<AQIData | null>(null);
  const [bestCity, setBestCity] = useState<AQIData | null>(null);
  const [alerts, setAlerts] = useState(0);

  useEffect(() => {
    const data = generateAllCitiesAQI();
    setAllCities(data);
    const sorted = [...data].sort((a, b) => b.aqi - a.aqi);
    setWorstCity(sorted[0]);
    setBestCity(sorted[sorted.length - 1]);
    setAlerts(data.filter(c => c.aqi > 200).length);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f0d] bg-grid">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-glow-green opacity-40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          {/* Live ticker */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest">Live across India</span>
            <span className="mx-2 text-[#1a2e22]">|</span>
            {allCities.length > 0 && <StatTicker cities={allCities} />}
          </div>

          {/* Headline */}
          <div className="max-w-4xl">
            <h1 className="font-display font-800 text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-[#e8f5ee] mb-6">
              Every breath
              <br />
              <span className="gradient-text">measured.</span>
              <br />
              Every source
              <br />
              <span className="text-[#1a2e22] relative">
                <span className="absolute inset-0 flex items-center">
                  <span className="gradient-text">exposed.</span>
                </span>
                <span className="opacity-0">exposed.</span>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#7ab898] max-w-xl leading-relaxed mb-8">
              Ward-level AQI for every Indian city. AI-powered pollution source attribution. No hardware — just open data and your phone camera.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00ff88] text-sm font-medium hover:bg-[rgba(0,255,136,0.15)] transition-all hover:shadow-green-glow">
                Open Dashboard <ArrowRight size={14} />
              </Link>
              <Link href="/report" className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#7ab898] text-sm font-medium hover:border-[rgba(0,255,136,0.2)] hover:text-[#e8f5ee] transition-all">
                Report Pollution <FileText size={14} />
              </Link>
            </div>
          </div>

          {/* Live stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-16">
            <div className="rounded-xl border border-[rgba(0,255,136,0.08)] bg-[#111f17] p-4">
              <div className="text-xs font-mono text-[#3d6b52] mb-1">Cities monitored</div>
              <div className="text-2xl font-display font-800 text-[#00ff88]">{allCities.length}</div>
            </div>
            <div className="rounded-xl border border-[rgba(255,68,68,0.12)] bg-[#111f17] p-4">
              <div className="text-xs font-mono text-[#3d6b52] mb-1">Active alerts</div>
              <div className="text-2xl font-display font-800 text-[#ff4444]">{alerts}</div>
            </div>
            {worstCity && (
              <div className="rounded-xl border border-[rgba(255,107,0,0.12)] bg-[#111f17] p-4">
                <div className="text-xs font-mono text-[#3d6b52] mb-1">Most polluted</div>
                <div className="text-sm font-display font-700 text-[#ff6b00]">{worstCity.city}</div>
                <div className="text-xs font-mono text-[#3d6b52]">AQI {worstCity.aqi}</div>
              </div>
            )}
            {bestCity && (
              <div className="rounded-xl border border-[rgba(0,255,136,0.12)] bg-[#111f17] p-4">
                <div className="text-xs font-mono text-[#3d6b52] mb-1">Cleanest air</div>
                <div className="text-sm font-display font-700 text-[#00ff88]">{bestCity.city}</div>
                <div className="text-xs font-mono text-[#3d6b52]">AQI {bestCity.aqi}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AQI Scale */}
      <section className="border-y border-[rgba(0,255,136,0.06)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest whitespace-nowrap">AQI Scale</span>
          <AQIScaleBar />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-2">Platform Features</div>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-[#e8f5ee]">Built for India's air crisis</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Map,
              color: '#00ff88',
              title: 'Live City Map',
              desc: 'Real-time AQI bubbles across 20 Indian cities, updated every 15 minutes from CPCB, SAFAR, and OpenAQ stations.',
              href: '/map',
            },
            {
              icon: Activity,
              color: '#00d4ff',
              title: 'City Dashboard',
              desc: 'Deep-dive into any city: pollutant breakdown, 14-day history, dominant source attribution, and health advisory.',
              href: '/dashboard',
            },
            {
              icon: Zap,
              color: '#ffb800',
              title: 'AI Flash Notes',
              desc: 'Gemini AI generates city-specific health tips, source analysis, and 24-hour outlooks — updated on demand.',
              href: '/dashboard',
            },
            {
              icon: FileText,
              color: '#a8ff3e',
              title: 'Citizen Reports',
              desc: 'Spot a burning pile or construction dust? Submit a geo-tagged report with photo. No sensor needed.',
              href: '/report',
            },
            {
              icon: AlertTriangle,
              color: '#ff4444',
              title: 'AQI Alerts',
              desc: 'Real-time alerts when any city crosses AQI 200. Track which cities are in emergency conditions right now.',
              href: '/alerts',
            },
            {
              icon: TrendingUp,
              color: '#cc00ff',
              title: 'Trend Analytics',
              desc: '14-day historical AQI trends, PM2.5 vs PM10 comparison, and seasonal pollution pattern analysis.',
              href: '/dashboard',
            },
          ].map(({ icon: Icon, color, title, desc, href }) => (
            <Link key={title} href={href} className="group rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-5 hover:border-[rgba(0,255,136,0.2)] transition-all">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-all group-hover:scale-110"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <h3 className="font-display font-600 text-sm text-[#e8f5ee] mb-1.5">{title}</h3>
              <p className="text-xs text-[#3d6b52] leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                Explore <ArrowRight size={10} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* City Grid Preview */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-1">Live Snapshot</div>
            <h2 className="font-display font-700 text-xl text-[#e8f5ee]">Cities right now</h2>
          </div>
          <Link href="/dashboard" className="text-xs text-[#00ff88] hover:underline flex items-center gap-1">
            View all <ArrowRight size={10} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {allCities.slice(0, 10).map(city => {
            const level = AQI_LEVELS[city.category];
            return (
              <Link href={`/dashboard?city=${city.city}`} key={city.city}
                className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-3 hover:border-[rgba(0,255,136,0.2)] transition-all text-center">
                <div className="text-xs font-display font-600 text-[#e8f5ee] mb-2">{city.city}</div>
                <div className="text-xl font-display font-800" style={{ color: level.color }}>{city.aqi}</div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: level.color }}>{level.label}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Data sources */}
      <section className="py-12 border-t border-[rgba(0,255,136,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-6 text-center">Powered by open data</div>
          <div className="flex flex-wrap justify-center gap-4">
            {['CPCB CAAQMS', 'OpenAQ API', 'NASA MODIS', 'Copernicus CAMS', 'IMD Weather', 'SAFAR IITM', 'Gemini AI'].map(src => (
              <div key={src} className="px-3 py-1.5 rounded-md border border-[rgba(0,255,136,0.08)] text-xs font-mono text-[#3d6b52]">
                {src}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
