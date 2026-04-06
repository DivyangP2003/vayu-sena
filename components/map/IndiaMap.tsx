'use client';
import { useEffect, useRef } from 'react';
import { AQIData, AQI_LEVELS } from '@/lib/types';

interface IndiaMapProps {
  data: AQIData[];
  onCitySelect?: (city: string) => void;
  selectedCity?: string;
}

export default function IndiaMap({ data, onCitySelect, selectedCity }: IndiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const map = L.map(mapRef.current!, {
        center: [22.5, 78.5],
        zoom: 5,
        zoomControl: true,
        attributionControl: false,
      });

      // Dark tile layer
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19 }
      ).addTo(map);

      // Custom AQI circle markers
      markersRef.current = data.map(city => {
        const level = AQI_LEVELS[city.category];

        const svgIcon = L.divIcon({
          className: '',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          popupAnchor: [0, -22],
          html: `
            <div style="
              width:44px;height:44px;
              display:flex;align-items:center;justify-content:center;
              position:relative;cursor:pointer;
            ">
              <div style="
                width:34px;height:34px;border-radius:50%;
                background:${level.bg};
                border:2px solid ${level.color};
                display:flex;align-items:center;justify-content:center;
                font-family:'JetBrains Mono',monospace;
                font-size:10px;font-weight:600;
                color:${level.color};
                box-shadow:0 0 12px ${level.color}40;
                transition:transform 0.15s;
              ">
                ${city.aqi}
              </div>
            </div>
          `,
        });

        const marker = L.marker([city.lat, city.lng], { icon: svgIcon })
          .bindPopup(`
            <div style="
              background:#111f17;border:1px solid rgba(0,255,136,0.2);
              border-radius:8px;padding:12px;min-width:160px;
              font-family:'JetBrains Mono',monospace;color:#e8f5ee;
            ">
              <div style="font-size:14px;font-weight:700;margin-bottom:4px;">${city.city}</div>
              <div style="font-size:11px;color:#7ab898;margin-bottom:8px;">${city.state}</div>
              <div style="font-size:22px;font-weight:700;color:${level.color};margin-bottom:4px;">${city.aqi}</div>
              <div style="font-size:11px;color:${level.color};">${level.label}</div>
              <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,255,136,0.1)">
                <div style="font-size:10px;color:#3d6b52;">PM2.5: <span style="color:#7ab898;">${city.pm25} µg/m³</span></div>
                <div style="font-size:10px;color:#3d6b52;">PM10: <span style="color:#7ab898;">${city.pm10} µg/m³</span></div>
                <div style="font-size:10px;color:#3d6b52;margin-top:4px;">Source: <span style="color:#7ab898;">${city.dominantSource}</span></div>
              </div>
            </div>
          `, {
            closeButton: false,
            className: 'vayu-popup',
          })
          .on('click', () => {
            if (onCitySelect) onCitySelect(city.city);
          })
          .addTo(map);

        return marker;
      });

      leafletMapRef.current = map;

      // Style the popup
      const style = document.createElement('style');
      style.textContent = `
        .vayu-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 8px !important;
        }
        .vayu-popup .leaflet-popup-tip-container { display: none; }
        .vayu-popup .leaflet-popup-content { margin: 0 !important; }
        .leaflet-control-zoom { 
          border: 1px solid rgba(0,255,136,0.2) !important; 
          background: #111f17 !important;
        }
        .leaflet-control-zoom a { 
          background: #111f17 !important; 
          color: #7ab898 !important;
          border-color: rgba(0,255,136,0.1) !important;
        }
        .leaflet-control-zoom a:hover { color: #00ff88 !important; }
      `;
      document.head.appendChild(style);
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [data]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ background: '#0a0f0d' }}
    />
  );
}
