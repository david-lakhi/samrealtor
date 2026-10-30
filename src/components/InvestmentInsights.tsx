import React, { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, Target, Lightbulb, ArrowUp, ArrowDown } from 'lucide-react';

const InvestmentInsights: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState('residential');

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

    </div>
  );
};

export default InvestmentInsights;
