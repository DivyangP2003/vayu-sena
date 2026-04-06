import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Wind, Database, Brain, Users, Github, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] bg-grid pt-14">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">

        <div className="mb-14">
          <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-2">About the Project</div>
          <h1 className="font-display font-800 text-4xl sm:text-5xl text-[#e8f5ee] leading-tight mb-4">
            Vayu Sainik<br />
            <span className="gradient-text">Air Intelligence for India</span>
          </h1>
          <p className="text-[#7ab898] text-base leading-relaxed max-w-2xl">
            India has fewer than 1,000 CPCB monitoring stations for 1.4 billion people. Most Indian cities and all rural areas have no real-time AQI data. Vayu Sainik bridges this gap using open satellite data, AI interpolation, and citizen science — making air quality intelligence accessible to every Indian, without a single hardware sensor.
          </p>
        </div>

        {/* How it works */}
        <section className="mb-12">
          <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-6">How It Works — Three Data Layers</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                num: '01',
                icon: Database,
                color: '#00ff88',
                title: 'Satellite Layer',
                desc: 'NASA MODIS MAIAC aerosol optical depth data provides national coverage daily at ~1km resolution. Copernicus CAMS adds NO₂, SO₂ and PM forecasts. This is the backbone for cities with no ground stations.',
              },
              {
                num: '02',
                icon: Wind,
                color: '#00d4ff',
                title: 'Ground Truth Layer',
                desc: 'CPCB CAAQMS real-time station data (via OpenAQ API) calibrates the satellite model. SAFAR adds forecasts for Delhi, Mumbai, Pune and Ahmedabad. IMD wind data drives source attribution.',
              },
              {
                num: '03',
                icon: Users,
                color: '#ffb800',
                title: 'Citizen Layer',
                desc: 'Community geo-tagged pollution reports fill micro-scale gaps. Photo-based PM estimation (CNN model) enables sensor-free readings from any smartphone camera in India.',
              },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-[#3d6b52]">{s.num}</span>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                      <Icon size={13} style={{ color: s.color }} />
                    </div>
                  </div>
                  <h3 className="font-display font-700 text-sm text-[#e8f5ee] mb-2">{s.title}</h3>
                  <p className="text-xs text-[#3d6b52] leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Section */}
        <section className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-[#cc00ff]" />
            <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest">AI/ML Models</div>
          </div>
          <div className="space-y-4">
            {[
              {
                name: 'PM2.5 Spatial Interpolation',
                tech: 'XGBoost / LightGBM',
                desc: 'Predicts PM2.5 at any lat/lon from sparse sensor data + satellite AOD. Trained on 8 years of CPCB historical data across 800 stations.',
              },
              {
                name: 'Photo → PM Estimation',
                tech: 'MobileNetV3 CNN',
                desc: 'Estimates PM2.5 from sky photos. Extracts haze features, dark channel prior, and contrast ratio. Enables sensor-free readings from any phone camera.',
              },
              {
                name: 'Source Attribution',
                tech: 'HYSPLIT + ML Ensemble',
                desc: 'Backward air trajectory analysis combined with OSM emission sources and NASA FIRMS fire data to attribute pollution to traffic, burning, construction, or industry.',
              },
              {
                name: 'Flash Notes Generation',
                tech: 'Google Gemini 1.5 Flash',
                desc: 'Context-aware health advisories, source analysis, and 24-hour outlooks generated in real time for each city\'s current air quality conditions.',
              },
            ].map(m => (
              <div key={m.name} className="flex items-start gap-4 py-3 border-b border-[rgba(0,255,136,0.05)] last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-600 text-sm text-[#e8f5ee]">{m.name}</span>
                    <span className="text-[10px] font-mono text-[#cc00ff] border border-[rgba(204,0,255,0.2)] rounded px-1.5 py-0.5 bg-[rgba(204,0,255,0.06)]">{m.tech}</span>
                  </div>
                  <p className="text-xs text-[#3d6b52] leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Data Sources */}
        <section className="mb-10">
          <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-4">Open Data Sources</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'CPCB CAAQMS', desc: 'Real-time station AQI', url: 'https://cpcb.nic.in' },
              { name: 'OpenAQ API', desc: 'Aggregated air quality', url: 'https://openaq.org' },
              { name: 'NASA MODIS', desc: 'Aerosol optical depth', url: 'https://earthdata.nasa.gov' },
              { name: 'Copernicus CAMS', desc: 'Atmospheric composition', url: 'https://atmosphere.copernicus.eu' },
              { name: 'IMD India', desc: 'Weather & wind data', url: 'https://mausam.imd.gov.in' },
              { name: 'SAFAR IITM', desc: 'AQI forecast model', url: 'https://safar.tropmet.res.in' },
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-3 hover:border-[rgba(0,255,136,0.2)] transition-all group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-600 text-xs text-[#e8f5ee]">{s.name}</span>
                  <ExternalLink size={10} className="text-[#3d6b52] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] text-[#3d6b52]">{s.desc}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Built by */}
        <section className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#3d6b52] mb-1">Built by</div>
            <div className="font-display font-700 text-[#e8f5ee]">Divyang Patel</div>
            <div className="text-xs text-[#3d6b52] mt-0.5">India-first climate tech platform</div>
          </div>
          <a href="https://github.com/DivyangP2003/vayu-sena" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(0,255,136,0.15)] text-sm text-[#7ab898] hover:text-[#00ff88] hover:border-[rgba(0,255,136,0.3)] transition-all">
            <Github size={14} /> View on GitHub
          </a>
        </section>
      </div>
      <Footer />
    </div>
  );
}
