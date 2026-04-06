import Link from 'next/link';
import { Wind, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,255,136,0.08)] bg-[#0a0f0d] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center">
                <Wind size={12} className="text-[#00ff88]" />
              </div>
              <span className="font-display font-bold text-sm text-[#e8f5ee]">VAYU <span className="text-[#00ff88]">SAINIK</span></span>
            </div>
            <p className="text-xs text-[#3d6b52] leading-relaxed max-w-xs">
              India's open-data air quality intelligence platform. Ward-level AQI, citizen pollution reporting, and AI source attribution — no hardware required.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com/DivyangP2003/vayu-sena" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#3d6b52] hover:text-[#7ab898] transition-colors">
                <Github size={12} /> GitHub
              </a>
              <a href="https://airquality.cpcb.gov.in" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#3d6b52] hover:text-[#7ab898] transition-colors">
                <ExternalLink size={12} /> CPCB Data
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/map', label: 'Live Map' },
                { href: '/report', label: 'Submit Report' },
                { href: '/alerts', label: 'Alerts' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-[#3d6b52] hover:text-[#7ab898] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Data Sources</h4>
            <ul className="space-y-2">
              {['CPCB CAAQMS', 'OpenAQ API', 'NASA MODIS', 'Copernicus CAMS', 'IMD Weather', 'SAFAR IITM'].map(s => (
                <li key={s} className="text-xs text-[#3d6b52]">{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[rgba(0,255,136,0.05)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-[#3d6b52]">
            © 2024 Vayu Sainik — Built for India, powered by open data
          </p>
          <p className="text-xs text-[#3d6b52]">
            Data is indicative. Not a certified regulatory tool.
          </p>
        </div>
      </div>
    </footer>
  );
}
