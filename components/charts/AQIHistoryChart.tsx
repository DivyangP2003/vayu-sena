'use client';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { generateHistoricalAQI } from '@/lib/mockData';
import { AQI_LEVELS, getAQICategory } from '@/lib/types';

Chart.register(...registerables);

export default function AQIHistoryChart({ city }: { city: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const history = generateHistoricalAQI(city, 14);
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0,255,136,0.15)');
    gradient.addColorStop(1, 'rgba(0,255,136,0)');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: history.map(h => {
          const d = new Date(h.date);
          return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }),
        datasets: [
          {
            label: 'AQI',
            data: history.map(h => h.aqi),
            borderColor: '#00ff88',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: history.map(h => AQI_LEVELS[getAQICategory(h.aqi)].color),
            pointBorderColor: 'transparent',
            borderWidth: 2,
          },
          {
            label: 'PM2.5',
            data: history.map(h => h.pm25),
            borderColor: '#ffb800',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointBackgroundColor: '#ffb800',
            borderWidth: 1.5,
            borderDash: [4, 3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#7ab898',
              font: { family: 'JetBrains Mono', size: 11 },
              boxWidth: 12,
              padding: 16,
            },
          },
          tooltip: {
            backgroundColor: '#111f17',
            borderColor: 'rgba(0,255,136,0.2)',
            borderWidth: 1,
            titleColor: '#e8f5ee',
            bodyColor: '#7ab898',
            padding: 10,
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,255,136,0.04)', lineWidth: 1 },
            ticks: { color: '#3d6b52', font: { family: 'JetBrains Mono', size: 10 } },
            border: { color: 'rgba(0,255,136,0.08)' },
          },
          y: {
            grid: { color: 'rgba(0,255,136,0.04)' },
            ticks: { color: '#3d6b52', font: { family: 'JetBrains Mono', size: 10 } },
            border: { color: 'rgba(0,255,136,0.08)' },
            min: 0,
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [city]);

  return (
    <div className="h-48 sm:h-56">
      <canvas ref={canvasRef} />
    </div>
  );
}
