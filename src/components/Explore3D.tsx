import React, { useState } from 'react';
import { Globe, TrendingUp, MapPin, DollarSign, Wifi, Car, ShoppingBag, GraduationCap } from 'lucide-react';

const Explore3D: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('chandigarh');
  const [viewMode, setViewMode] = useState<'price' | 'lifestyle' | 'infrastructure'>('price');

  const cities = {
    chandigarh: {
      name: 'Chandigarh',
      avgPrice: '₹75 Lakh',
      growth: '+12%',
      lifestyle: 95,
      infrastructure: 92,
      coordinates: { x: 50, y: 45 }
    },
    mohali: {
      name: 'Mohali',
      avgPrice: '₹68 Lakh',
      growth: '+15%',
      lifestyle: 88,
      infrastructure: 85,
      coordinates: { x: 45, y: 55 }
    },
    zirakpur: {
      name: 'Zirakpur',
      avgPrice: '₹62 Lakh',
      growth: '+18%',
      lifestyle: 82,
      infrastructure: 80,
      coordinates: { x: 40, y: 50 }
    },
    panchkula: {
      name: 'Panchkula',
      avgPrice: '₹70 Lakh',
      growth: '+10%',
      lifestyle: 90,
      infrastructure: 88,
      coordinates: { x: 55, y: 40 }
    }
  };

  const getHeatmapColor = (value: number) => {
    if (value >= 90) return 'from-green-500 to-cyan-500';
    if (value >= 80) return 'from-yellow-500 to-green-500';
    if (value >= 70) return 'from-orange-500 to-yellow-500';
    return 'from-red-500 to-orange-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Explore Tricity in 3D
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Interactive 3D maps with real-time price trends, infrastructure updates, 
          and lifestyle scores across the entire Tricity region.
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-xl p-2 flex space-x-2">
          {[
            { key: 'price', label: 'Price Heatmap', icon: DollarSign },
            { key: 'lifestyle', label: 'Lifestyle Score', icon: TrendingUp },
            { key: 'infrastructure', label: 'Infrastructure', icon: Wifi }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setViewMode(key as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                viewMode === key
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 3D Map Visualization */}
        <div className="xl:col-span-2">
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8">
            <div className="relative h-96 bg-gradient-to-br from-gray-900 to-purple-900/20 rounded-xl overflow-hidden">
              {/* Simulated 3D Map */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1)_0%,transparent_50%)]" />
              
              {/* City Markers */}
              {Object.entries(cities).map(([key, city]) => (
                <div
                  key={key}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${city.coordinates.x}%`, top: `${city.coordinates.y}%` }}
                  onClick={() => setSelectedCity(key)}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${
                    selectedCity === key ? 'from-cyan-400 to-purple-400' : 'from-cyan-500/60 to-purple-500/60'
                  } animate-pulse shadow-lg`} />
                  
                  {/* City Info Popup */}
                  <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3 min-w-max transition-all duration-300 ${
                    selectedCity === key ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                  }`}>
                    <h4 className="text-cyan-400 font-semibold text-sm">{city.name}</h4>
                    <p className="text-gray-300 text-xs">Avg: {city.avgPrice}</p>
                    <p className="text-green-400 text-xs">Growth: {city.growth}</p>
                  </div>
                </div>
              ))}

              {/* Heatmap Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {Object.entries(cities).map(([key, city]) => {
                  const value = viewMode === 'price' ? 85 : viewMode === 'lifestyle' ? city.lifestyle : city.infrastructure;
                  return (
                    <div
                      key={key}
                      className={`absolute w-24 h-24 rounded-full bg-gradient-to-r ${getHeatmapColor(value)} opacity-30 blur-xl transform -translate-x-1/2 -translate-y-1/2`}
                      style={{ left: `${city.coordinates.x}%`, top: `${city.coordinates.y}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* AR Mode Button */}
            <div className="mt-6 text-center">
              <button className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
                🥽 Switch to AR Mode
              </button>
            </div>
          </div>
        </div>

        {/* City Details Panel */}
        <div className="space-y-6">
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">
              {cities[selectedCity as keyof typeof cities].name}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Average Price</span>
                <span className="text-white font-semibold">
                  {cities[selectedCity as keyof typeof cities].avgPrice}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Price Growth</span>
                <span className="text-green-400 font-semibold">
                  {cities[selectedCity as keyof typeof cities].growth}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Lifestyle Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                      style={{ width: `${cities[selectedCity as keyof typeof cities].lifestyle}%` }}
                    />
                  </div>
                  <span className="text-white text-sm">
                    {cities[selectedCity as keyof typeof cities].lifestyle}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Infrastructure</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                      style={{ width: `${cities[selectedCity as keyof typeof cities].infrastructure}%` }}
                    />
                  </div>
                  <span className="text-white text-sm">
                    {cities[selectedCity as keyof typeof cities].infrastructure}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Key Amenities</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShoppingBag, label: 'Shopping' },
                { icon: GraduationCap, label: 'Education' },
                { icon: Car, label: 'Transport' },
                { icon: Wifi, label: 'Connectivity' }
              ].map(({ icon: Icon, label }, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-300">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Updates */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Live Updates</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 animate-pulse" />
                <div>
                  <p className="text-sm text-gray-300">New metro line approved</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 animate-pulse" />
                <div>
                  <p className="text-sm text-gray-300">Tech park construction started</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore3D;