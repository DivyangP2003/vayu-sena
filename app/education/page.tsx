'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { BookOpen, Droplets, AlertTriangle, Leaf, Heart, TrendingDown } from 'lucide-react';

const educationResources = [
  {
    id: 'aqi-scales',
    title: 'AQI Scales & Categories',
    description: 'Understand AQI levels, health effects, and recommendations for each category',
    icon: TrendingDown,
    color: '#00ff88',
    href: '/education/aqi-scales',
  },
  {
    id: 'pollutants',
    title: 'Pollutants Guide',
    description: 'Learn about major air pollutants - their sources, effects, and safe levels',
    icon: Droplets,
    color: '#a8ff3e',
    href: '/education/pollutants',
  },
  {
    id: 'health-impacts',
    title: 'Health Impacts',
    description: 'Detailed information on how air pollution affects your health',
    icon: Heart,
    color: '#00d4ff',
    href: '/education/health-impacts',
  },
  {
    id: 'solutions',
    title: 'Solutions & Prevention',
    description: 'Practical steps to reduce exposure and improve air quality',
    icon: Leaf,
    color: '#ff6b00',
    href: '/education/solutions',
  },
];

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col pt-14">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center">
              <BookOpen size={16} className="text-[#00ff88]" />
            </div>
            <h1 className="text-4xl font-display font-800 text-[#e8f5ee]">
              Air Quality <span className="text-[#00ff88]">Education</span>
            </h1>
          </div>
          <p className="text-[#7ab898] font-mono text-sm max-w-2xl">
            Understand air quality, pollution, and how to protect yourself. Comprehensive guides about AQI, pollutants,
            and health impacts.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Pollutants Tracked', value: '7', icon: '💨' },
            { label: 'Health Categories', value: '6', icon: '🏥' },
            { label: 'AQI Standards', value: '2', icon: '📊' },
            { label: 'Prevention Tips', value: '50+', icon: '✓' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-4">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-sm font-display font-700 text-[#e8f5ee]">{stat.value}</div>
              <div className="text-xs font-mono text-[#3d6b52]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {educationResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link key={resource.id} href={resource.href}>
                <div className="group h-full bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-6 hover:border-[rgba(0,255,136,0.2)] transition-all cursor-pointer hover:bg-[#0f1a17]">
                  <div
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${resource.color}20` }}>
                    <Icon size={24} style={{ color: resource.color }} />
                  </div>
                  <h3 className="text-lg font-display font-700 text-[#e8f5ee] mb-2 group-hover:text-[#00ff88] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-[#7ab898] font-mono">{resource.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Key Takeaways */}
        <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-8">
          <h2 className="text-xl font-display font-700 text-[#e8f5ee] mb-6">Key Takeaways</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Monitor AQI',
                text: 'Check air quality daily using Vayu Sainik. AQI above 100 requires precautions.',
              },
              {
                title: 'Protect Yourself',
                text: 'Use N95 masks, air purifiers, and avoid outdoor activities when AQI is poor.',
              },
              {
                title: 'Take Action',
                text: 'Support clean energy, use public transport, and advocate for pollution reduction.',
              },
            ].map((item, i) => (
              <div key={i}>
                <h3 className="font-display font-700 text-[#00ff88] mb-2">{item.title}</h3>
                <p className="text-sm text-[#7ab898] font-mono">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
