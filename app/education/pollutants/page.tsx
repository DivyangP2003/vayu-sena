'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { POLLUTANT_INFO } from '@/lib/aqi-scales';
import { ChevronLeft, Factory, TrendingUp, AlertTriangle, Droplet } from 'lucide-react';

const POLLUTANTS = ['PM25', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'NH3'] as const;

export default function PollutantsPage() {
  const [selectedPollutant, setSelectedPollutant] = useState<typeof POLLUTANTS[number]>('PM25');
  const pollutant = POLLUTANT_INFO[selectedPollutant];

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col pt-14">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Back Button */}
        <Link
          href="/education"
          className="inline-flex items-center gap-2 text-[#7ab898] hover:text-[#00ff88] font-mono text-sm mb-8 transition-colors">
          <ChevronLeft size={16} />
          Back to Education
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-800 text-[#e8f5ee] mb-4">Air Pollutants Guide</h1>
          <p className="text-[#7ab898] font-mono text-sm max-w-3xl">
            Learn about the major air pollutants, their sources, health impacts, and safe levels. Understanding each pollutant
            helps you protect your health.
          </p>
        </div>

        {/* Pollutant Selector */}
        <div className="mb-12">
          <div className="text-sm font-mono text-[#3d6b52] uppercase tracking-widest mb-4">Select Pollutant</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {POLLUTANTS.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPollutant(p)}
                className={`px-4 py-3 rounded-lg font-mono text-sm font-600 transition-all text-center ${
                  selectedPollutant === p
                    ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.25)] text-[#00ff88]'
                    : 'bg-[#111f17] border border-[rgba(0,255,136,0.06)] text-[#7ab898] hover:border-[rgba(0,255,136,0.15)]'
                }`}>
                {p === 'PM25' ? 'PM2.5' : p === 'NO2' ? 'NO₂' : p === 'SO2' ? 'SO₂' : p === 'O3' ? 'O₃' : p === 'NH3' ? 'NH₃' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Pollutant Details */}
        <div className="space-y-8">
          {/* Overview */}
          <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-8">
            <h2 className="text-2xl font-display font-700 text-[#00ff88] mb-4">{pollutant.name}</h2>
            <p className="text-sm text-[#7ab898] font-mono mb-4">{pollutant.fullName}</p>
            <p className="text-base text-[#e8f5ee] leading-relaxed mb-4">{pollutant.description}</p>
            <div className="flex items-center gap-4 pt-4 border-t border-[rgba(0,255,136,0.06)]">
              <div>
                <div className="text-xs font-mono text-[#3d6b52] uppercase mb-1">Unit of Measurement</div>
                <div className="text-lg font-display font-700 text-[#00ff88]">{pollutant.unit}</div>
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Factory size={20} className="text-[#a8ff3e]" />
              <h3 className="text-xl font-display font-700 text-[#e8f5ee]">Sources</h3>
            </div>
            <ul className="space-y-2">
              {pollutant.sources.map((source, i) => (
                <li key={i} className="text-sm text-[#7ab898] font-mono flex items-start gap-3">
                  <span className="text-[#a8ff3e] flex-shrink-0">▪</span>
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Health Effects */}
          <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={20} className="text-[#ff6b00]" />
              <h3 className="text-xl font-display font-700 text-[#e8f5ee]">Health Effects</h3>
            </div>
            <ul className="space-y-2">
              {pollutant.healthEffects.map((effect, i) => (
                <li key={i} className="text-sm text-[#7ab898] font-mono flex items-start gap-3">
                  <span className="text-[#ff6b00] flex-shrink-0">⚠</span>
                  <span>{effect}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safe Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp size={20} className="text-[#00ff88]" />
                <h4 className="font-display font-700 text-[#e8f5ee]">WHO Recommendation</h4>
              </div>
              <p className="text-sm text-[#7ab898] font-mono">{pollutant.safeLevel}</p>
            </div>

            <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Droplet size={20} className="text-[#00d4ff]" />
                <h4 className="font-display font-700 text-[#e8f5ee]">CPCB Standard</h4>
              </div>
              <p className="text-sm text-[#7ab898] font-mono">{pollutant.standardLevel}</p>
            </div>
          </div>

          {/* Context */}
          <div className="bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)] rounded-lg p-6">
            <p className="text-sm text-[#7ab898] font-mono">
              <span className="text-[#00ff88] font-display font-700">Note:</span> Different regions and countries have different
              standards. CPCB standards are designed for Indian conditions. WHO recommendations represent the most stringent
              guidelines for public health.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Link
            href="/education"
            className="px-6 py-3 rounded-lg bg-[#111f17] border border-[rgba(0,255,136,0.06)] text-[#7ab898] hover:text-[#00ff88] font-mono text-sm transition-colors">
            ← Back
          </Link>
          <Link
            href="/education/aqi-scales"
            className="px-6 py-3 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.25)] text-[#00ff88] font-mono text-sm transition-colors">
            View AQI Scales →
          </Link>
        </div>
      </main>
    </div>
  );
}
