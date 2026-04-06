'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { ChevronLeft, Leaf, Shield, Zap, Users, LayoutGrid, GavelIcon } from 'lucide-react';

const solutions = [
  {
    title: 'Personal Protection',
    icon: Shield,
    color: '#00ff88',
    items: [
      {
        name: 'N95 Masks',
        description: 'Wear certified N95 or N99 masks when AQI exceeds 150. Ensure proper fit for maximum protection.',
        tips: ['Check expiry date', 'Ensure proper fit', 'Replace after 8-10 hours of use'],
      },
      {
        name: 'Air Purifiers',
        description: 'Use HEPA filter-based air purifiers indoors. Place in bedrooms and living areas.',
        tips: ['Look for CADR ratings', 'Replace filters every 3-6 months', 'Keep doors closed while using'],
      },
      {
        name: 'Indoor Plants',
        description: 'Plants like peace lily, snake plant, and spider plant can reduce indoor pollution by 10-15%.',
        tips: ['Use with air purifiers for better results', 'Keep plants healthy', 'Place in multiple rooms'],
      },
    ],
  },
  {
    title: 'Lifestyle Changes',
    icon: Zap,
    color: '#a8ff3e',
    items: [
      {
        name: 'Outdoor Activity Planning',
        description: 'Check AQI before planning outdoor activities. Prefer morning hours (6-10 AM) when AQI is usually lower.',
        tips: ['Download Vayu Sainik app for real-time updates', 'Avoid peak evening hours', 'Plan indoor activities when AQI > 200'],
      },
      {
        name: 'Transport Choices',
        description: 'Use public transport, carpooling, or cycle when possible. Reduce personal vehicle use.',
        tips: ['Use public transport 2-3 days per week', 'Cycle on low-AQI days', 'Work from home when AQI is high'],
      },
      {
        name: 'Healthy Habits',
        description: 'Stay hydrated, exercise indoors on bad air days, and maintain healthy immunity.',
        tips: ['Drink 2-3 liters water daily', 'Use air purifier during exercise', 'Take Vitamin D supplements'],
      },
    ],
  },
  {
    title: 'Home & Workplace',
    icon: Leaf,
    color: '#ffb800',
    items: [
      {
        name: 'Indoor Air Quality',
        description: 'Maintain good indoor air quality by proper ventilation and air purification.',
        tips: ['Seal window gaps', 'Use door gaskets', 'Install air purifiers in high-traffic areas'],
      },
      {
        name: 'Cooking Safety',
        description: 'Cooking generates significant pollution. Use exhaust fans and keep kitchen well-ventilated.',
        tips: ['Use exhaust fans while cooking', 'Cook with lids on vessels', 'Keep kitchen doors open'],
      },
      {
        name: 'Cleaning Practices',
        description: 'Use wet mops instead of dry dusting. Avoid burning incense or candles when AQI is high.',
        tips: ['Use wet mops', 'Avoid aerosol sprays', 'Use natural air fresheners'],
      },
    ],
  },
  {
    title: 'Community Action',
    icon: Users,
    color: '#00d4ff',
    items: [
      {
        name: 'Awareness & Education',
        description: 'Share knowledge about air quality with family and community. Report pollution sources.',
        tips: ['Share AQI data with friends', 'Attend community health programs', 'Report pollution incidents'],
      },
      {
        name: 'Tree Plantation',
        description: 'Plant trees in your community. Trees act as natural air purifiers and reduce pollution by 10-15%.',
        tips: ['Plant native species', 'Organize community drives', 'Maintain planted trees'],
      },
      {
        name: 'Advocacy',
        description: 'Support policies promoting clean energy, pollution control, and public transport.',
        tips: ['Join environmental groups', 'Support emissions reduction targets', 'Vote for clean policies'],
      },
    ],
  },
];

