'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import { AQI_LEVELS } from '@/lib/types';

interface CityData {
  station: string;
  city: string;
  state: string;
  aqi: number;
  category: string;
  pm25: number;
  pm10: number;
}

export default function ComparePage() {
  const [selectedCities, setSelectedCities] = useState<CityData[]>([]);
  const [availableCities, setAvailableCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch('/api/aqi');
        const data = await res.json();
        setAvailableCities(data.data || []);
      } catch (e) {
        console.error('Failed to load cities', e);
      } finally {
        setLoading(false);
      }
    };
    loadCities();
  }, []);

  const filteredCities = availableCities.filter(
    (city) =>
      (city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedCities.some((s) => s.station === city.station && s.city === city.city)
  );

  const addCity = (city: CityData) => {
    if (selectedCities.length < 6) {
      setSelectedCities([...selectedCities, city]);
      setSearchQuery('');
    }
  };

  const removeCity = (index: number) => {
    setSelectedCities(selectedCities.filter((_, i) => i !== index));
  };

  const avgAQI = selectedCities.length > 0 ? Math.round(selectedCities.reduce((sum, c) => sum + c.aqi, 0) / selectedCities.length) : 0;
  const avgPM25 = selectedCities.length > 0 ? (selectedCities.reduce((sum, c) => sum + c.pm25, 0) / selectedCities.length).toFixed(1) : '0';
  const avgPM10 = selectedCities.length > 0 ? (selectedCities.reduce((sum, c) => sum + c.pm10, 0) / selectedCities.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col pt-14">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-800 text-[#e8f5ee] mb-4">Compare Cities</h1>
          <p className="text-[#7ab898] font-mono text-sm max-w-3xl">
            Compare air quality across multiple Indian cities. Analyze AQI trends, pollutant levels, and identify the cleanest and
            most polluted areas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* City Selector */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-6">
                <h2 className="text-lg font-display font-700 text-[#e8f5ee] mb-4">Add Cities</h2>

                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search city or state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0f0d] border border-[rgba(0,255,136,0.1)] rounded-lg px-4 py-2 text-sm text-[#e8f5ee] font-mono placeholder:text-[#3d6b52] focus:outline-none focus:border-[rgba(0,255,136,0.3)]"
                  />
                </div>

                {/* Results */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="text-xs text-[#3d6b52] font-mono">Loading cities...</div>
                  ) : filteredCities.length > 0 ? (
                    filteredCities.slice(0, 10).map((city, i) => (
                      <button
                        key={i}
                        onClick={() => addCity(city)}
                        disabled={selectedCities.length >= 6}
                        className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-mono hover:bg-[rgba(0,255,136,0.05)] disabled:opacity-40 transition-colors">
                        <div>
                          <div className="text-[#e8f5ee] font-600">{city.city}</div>
                          <div className="text-[#3d6b52]">{city.state}</div>
                        </div>
                        <div className="text-[#00ff88]">
                          <Plus size={14} />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-[#3d6b52] font-mono">No cities found</div>
                  )}
                </div>

                <div className="mt-4 text-xs text-[#3d6b52] font-mono">
                  {selectedCities.length} / 6 cities selected
                </div>
              </div>
            </div>
          </div>

          {/* Comparison View */}
          <div className="lg:col-span-2">
            {selectedCities.length === 0 ? (
              <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-12 text-center">
                <p className="text-[#7ab898] font-mono text-sm mb-4">Select cities to compare their air quality.</p>
                <p className="text-[#3d6b52] font-mono text-xs">You can compare up to 6 cities at once.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Average AQI', value: avgAQI, unit: '' },
                    { label: 'Avg PM2.5', value: avgPM25, unit: 'µg/m³' },
                    { label: 'Avg PM10', value: avgPM10, unit: 'µg/m³' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg p-4">
                      <div className="text-xs font-mono text-[#3d6b52] uppercase tracking-widest mb-2">{stat.label}</div>
                      <div className="text-2xl font-display font-800 text-[#00ff88]">
                        {stat.value}
                        {stat.unit && <span className="text-xs font-mono text-[#7ab898]">{stat.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cities Comparison Table */}
                <div className="bg-[#111f17] border border-[rgba(0,255,136,0.06)] rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-[rgba(0,255,136,0.06)] bg-[#0a0f0d]">
                        <tr>
                          <th className="px-4 py-3 text-left font-mono text-[#3d6b52] text-xs">CITY</th>
                          <th className="px-4 py-3 text-right font-mono text-[#3d6b52] text-xs">AQI</th>
                          <th className="px-4 py-3 text-right font-mono text-[#3d6b52] text-xs">CATEGORY</th>
                          <th className="px-4 py-3 text-right font-mono text-[#3d6b52] text-xs">PM2.5</th>
                          <th className="px-4 py-3 text-right font-mono text-[#3d6b52] text-xs">PM10</th>
                          <th className="px-4 py-3 text-center font-mono text-[#3d6b52] text-xs">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCities.map((city, i) => {
                          const level = AQI_LEVELS[city.category as keyof typeof AQI_LEVELS];
                          return (
                            <tr key={i} className="border-t border-[rgba(0,255,136,0.06)] hover:bg-[rgba(0,255,136,0.02)]">
                              <td className="px-4 py-3 font-mono text-[#e8f5ee]">
                                <div className="font-600">{city.city}</div>
                                <div className="text-[#3d6b52] text-xs">{city.state}</div>
                              </td>
                              <td className="px-4 py-3 text-right font-display font-700" style={{ color: level?.color }}>
                                {city.aqi}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-xs" style={{ color: level?.color }}>
                                {level?.label}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-[#7ab898]">{city.pm25.toFixed(1)}</td>
                              <td className="px-4 py-3 text-right font-mono text-[#7ab898]">{city.pm10.toFixed(1)}</td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => removeCity(i)}
                                  className="text-[#ff6b00] hover:text-[#ff4444] transition-colors">
                                  <X size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analysis */}
                <div className="bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)] rounded-lg p-6">
                  <h3 className="font-display font-700 text-[#00ff88] mb-4">Quick Analysis</h3>
                  <div className="space-y-3 text-sm font-mono text-[#7ab898]">
                    <div>
                      <span className="text-[#00ff88]">Cleanest City:</span>{' '}
                      {selectedCities.reduce((prev, current) =>
                        prev.aqi < current.aqi ? prev : current
                      ).city
                        ? `${selectedCities.reduce((prev, current) =>
                            prev.aqi < current.aqi ? prev : current
                          ).city} (AQI: ${selectedCities.reduce((prev, current) =>
                            prev.aqi < current.aqi ? prev : current
                          ).aqi})`
                        : 'N/A'}
                    </div>
                    <div>
                      <span className="text-[#ff6b00]">Most Polluted City:</span>{' '}
                      {selectedCities.reduce((prev, current) =>
                        prev.aqi > current.aqi ? prev : current
                      ).city
                        ? `${selectedCities.reduce((prev, current) =>
                            prev.aqi > current.aqi ? prev : current
                          ).city} (AQI: ${selectedCities.reduce((prev, current) =>
                            prev.aqi > current.aqi ? prev : current
                          ).aqi})`
                        : 'N/A'}
                    </div>
                    <div>
                      <span className="text-[#a8ff3e]">Variation Range:</span>{' '}
                      {Math.max(...selectedCities.map((c) => c.aqi)) -
                        Math.min(...selectedCities.map((c) => c.aqi))} points
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
