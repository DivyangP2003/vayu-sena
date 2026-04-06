'use client';
import { AQI_LEVELS, getAQICategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AQIBadgeProps {
  aqi: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export function AQIBadge({ aqi, size = 'md', showLabel = true, className }: AQIBadgeProps) {
  const cat = getAQICategory(aqi);
  const level = AQI_LEVELS[cat];

  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-4xl',
  };

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <div
        className={cn('rounded-full flex items-center justify-center font-display font-bold border-2 relative', sizes[size])}
        style={{
          borderColor: level.color,
          background: `radial-gradient(circle, ${level.bg}, transparent)`,
          boxShadow: `0 0 20px ${level.color}30, inset 0 0 20px ${level.color}10`,
          color: level.color,
        }}
      >
        {aqi}
        {size === 'xl' && (
          <span
            className="absolute -inset-2 rounded-full border opacity-30 animate-ping"
            style={{ borderColor: level.color }}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-medium" style={{ color: level.color }}>
          {level.label}
        </span>
      )}
    </div>
  );
}

interface AQICardProps {
  city: string;
  state: string;
  aqi: number;
  pm25: number;
  pm10: number;
  trend?: 'improving' | 'worsening' | 'stable';
  dominantSource?: string;
  timestamp?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function AQICard({
  city, state, aqi, pm25, pm10, trend, dominantSource, timestamp, onClick, selected
}: AQICardProps) {
  const cat = getAQICategory(aqi);
  const level = AQI_LEVELS[cat];
  const trendIcon = trend === 'improving' ? '↓' : trend === 'worsening' ? '↑' : '→';
  const trendColor = trend === 'improving' ? '#00ff88' : trend === 'worsening' ? '#ff4444' : '#ffb800';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl p-4 transition-all duration-200 border',
        'hover:scale-[1.01] hover:shadow-lg',
        selected
          ? 'border-[rgba(0,255,136,0.4)] bg-[rgba(0,255,136,0.07)]'
          : 'border-[rgba(0,255,136,0.07)] bg-[#111f17] hover:border-[rgba(0,255,136,0.2)]'
      )}
      style={selected ? { boxShadow: `0 0 20px rgba(0,255,136,0.1)` } : {}}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-display font-700 text-sm text-[#e8f5ee]">{city}</div>
          <div className="text-xs text-[#3d6b52] font-mono">{state}</div>
        </div>
        <AQIBadge aqi={aqi} size="sm" showLabel={false} />
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#3d6b52]">PM2.5</span>
            <span className="text-xs font-mono text-[#7ab898]">{pm25} µg</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#3d6b52]">PM10</span>
            <span className="text-xs font-mono text-[#7ab898]">{pm10} µg</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-display font-bold" style={{ color: level.color }}>
            {level.label}
          </div>
          {trend && (
            <div className="text-xs font-mono" style={{ color: trendColor }}>
              {trendIcon} {trend}
            </div>
          )}
        </div>
      </div>

      {dominantSource && (
        <div className="mt-2 pt-2 border-t border-[rgba(0,255,136,0.06)]">
          <span className="text-xs text-[#3d6b52]">Main source: </span>
          <span className="text-xs text-[#7ab898]">{dominantSource}</span>
        </div>
      )}
    </button>
  );
}

export function AQIScaleBar() {
  const categories = Object.entries(AQI_LEVELS);
  return (
    <div className="flex items-center gap-1">
      {categories.map(([key, val]) => (
        <div key={key} className="flex flex-col items-center gap-1">
          <div
            className="h-2 w-8 sm:w-12 rounded-sm opacity-80"
            style={{ backgroundColor: val.color }}
          />
          <span className="text-[9px] font-mono text-[#3d6b52] hidden sm:block">{val.range}</span>
        </div>
      ))}
    </div>
  );
}
