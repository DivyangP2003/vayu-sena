'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Wind, Map, AlertTriangle, FileText, Info, Menu, X, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Activity },
  { href: '/dashboard', label: 'Dashboard', icon: Wind },
  { href: '/map', label: 'Live Map', icon: Map },
  { href: '/report', label: 'Report', icon: FileText },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(0,255,136,0.08)] bg-[rgba(10,15,13,0.92)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center group-hover:bg-[rgba(0,255,136,0.15)] transition-colors">
              <Wind size={14} className="text-[#00ff88]" />
            </div>
            <span className="font-display font-800 text-sm tracking-tight text-[#e8f5ee]">
              VAYU <span className="text-[#00ff88]">SAINIK</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-mono text-[#3d6b52] border border-[rgba(0,255,136,0.1)] rounded px-1.5 py-0.5 ml-1">BETA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                  pathname === href
                    ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[rgba(0,255,136,0.2)]'
                    : 'text-[#7ab898] hover:text-[#e8f5ee] hover:bg-[rgba(255,255,255,0.04)]'
                )}
              >
                <Icon size={12} />
                {label}
              </Link>
            ))}
          </div>

          {/* Status pill */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#7ab898]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
              Live
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[#7ab898] hover:text-[#e8f5ee] p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(0,255,136,0.08)] bg-[#0a0f0d] px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all',
                pathname === href
                  ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88]'
                  : 'text-[#7ab898] hover:text-[#e8f5ee]'
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
