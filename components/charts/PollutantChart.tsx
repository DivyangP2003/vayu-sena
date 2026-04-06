'use client';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { AQIData } from '@/lib/types';

Chart.register(...registerables);

export default function PollutantChart({ data }: { data: AQIData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'CO', 'O₃'],
        datasets: [{
          label: 'µg/m³',
          data: [data.pm25, data.pm10, data.no2, data.so2, data.co, data.o3],
          backgroundColor: [
            'rgba(0,255,136,0.6)',
            'rgba(168,255,62,0.6)',
            'rgba(255,184,0,0.6)',
            'rgba(255,107,0,0.6)',
            'rgba(255,68,68,0.6)',
            'rgba(0,212,255,0.6)',
          ],
          borderColor: [
            '#00ff88', '#a8ff3e', '#ffb800', '#ff6b00', '#ff4444', '#00d4ff',
          ],
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111f17',
            borderColor: 'rgba(0,255,136,0.2)',
            borderWidth: 1,
            titleColor: '#e8f5ee',
            bodyColor: '#7ab898',
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#7ab898', font: { family: 'JetBrains Mono', size: 10 } },
            border: { color: 'rgba(0,255,136,0.08)' },
          },
          y: {
            grid: { color: 'rgba(0,255,136,0.04)' },
            ticks: { color: '#3d6b52', font: { family: 'JetBrains Mono', size: 10 } },
            border: { color: 'rgba(0,255,136,0.08)' },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [data]);

  return (
    <div className="h-40">
      <canvas ref={canvasRef} />
    </div>
  );
}
