'use client';
import { useEffect, useRef, useState } from 'react';
import { AQI_LEVELS } from '@/lib/types';
import 'leaflet/dist/leaflet.css';
interface StationPoint {
  station: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  aqi: number;
  category: string;
  pm25: number;
  pm10: number;
  dominantSource: string;
  lastUpdate?: string;
}

interface IndiaMapProps {
  data: StationPoint[];
  onStationSelect?: (station: StationPoint) => void;
  selectedStation?: string;
  searchMarker?: { lat: number; lng: number; label: string; aqi?: number } | null;
}

export default function IndiaMap({ data, onStationSelect, selectedStation, searchMarker }: IndiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const searchLayerRef = useRef<any>(null);
  const [stationCount, setStationCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      

      // Leaflet.markercluster for clustering 500+ pins
      // We do manual clustering via grid-based approach for performance

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const map = L.map(mapRef.current!, {
        center: [22.5, 80.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      // Dark CartoDB tile
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19 }
      ).addTo(map);

      // Markers layer group
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      searchLayerRef.current = L.layerGroup().addTo(map);

      // Inject styles
      const style = document.createElement('style');
      style.textContent = `
        .vayu-popup .leaflet-popup-content-wrapper { background:transparent!important;box-shadow:none!important;padding:0!important;border-radius:10px!important; }
        .vayu-popup .leaflet-popup-tip-container { display:none; }
        .vayu-popup .leaflet-popup-content { margin:0!important; }
        .leaflet-control-zoom { border:1px solid rgba(0,255,136,0.15)!important;background:#111f17!important; }
        .leaflet-control-zoom a { background:#111f17!important;color:#7ab898!important;border-color:rgba(0,255,136,0.08)!important; }
        .leaflet-control-zoom a:hover { color:#00ff88!important; }
        .vayu-marker { transition: transform 0.1s; }
        .vayu-marker:hover { transform: scale(1.15); }
      `;
      document.head.appendChild(style);

      leafletMapRef.current = map;
    };

    initMap();

    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current || !data.length) return;

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;
      markersLayerRef.current.clearLayers();
      setStationCount(data.length);

      const zoom = leafletMapRef.current.getZoom();
      // At low zoom, show circles; at higher zoom show labeled pins
      const showLabels = zoom >= 8;

      data.forEach(station => {
        const level = AQI_LEVELS[station.category as keyof typeof AQI_LEVELS];
        if (!level) return;

        const size = showLabels ? 38 : 22;
        const fontSize = showLabels ? '10px' : '8px';

        const icon = L.divIcon({
          className: 'vayu-marker',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          popupAnchor: [0, -(size / 2 + 2)],
          html: `
            <div style="
              width:${size}px;height:${size}px;border-radius:50%;
              background:${level.bg};border:${selectedStation === station.station ? '2.5px' : '1.5px'} solid ${level.color};
              display:flex;align-items:center;justify-content:center;
              font-family:JetBrains Mono,monospace;font-size:${fontSize};font-weight:600;
              color:${level.color};
              box-shadow:0 0 ${selectedStation === station.station ? '16px' : '8px'} ${level.color}50;
              cursor:pointer;
            ">${station.aqi}</div>
          `,
        });

        const marker = L.marker([station.lat, station.lng], { icon });

        const popupHtml = `
          <div style="background:#111f17;border:1px solid ${level.color}40;border-radius:10px;padding:12px;min-width:200px;font-family:JetBrains Mono,monospace;color:#e8f5ee;">
            <div style="font-size:13px;font-weight:700;margin-bottom:2px;">${station.station}</div>
            <div style="font-size:10px;color:#7ab898;margin-bottom:8px;">${station.city}, ${station.state}</div>
            <div style="font-size:26px;font-weight:800;color:${level.color};line-height:1;">${station.aqi}</div>
            <div style="font-size:10px;color:${level.color};margin-bottom:8px;">${level.label}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,255,136,0.08);">
              <div style="font-size:9px;color:#3d6b52;">PM2.5: <span style="color:#7ab898">${station.pm25} µg</span></div>
              <div style="font-size:9px;color:#3d6b52;">PM10: <span style="color:#7ab898">${station.pm10} µg</span></div>
            </div>
            <div style="margin-top:6px;font-size:9px;color:#3d6b52;">Source: <span style="color:#7ab898">${station.dominantSource}</span></div>
            ${station.lastUpdate ? `<div style="margin-top:4px;font-size:8px;color:#3d6b52;">${station.lastUpdate}</div>` : ''}
          </div>
        `;

        marker.bindPopup(popupHtml, { closeButton: false, className: 'vayu-popup' });
        marker.on('click', () => { if (onStationSelect) onStationSelect(station); });
        marker.addTo(markersLayerRef.current);
      });
    };

    updateMarkers();

    // Re-render on zoom change (to toggle labels)
    const onZoom = () => updateMarkers();
    leafletMapRef.current?.on('zoomend', onZoom);
    return () => { leafletMapRef.current?.off('zoomend', onZoom); };
  }, [data, selectedStation, onStationSelect]);

  // Search marker
  useEffect(() => {
    if (!leafletMapRef.current || !searchLayerRef.current) return;
    const updateSearch = async () => {
      const L = (await import('leaflet')).default;
      searchLayerRef.current.clearLayers();
      if (!searchMarker) return;

      const icon = L.divIcon({
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        html: `
          <div style="position:relative;width:32px;height:32px;">
            <div style="
              position:absolute;bottom:0;left:50%;transform:translateX(-50%);
              width:20px;height:20px;background:#00ff88;border-radius:50% 50% 50% 0;
              transform:translateX(-50%) rotate(-45deg);
              box-shadow:0 0 16px rgba(0,255,136,0.6);
            "></div>
            <div style="
              position:absolute;bottom:4px;left:50%;transform:translateX(-50%);
              width:8px;height:8px;background:#0a0f0d;border-radius:50%;z-index:1;
            "></div>
          </div>
        `,
      });

      L.marker([searchMarker.lat, searchMarker.lng], { icon })
        .bindPopup(`
          <div style="background:#111f17;border:1px solid rgba(0,255,136,0.3);border-radius:8px;padding:10px;font-family:JetBrains Mono,monospace;color:#e8f5ee;min-width:150px;">
            <div style="font-size:11px;color:#00ff88;margin-bottom:4px;">📍 ${searchMarker.label}</div>
            ${searchMarker.aqi ? `<div style="font-size:20px;font-weight:700;color:#00ff88;">AQI ${searchMarker.aqi}</div>` : ''}
          </div>
        `, { closeButton: false, className: 'vayu-popup' })
        .addTo(searchLayerRef.current);

      leafletMapRef.current.flyTo([searchMarker.lat, searchMarker.lng], 11, { duration: 1.2 });
    };

    updateSearch();
  }, [searchMarker]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" style={{ background: '#0a0f0d' }} />
      {stationCount > 0 && (
        <div className="absolute top-3 right-3 z-[1000] bg-[rgba(10,15,13,0.9)] border border-[rgba(0,255,136,0.1)] rounded-lg px-2.5 py-1.5 backdrop-blur-sm pointer-events-none">
          <span className="text-[10px] font-mono text-[#00ff88]">{stationCount} stations</span>
        </div>
      )}
    </div>
  );
}