export default function SolutionsPage() {
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
          <h1 className="text-4xl font-display font-800 text-[#e8f5ee] mb-4">Solutions & Prevention</h1>
          <p className="text-[#7ab898] font-mono text-sm max-w-3xl">
            Practical steps you can take to reduce exposure to air pollution and improve air quality. From personal protection to
            community action.
          </p>
        </div>

        {/* Solutions by Category */}
        <div className="space-y-12">
          {solutions.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}>
                    <Icon size={20} style={{ color: category.color }} />
                  </div>
                  <h2 className="text-2xl font-display font-700 text-[#e8f5ee]">{category.title}</h2>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((item, i) => (
                    <div key={i} className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-6 hover:border-[rgba(0,255,136,0.15)] transition-all">
                      <h3 className="text-lg font-display font-700 text-[#e8f5ee] mb-2">{item.name}</h3>
                      <p className="text-sm text-[#7ab898] font-mono mb-4">{item.description}</p>

                      {/* Tips */}
                      <div className="border-t border-[rgba(0,255,136,0.06)] pt-4">
                        <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Quick Tips</div>
                        <ul className="space-y-2">
                          {item.tips.map((tip, j) => (
                            <li key={j} className="text-xs text-[#7ab898] font-mono flex items-start gap-2">
                              <span style={{ color: category.color }}>→</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Government Resources */}
        <div className="mt-16 bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <GavelIcon size={20} className="text-[#00ff88]" />
            <h2 className="text-xl font-display font-700 text-[#e8f5ee]">Government Resources & Schemes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-2 border-[#00ff88] pl-4">
              <h3 className="font-display font-600 text-[#e8f5ee] mb-2">CPCB Data Portal</h3>
              <p className="text-sm text-[#7ab898] font-mono mb-3">
                Real-time air quality data from CPCB (Central Pollution Control Board).
              </p>
              <a
                href="https://www.cpcb.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#00ff88] font-mono hover:text-[#e8f5ee] transition-colors">
                Visit CPCB →
              </a>
            </div>

            <div className="border-l-2 border-[#a8ff3e] pl-4">
              <h3 className="font-display font-600 text-[#e8f5ee] mb-2">National Action Plan</h3>
              <p className="text-sm text-[#7ab898] font-mono mb-3">
                Government&apos;s National Clean Air Programme (NCAP) for pollution reduction.
              </p>
              <a
                href="https://ncap.eletsonline.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a8ff3e] font-mono hover:text-[#e8f5ee] transition-colors">
                Learn about NCAP →
              </a>
            </div>

            <div className="border-l-2 border-[#ffb800] pl-4">
              <h3 className="font-display font-600 text-[#e8f5ee] mb-2">Green Subsidies</h3>
              <p className="text-sm text-[#7ab898] font-mono mb-3">
                Government schemes for electric vehicles, air purifiers, and solar panels.
              </p>
              <p className="text-xs text-[#3d6b52] font-mono">Contact your local pollution control board for details</p>
            </div>

            <div className="border-l-2 border-[#00d4ff] pl-4">
              <h3 className="font-display font-600 text-[#e8f5ee] mb-2">NGOs & Community Groups</h3>
              <p className="text-sm text-[#7ab898] font-mono mb-3">
                Join local environmental organizations working on air quality improvements.
              </p>
              <p className="text-xs text-[#3d6b52] font-mono">Search for environmental NGOs in your area</p>
            </div>
          </div>
        </div>

        {/* Action Checklist */}
        <div className="mt-12 bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)] rounded-lg p-8">
          <h2 className="text-xl font-display font-700 text-[#00ff88] mb-6">Personal Action Checklist</h2>
          <div className="space-y-3">
            {[
              'Install HEPA air purifier in bedroom',
              'Stock up on N95 masks before pollution season',
              'Download Vayu Sainik for real-time AQI monitoring',
              'Plan outdoor activities based on AQI forecasts',
              'Maintain good indoor ventilation',
              'Switch to public transport 2-3 days per week',
              'Plant 2-3 trees in your community',
              'Share AQI information with friends and family',
              'Support clean energy and pollution reduction policies',
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 accent-[#00ff88]" />
                <span className="text-sm text-[#7ab898] font-mono group-hover:text-[#e8f5ee] transition-colors">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Link
            href="/education"
            className="px-6 py-3 rounded-lg bg-[#111f17] border border-[rgba(0,255,136,0.06)] text-[#7ab898] hover:text-[#00ff88] font-mono text-sm transition-colors">
            ← Back
          </Link>
        </div>
      </main>
    </div>
  );
}
