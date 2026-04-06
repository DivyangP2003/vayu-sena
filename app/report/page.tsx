'use client';
import { useState } from 'react';
import { Upload, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SOURCE_TYPES, INDIA_CITIES } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ReportPage() {
  const [form, setForm] = useState({
    city: 'Delhi', description: '', sourceType: 'traffic' as keyof typeof SOURCE_TYPES,
    severity: 3 as 1 | 2 | 3 | 4 | 5, lat: '', lng: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [locationLoading, setLocationLoading] = useState(false);
  const [recentReports, setRecentReports] = useState<{ id: string; city: string; sourceType: string; description: string; timestamp: string }[]>([]);

  const getLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => { setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5) })); setLocationLoading(false); },
      () => setLocationLoading(false)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setStatus('submitting');
    try {
      const city = INDIA_CITIES.find(c => c.name === form.city);
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          lat: form.lat || city?.lat || 28.6139,
          lng: form.lng || city?.lng || 77.2090,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setRecentReports(r => [{ id: data.report.id, city: form.city, sourceType: form.sourceType, description: form.description, timestamp: data.report.timestamp }, ...r.slice(0, 4)]);
        setForm(f => ({ ...f, description: '', lat: '', lng: '' }));
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] bg-grid pt-14">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-2">Citizen Reporting</div>
          <h1 className="font-display font-800 text-3xl text-[#e8f5ee]">Report Pollution</h1>
          <p className="text-sm text-[#7ab898] mt-1">Spotted burning, dust, or factory smoke? Report it. No sensor needed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">

            {/* City selector */}
            <div>
              <label className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest block mb-2">City</label>
              <select
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full bg-[#111f17] border border-[rgba(0,255,136,0.1)] rounded-xl px-4 py-2.5 text-sm text-[#e8f5ee] font-mono focus:outline-none focus:border-[rgba(0,255,136,0.3)] transition-colors"
              >
                {INDIA_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}, {c.state}</option>)}
              </select>
            </div>

            {/* Source type */}
            <div>
              <label className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest block mb-2">Pollution Source</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(SOURCE_TYPES).map(([key, src]) => (
                  <button key={key} type="button"
                    onClick={() => setForm(f => ({ ...f, sourceType: key as keyof typeof SOURCE_TYPES }))}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all text-left',
                      form.sourceType === key
                        ? 'border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.08)] text-[#e8f5ee]'
                        : 'border-[rgba(0,255,136,0.07)] bg-[#111f17] text-[#7ab898] hover:border-[rgba(0,255,136,0.15)]'
                    )}>
                    <span>{src.icon}</span>
                    <span className="font-display font-500">{src.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest block mb-2">
                Severity — {['', 'Very Low', 'Low', 'Moderate', 'High', 'Severe'][form.severity]}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button"
                    onClick={() => setForm(f => ({ ...f, severity: n as 1|2|3|4|5 }))}
                    className={cn(
                      'flex-1 h-8 rounded-lg border text-xs font-mono transition-all',
                      form.severity >= n
                        ? 'border-[#ffb800] bg-[rgba(255,184,0,0.12)] text-[#ffb800]'
                        : 'border-[rgba(0,255,136,0.07)] bg-[#111f17] text-[#3d6b52]'
                    )}>{n}</button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest block mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="What are you observing? Location details, smell, visibility impact..."
                rows={4}
                required
                className="w-full bg-[#111f17] border border-[rgba(0,255,136,0.1)] rounded-xl px-4 py-3 text-sm text-[#e8f5ee] font-mono placeholder-[#3d6b52] focus:outline-none focus:border-[rgba(0,255,136,0.3)] resize-none transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest block mb-2">Location (optional)</label>
              <div className="flex gap-2">
                <input value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                  placeholder="Latitude"
                  className="flex-1 bg-[#111f17] border border-[rgba(0,255,136,0.1)] rounded-xl px-3 py-2 text-xs text-[#e8f5ee] font-mono placeholder-[#3d6b52] focus:outline-none focus:border-[rgba(0,255,136,0.3)]" />
                <input value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
                  placeholder="Longitude"
                  className="flex-1 bg-[#111f17] border border-[rgba(0,255,136,0.1)] rounded-xl px-3 py-2 text-xs text-[#e8f5ee] font-mono placeholder-[#3d6b52] focus:outline-none focus:border-[rgba(0,255,136,0.3)]" />
                <button type="button" onClick={getLocation} disabled={locationLoading}
                  className="px-3 py-2 rounded-xl border border-[rgba(0,255,136,0.1)] bg-[#111f17] text-[#7ab898] hover:text-[#00ff88] hover:border-[rgba(0,255,136,0.3)] transition-all disabled:opacity-50">
                  <MapPin size={14} className={locationLoading ? 'animate-bounce' : ''} />
                </button>
              </div>
              {form.lat && form.lng && (
                <p className="text-xs font-mono text-[#3d6b52] mt-1">{form.lat}, {form.lng} ✓</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={status === 'submitting' || !form.description}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-display font-600 transition-all',
                status === 'submitting'
                  ? 'bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)] text-[#3d6b52] cursor-not-allowed'
                  : 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00ff88] hover:bg-[rgba(0,255,136,0.15)] hover:shadow-green-glow'
              )}>
              {status === 'submitting' ? (
                <><div className="w-4 h-4 border border-[rgba(0,255,136,0.3)] border-t-[#00ff88] rounded-full animate-spin" />Submitting...</>
              ) : (
                <><Send size={14} />Submit Report</>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.2)]">
                <CheckCircle size={14} className="text-[#00ff88]" />
                <span className="text-sm text-[#00ff88]">Report submitted! Our team will verify it shortly.</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.2)]">
                <AlertCircle size={14} className="text-[#ff4444]" />
                <span className="text-sm text-[#ff4444]">Something went wrong. Please try again.</span>
              </div>
            )}
          </form>

          {/* Tips */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
              <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">How it works</div>
              <div className="space-y-3">
                {[
                  { n: '01', t: 'Spot it', d: 'Notice unusual smoke, dust, or smell in your area' },
                  { n: '02', t: 'Report it', d: 'Fill the form with source type and description' },
                  { n: '03', t: 'Tag location', d: 'Use GPS or enter coordinates for precise mapping' },
                  { n: '04', t: 'Verified', d: 'Community upvotes + AI validation before publication' },
                  { n: '05', t: 'Attributed', d: 'Your report feeds the source attribution model' },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[#3d6b52] mt-0.5">{s.n}</span>
                    <div>
                      <div className="text-xs font-display font-600 text-[#e8f5ee]">{s.t}</div>
                      <div className="text-xs text-[#3d6b52]">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {recentReports.length > 0 && (
              <div className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4">
                <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-3">Your Recent Reports</div>
                <div className="space-y-2">
                  {recentReports.map(r => (
                    <div key={r.id} className="text-xs p-2 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.06)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#7ab898] font-display font-600">{SOURCE_TYPES[r.sourceType as keyof typeof SOURCE_TYPES]?.label}</span>
                        <span className="text-[#3d6b52] font-mono">{r.city}</span>
                      </div>
                      <p className="text-[#3d6b52] line-clamp-1">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
