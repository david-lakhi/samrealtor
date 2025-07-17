import React, { useState } from 'react';
import { Search, Mic, MapPin, Bed, Bath, Car, DollarSign, Filter, Heart, Eye } from 'lucide-react';

const SmartFinder: React.FC = () => {
  const [searchMode, setSearchMode] = useState<'text' | 'voice'>('text');
  const [filters, setFilters] = useState({
    location: '',
    budget: '',
    bedrooms: '',
    propertyType: ''
  });

  const properties = [
    {
      id: 1,
      title: 'Luxury 3BHK with Garden View',
      location: 'Sector 17, Chandigarh',
      price: '₹85 Lakh',
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      area: '1450 sq ft',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400',
      score: 98,
      features: ['Garden View', 'Modern Kitchen', 'Parking']
    },
    {
      id: 2,
      title: 'Modern 2BHK Smart Home',
      location: 'Phase 8, Mohali',
      price: '₹65 Lakh',
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      area: '1100 sq ft',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
      score: 95,
      features: ['Smart Home', 'Gym', 'Pool']
    },
    {
      id: 3,
      title: 'Premium 4BHK Villa',
      location: 'VIP Road, Zirakpur',
      price: '₹1.2 Cr',
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      area: '2200 sq ft',
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400',
      score: 99,
      features: ['Private Garden', 'Home Theater', 'Security']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AI Smart Property Finder
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Describe your ideal home in natural language or use voice commands. 
          Our AI understands your preferences and finds perfect matches.
        </p>
      </div>

      {/* Search Interface */}
      <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 mb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., I want a spacious 3BHK near IT parks with good connectivity..."
                className="w-full bg-gray-900/50 border border-gray-600/50 rounded-xl px-6 py-4 text-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              />
              <button
                onClick={() => setSearchMode(searchMode === 'text' ? 'voice' : 'text')}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                  searchMode === 'voice'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-cyan-500 text-white hover:bg-cyan-600'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="">Location</option>
              <option value="chandigarh">Chandigarh</option>
              <option value="mohali">Mohali</option>
              <option value="zirakpur">Zirakpur</option>
              <option value="panchkula">Panchkula</option>
            </select>

            <select
              value={filters.budget}
              onChange={(e) => setFilters({...filters, budget: e.target.value})}
              className="bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="">Budget</option>
              <option value="50-70">₹50-70 Lakh</option>
              <option value="70-100">₹70-100 Lakh</option>
              <option value="100+">₹1 Cr+</option>
            </select>

            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-gray-400 text-sm">AI Suggestions:</span>
          {['Family home with garden', 'Investment property', 'Luxury apartment', 'Near IT hubs'].map((suggestion, index) => (
            <button
              key={index}
              className="text-xs bg-gray-700/50 hover:bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full transition-colors duration-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Property Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-gray-800/40 backdrop-blur-md border border-gray-600/30 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 group"
          >
            {/* Property Image */}
            <div className="relative overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {property.score}% Match
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-gray-900/50 rounded-full text-white hover:text-red-400 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-2 bg-gray-900/50 rounded-full text-white hover:text-cyan-400 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{property.title}</h3>
              <div className="flex items-center text-gray-400 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-cyan-400">{property.price}</span>
                <span className="text-gray-400 text-sm">{property.area}</span>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-gray-300">
                <div className="flex items-center space-x-1">
                  <Bed className="w-4 h-4" />
                  <span className="text-sm">{property.bedrooms}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bath className="w-4 h-4" />
                  <span className="text-sm">{property.bathrooms}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Car className="w-4 h-4" />
                  <span className="text-sm">{property.parking}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {property.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                  View Details
                </button>
                <button className="px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-white transition-all duration-300">
                  3D Tour
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartFinder;