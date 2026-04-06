'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { HEALTH_ADVISORY_BY_AQI } from '@/lib/aqi-scales';
import { ChevronLeft, Heart, Users, Activity, TrendingDown } from 'lucide-react';

const AQI_CATEGORIES = ['GOOD', 'SATISFACTORY', 'MODERATELY_POLLUTED', 'POOR', 'VERY_POOR', 'SEVERE'] as const;

const categoryInfo = {
  GOOD: { range: '0-50', color: '#00ff88', bgColor: 'rgba(0, 255, 136, 0.1)' },
  SATISFACTORY: { range: '51-100', color: '#a8ff3e', bgColor: 'rgba(168, 255, 62, 0.1)' },
  MODERATELY_POLLUTED: { range: '101-200', color: '#ffb800', bgColor: 'rgba(255, 184, 0, 0.1)' },
  POOR: { range: '201-300', color: '#ff6b00', bgColor: 'rgba(255, 107, 0, 0.1)' },
  VERY_POOR: { range: '301-400', color: '#cc00ff', bgColor: 'rgba(204, 0, 255, 0.1)' },
  SEVERE: { range: '401-500+', color: '#cc0000', bgColor: 'rgba(204, 0, 0, 0.1)' },
};

export default function HealthImpactsPage() {
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
          <h1 className="text-4xl font-display font-800 text-[#e8f5ee] mb-4">Health Impacts of Air Pollution</h1>
          <p className="text-[#7ab898] font-mono text-sm max-w-3xl">
            Understand how different air quality levels affect your health and what actions to take. Get personalized health
            advisories based on AQI.
          </p>
        </div>

        {/* Health Advisories by AQI */}
        <div className="space-y-6">
          {AQI_CATEGORIES.map((category) => {
            const advisory = HEALTH_ADVISORY_BY_AQI[category];
            const info = categoryInfo[category];

            return (
              <div
                key={category}
                className="bg-[#111f17] border rounded-lg p-8 transition-all hover:border-opacity-100"
                style={{ borderColor: `${info.color}40` }}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center font-display font-800 text-xs"
                      style={{ backgroundColor: info.bgColor, color: info.color }}>
                      {advisory.aqiRange}
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-700 mb-1" style={{ color: info.color }}>
                        {category === 'GOOD'
                          ? 'Good'
                          : category === 'SATISFACTORY'
                            ? 'Satisfactory'
                            : category === 'MODERATELY_POLLUTED'
                              ? 'Moderately Polluted'
                              : category === 'POOR'
                                ? 'Poor'
                                : category === 'VERY_POOR'
                                  ? 'Very Poor'
                                  : 'Severe'}
                      </h2>
                      <p className="text-xs font-mono text-[#3d6b52]">AQI: {advisory.aqiRange}</p>
                    </div>
                  </div>
                </div>

                {/* Health Impacts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* General Population */}
                  <div className="border-l-2" style={{ borderColor: info.color }}>
                    <div className="flex items-center gap-2 mb-3 pl-4">
                      <Users size={16} style={{ color: info.color }} />
                      <h3 className="font-display font-600 text-[#e8f5ee]">General Population</h3>
                    </div>
                    <p className="text-sm text-[#7ab898] font-mono pl-4">{advisory.generalPopulation}</p>
                  </div>

                  {/* Children & Elderly */}
                  <div className="border-l-2" style={{ borderColor: info.color }}>
                    <div className="flex items-center gap-2 mb-3 pl-4">
                      <Activity size={16} style={{ color: info.color }} />
                      <h3 className="font-display font-600 text-[#e8f5ee]">Children & Elderly</h3>
                    </div>
                    <p className="text-sm text-[#7ab898] font-mono pl-4">
                      {['GOOD', 'SATISFACTORY', 'MODERATELY_POLLUTED'].includes(category) ? advisory.children : advisory.elderly}
                    </p>
                  </div>

                  {/* Respiratory Conditions */}
                  <div className="border-l-2" style={{ borderColor: info.color }}>
                    <div className="flex items-center gap-2 mb-3 pl-4">
                      <Heart size={16} style={{ color: info.color }} />
                      <h3 className="font-display font-600 text-[#e8f5ee]">Respiratory Conditions</h3>
                    </div>
                    <p className="text-sm text-[#7ab898] font-mono pl-4">{advisory.respiratoryDisease}</p>
                  </div>

                  {/* Cardiovascular Conditions */}
                  <div className="border-l-2" style={{ borderColor: info.color }}>
                    <div className="flex items-center gap-2 mb-3 pl-4">
                      <Heart size={16} style={{ color: info.color }} />
                      <h3 className="font-display font-600 text-[#e8f5ee]">Heart Conditions</h3>
                    </div>
                    <p className="text-sm text-[#7ab898] font-mono pl-4">{advisory.cardiovascularDisease}</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="border-t border-[rgba(0,255,136,0.06)] pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown size={16} style={{ color: info.color }} />
                    <h3 className="font-display font-600 text-[#e8f5ee]">What Should You Do?</h3>
                  </div>
                  <ul className="space-y-2">
                    {advisory.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-sm text-[#7ab898] font-mono flex items-start gap-3">
                        <span style={{ color: info.color }}>✓</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Information */}
        <div className="mt-12 bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)] rounded-lg p-8">
          <h2 className="text-xl font-display font-700 text-[#00ff88] mb-6">Important Health Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-display font-600 text-[#e8f5ee] mb-2">Who is Most Vulnerable?</h3>
              <p className="text-sm text-[#7ab898] font-mono">
                Children (under 14), elderly (above 65), people with asthma, and those with heart disease are most vulnerable to air
                pollution. Pregnant women should also take extra precautions.
              </p>
            </div>
            <div>
              <h3 className="font-display font-600 text-[#e8f5ee] mb-2">Long-term Effects</h3>
              <p className="text-sm text-[#7ab898] font-mono">
                Prolonged exposure to bad air quality can lead to chronic diseases, reduced life expectancy, and permanent lung
                damage, especially in children.
              </p>
            </div>
            <div>
              <h3 className="font-display font-600 text-[#e8f5ee] mb-2">When to Seek Help?</h3>
              <p className="text-sm text-[#7ab898] font-mono">
                If you experience persistent coughing, difficulty breathing, chest pain, or other severe symptoms, seek immediate
                medical attention regardless of AQI levels.
              </p>
            </div>
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
            href="/education/solutions"
            className="px-6 py-3 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.25)] text-[#00ff88] font-mono text-sm transition-colors">
            View Solutions →
          </Link>
        </div>
      </main>
    </div>
  );
}
