import React, { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, PieChart, Target, Lightbulb, ArrowUp, ArrowDown } from 'lucide-react';

const InvestmentInsights: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState('residential');
  const [investmentType, setInvestmentType] = useState('resale');

  const investmentData = {
    residential: {
      roi: '+15.2%',
      appreciation: '+8.5%',
      rental: '+6.7%',
      risk: 'Low',
      timeline: '3-5 years'
    },
    commercial: {
      roi: '+18.7%',
      appreciation: '+12.1%',
      rental: '+9.2%',
      risk: 'Medium',
      timeline: '5-7 years'
    },
    plots: {
      roi: '+22.3%',
      appreciation: '+15.8%',
      rental: 'N/A',
      risk: 'High',
      timeline: '7-10 years'
    }
  };

  const topPicks = [
    {
      id: 1,
      title: 'IT Park Vicinity - Mohali',
      type: '3BHK Apartments',
      price: '₹75 Lakh',
      expectedRoi: '18%',
      reason: 'Growing IT sector demand',
      risk: 'Low',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Sector 17 Commercial',
      type: 'Office Spaces',
      price: '₹1.2 Cr',
      expectedRoi: '22%',
      reason: 'Prime location, high rental demand',
      risk: 'Medium',
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Zirakpur Highway Plots',
      type: 'Residential Plots',
      price: '₹45 Lakh',
      expectedRoi: '25%',
      reason: 'Infrastructure development',
      risk: 'High',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const marketTrends = [
    { area: 'Chandigarh', trend: 'up', percentage: '+12%', reason: 'Government policies' },
    { area: 'Mohali', trend: 'up', percentage: '+15%', reason: 'IT expansion' },
    { area: 'Zirakpur', trend: 'up', percentage: '+18%', reason: 'Connectivity projects' },
    { area: 'Panchkula', trend: 'up', percentage: '+10%', reason: 'Green initiatives' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AI Investment Insights
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          AI-powered investment analysis with predictive ROI models, 
          market trends, and personalized recommendations for optimal returns.
        </p>
      </div>

      {/* Investment Type Selector */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-xl p-2 flex space-x-2">
          {[
            { key: 'residential', label: 'Residential' },
            { key: 'commercial', label: 'Commercial' },
            { key: 'plots', label: 'Plots' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedProperty(key)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                selectedProperty === key
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Investment Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ROI Card */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Expected ROI</h3>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">
              {investmentData[selectedProperty as keyof typeof investmentData].roi}
            </div>
            <p className="text-gray-400 text-sm">
              Over {investmentData[selectedProperty as keyof typeof investmentData].timeline}
            </p>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full w-3/4" />
            </div>
          </div>

          {/* Appreciation Card */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Price Appreciation</h3>
              <BarChart3 className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {investmentData[selectedProperty as keyof typeof investmentData].appreciation}
            </div>
            <p className="text-gray-400 text-sm">Annual growth rate</p>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full w-2/3" />
            </div>
          </div>

          {/* Rental Yield Card */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Rental Yield</h3>
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {investmentData[selectedProperty as keyof typeof investmentData].rental}
            </div>
            <p className="text-gray-400 text-sm">Annual rental income</p>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full w-1/2" />
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Risk Level</h3>
              <Target className="w-6 h-6 text-yellow-400" />
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              investmentData[selectedProperty as keyof typeof investmentData].risk === 'Low' ? 'text-green-400' :
              investmentData[selectedProperty as keyof typeof investmentData].risk === 'Medium' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {investmentData[selectedProperty as keyof typeof investmentData].risk}
            </div>
            <p className="text-gray-400 text-sm">Investment risk assessment</p>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
              <div className={`h-2 rounded-full ${
                investmentData[selectedProperty as keyof typeof investmentData].risk === 'Low' ? 'bg-green-400 w-1/3' :
                investmentData[selectedProperty as keyof typeof investmentData].risk === 'Medium' ? 'bg-yellow-400 w-2/3' : 'bg-red-400 w-full'
              }`} />
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">AI Recommendation</h3>
            </div>
            <div className="space-y-3">
              <p className="text-cyan-400 font-semibold">Best Time to Invest: NOW</p>
              <p className="text-gray-300 text-sm">
                Market conditions are favorable with upcoming infrastructure projects. 
                Expected 15-20% appreciation in the next 2 years.
              </p>
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-400 text-sm font-semibold">✓ Recommended Action</p>
                <p className="text-gray-300 text-xs">
                  Focus on {selectedProperty} properties near IT corridors
                </p>
              </div>
            </div>
          </div>

          {/* Market Trends */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Market Trends</h3>
            <div className="space-y-3">
              {marketTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {trend.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-gray-300 text-sm">{trend.area}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-semibold">{trend.percentage}</p>
                    <p className="text-gray-500 text-xs">{trend.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Investment Picks */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          🎯 AI-Curated Top Investment Picks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPicks.map((pick) => (
            <div
              key={pick.id}
              className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={pick.image}
                  alt={pick.title}
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {pick.expectedRoi} ROI
                </div>
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                  pick.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                  pick.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {pick.risk} Risk
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-lg font-semibold text-white mb-2">{pick.title}</h4>
                <p className="text-gray-400 text-sm mb-3">{pick.type}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-cyan-400">{pick.price}</span>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
                  <p className="text-cyan-400 text-sm font-semibold mb-1">Why this pick?</p>
                  <p className="text-gray-300 text-xs">{pick.reason}</p>
                </div>

                <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                  Get Detailed Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Calculator */}
      <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          🧮 AI Investment Calculator
        </h3>
        <p className="text-gray-300 mb-6">
          Get personalized investment projections based on your budget and goals
        </p>
        <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
          Launch Calculator
        </button>
      </div>
    </div>
  );
};

export default InvestmentInsights;