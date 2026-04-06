'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { AQI_SCALE_INFO } from '@/lib/aqi-scales';
import { ChevronLeft, AlertTriangle, Users, Lightbulb } from 'lucide-react';

export default function AQIScalesPage() {
  const [selectedStandard, setSelectedStandard] = useState<'CPCB' | 'US_EPA'>('CPCB');
  const scaleInfo = AQI_SCALE_INFO[selectedStandard];

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col pt-14">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Back Button */}
        <Link href="/education" className="inline-flex items-center gap-2 text-[#7ab898] hover:text-[#00ff88] font-mono text-sm mb-8 transition-colors">
          <ChevronLeft size={16} />
          Back to Education
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-800 text-[#e8f5ee] mb-4">AQI Scales & Categories</h1>
          <p className="text-[#7ab898] font-mono text-sm max-w-3xl">
            Understanding the Air Quality Index (AQI) and how it affects your health. Learn about different standards and
            what each category means for you.
          </p>
        </div>

        {/* Standard Selector */}
        <div className="mb-12">
          <div className="text-sm font-mono text-[#3d6b52] uppercase tracking-widest mb-4">Select Standard</div>
          <div className="flex gap-4">
            {(['CPCB', 'US_EPA'] as const).map((std) => (
              <button
                key={std}
                onClick={() => setSelectedStandard(std)}
                className={`px-6 py-3 rounded-lg font-mono text-sm font-600 transition-all ${
                  selectedStandard === std
                    ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.25)] text-[#00ff88]'
                    : 'bg-[#111f17] border border-[rgba(0,255,136,0.06)] text-[#7ab898] hover:border-[rgba(0,255,136,0.15)]'
                }`}>
                {std === 'CPCB' ? 'CPCB (India)' : 'US EPA Standard'}
              </button>
            ))}
          </div>
        </div>

        {/* Scale Info */}
        <div className="mb-12">
          <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-display font-700 text-[#e8f5ee] mb-2">{scaleInfo.name}</h2>
            <p className="text-[#7ab898] font-mono text-sm">{scaleInfo.description}</p>
          </div>

          {/* Scale Levels */}
          <div className="space-y-4">
            {scaleInfo.levels.map((level, idx) => (
              <div
                key={idx}
                className="bg-[#111f17] border rounded-lg p-6 transition-all hover:border-[rgba(0,255,136,0.15)]"
                style={{ borderColor: `${level.color}30` }}>
                {/* Level Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-display font-800 text-sm"
                      style={{ backgroundColor: level.bgColor, color: level.color }}>
                      {level.range[0]}-{level.range[1]}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-700" style={{ color: level.color }}>
                        {level.label}
                      </h3>
                      <p className="text-xs font-mono text-[#3d6b52]">AQI Range: {level.range[0]}-{level.range[1]}</p>
                    </div>
                  </div>
                </div>

                {/* Health Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Health Effects */}
                  <div className="border-t border-[rgba(0,255,136,0.06)] pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={16} style={{ color: level.color }} />
                      <h4 className="font-display font-600 text-[#e8f5ee]">Health Effects</h4>
                    </div>
                    <p className="text-sm text-[#7ab898] font-mono">{level.health}</p>
                  </div>

                  {/* Sensitive Groups */}
                  <div className="border-t border-[rgba(0,255,136,0.06)] pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={16} style={{ color: level.color }} />
                      <h4 className="font-display font-600 text-[#e8f5ee]">Sensitive Groups</h4>
                    </div>
                    <p className="text-sm text-[#7ab898] font-mono">{level.sensitiveGroups}</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="border-t border-[rgba(0,255,136,0.06)] mt-4 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} style={{ color: level.color }} />
                    <h4 className="font-display font-600 text-[#e8f5ee]">Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {level.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-[#7ab898] font-mono flex items-start gap-2">
                        <span style={{ color: level.color }}>→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-8">
          <h2 className="text-xl font-display font-700 text-[#e8f5ee] mb-6">Important Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-display font-600 text-[#00ff88] mb-2">What is AQI?</h3>
              <p className="text-sm text-[#7ab898] font-mono">
                The Air Quality Index (AQI) is a simple number (0-500+) that tells you how clean or unhealthy the air is. Higher
                numbers mean worse air quality.
              </p>
            </div>
            <div>
              <h3 className="font-display font-600 text-[#00ff88] mb-2">How is AQI Calculated?</h3>
              <p className="text-sm text-[#7ab898] font-mono">
                AQI is calculated based on concentrations of five major pollutants: PM2.5, PM10, NO₂, SO₂, and CO. The highest
                AQI value among these pollutants is reported as the overall AQI.
              </p>
            </div>
            <div>
              <h3 className="font-display font-600 text-[#00ff88] mb-2">Why CPCB Standard?</h3>
              <p className="text-sm text-[#7ab898] font-mono">
                CPCB (Central Pollution Control Board) is India&apos;s official standard. It&apos;s designed specifically for Indian climate
                and pollution patterns. We also show US EPA for reference and international comparison.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
