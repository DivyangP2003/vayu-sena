'use client';
import { useState, useEffect } from 'react';
import { Zap, Heart, Wind, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { FlashNote } from '@/lib/types';
import { cn } from '@/lib/utils';

const CATEGORY_META = {
  health: { icon: Heart, color: '#ff4444', label: 'Health Advisory' },
  source: { icon: Wind, color: '#ffb800', label: 'Source Analysis' },
  forecast: { icon: TrendingUp, color: '#00d4ff', label: '24hr Outlook' },
  alert: { icon: Zap, color: '#cc00ff', label: 'Alert' },
  tip: { icon: Zap, color: '#00ff88', label: 'Tip' },
};

function NoteCard({ note, delay = 0 }: { note: FlashNote; delay?: number }) {
  const meta = CATEGORY_META[note.category];
  const Icon = meta.icon;

  return (
    <div
      className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
        >
          <Icon size={12} style={{ color: meta.color }} />
        </div>
        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: meta.color }}>
          {meta.label}
        </span>
      </div>
      <h4 className="text-sm font-display font-600 text-[#e8f5ee] mb-1.5">{note.title}</h4>
      <p className="text-xs text-[#7ab898] leading-relaxed">{note.content}</p>
    </div>
  );
}

export default function FlashNotes({ city }: { city: string }) {
  const [notes, setNotes] = useState<FlashNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>('');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/flash-notes?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      setNotes(data.notes || []);
      setSource(data.source || '');
    } catch {
      console.error('Failed to fetch flash notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [city]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#00ff88]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#3d6b52]">AI Flash Notes</span>
          {source === 'gemini' && (
            <span className="text-[9px] font-mono text-[#3d6b52] border border-[rgba(0,255,136,0.15)] rounded px-1.5 py-0.5">Gemini</span>
          )}
        </div>
        <button
          onClick={fetchNotes}
          disabled={loading}
          className="text-[#3d6b52] hover:text-[#7ab898] transition-colors disabled:opacity-40"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-xl border border-[rgba(0,255,136,0.07)] bg-[#111f17] p-4 h-28 shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {notes.map((note, i) => (
            <NoteCard key={note.id} note={note} delay={i * 100} />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
