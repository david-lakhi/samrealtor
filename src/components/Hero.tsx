import React, { useState } from 'react';
import { Mic, MicOff, Search, Sparkles, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // In a real app, you'd implement speech recognition here
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setSearchQuery("I want a 3BHK apartment with garden view in Chandigarh");
      }, 3000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main headline */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
            <span className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">
              AI-Powered Real Estate
            </span>
            <Sparkles className="w-8 h-8 text-cyan-400 ml-3 animate-pulse" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Tell us your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent animate-pulse">
              dream.
            </span>
            <br />
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AI will find your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent animate-pulse">
              home.
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of real estate in{' '}
            <span className="text-cyan-400 font-semibold">Chandigarh</span>,{' '}
            <span className="text-green-400 font-semibold">Mohali</span>,{' '}
            <span className="text-purple-400 font-semibold">Zirakpur</span> &{' '}
            <span className="text-cyan-400 font-semibold">Panchkula</span>
          </p>
        </div>

        {/* AI Search Interface */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your dream home... (or use voice)"
                className="w-full bg-gray-900/50 border border-gray-600/50 rounded-xl px-6 py-4 text-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              />
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                <button
                  onClick={handleVoiceSearch}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-cyan-500 text-white hover:bg-cyan-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {isListening && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce delay-200" />
                <span className="ml-2 text-sm">Listening...</span>
              </div>
            )}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {[
            { title: '3D Virtual Tours', desc: 'Explore properties in immersive 3D', color: 'from-cyan-500 to-blue-500' },
            { title: 'AR Property View', desc: 'See homes through your phone camera', color: 'from-green-500 to-cyan-500' },
            { title: 'AI Investment Advisor', desc: 'Smart recommendations for ROI', color: 'from-purple-500 to-pink-500' }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/30 backdrop-blur-md border border-gray-600/30 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="group bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
          Start Your AI Journey
          <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default Hero;