import React, { useState } from 'react';
import { MessageCircle, Send, Bot, User, Calendar, FileText, Phone, Clock } from 'lucide-react';

const AIConcierge: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hello! I'm Sam's AI Concierge. I can help you with property queries, schedule visits, explain paperwork, and even assist with negotiations. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickActions = [
    { icon: Calendar, label: 'Schedule Visit', action: 'schedule' },
    { icon: FileText, label: 'Explain Documents', action: 'documents' },
    { icon: Phone, label: 'Call Sam', action: 'call' },
    { icon: MessageCircle, label: 'Property Query', action: 'query' }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        message: "I understand you're interested in that property. Let me check the available time slots for a visit. I can schedule you for tomorrow at 2 PM or this weekend. Which works better for you?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'schedule':
        message = 'I want to schedule a property visit';
        break;
      case 'documents':
        message = 'Can you explain the legal documents required?';
        break;
      case 'call':
        message = 'I want to speak with Sam directly';
        break;
      case 'query':
        message = 'I have questions about a specific property';
        break;
    }
    setInputMessage(message);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AI Concierge Service
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Your 24/7 AI assistant for all real estate needs. Get instant answers, 
          schedule visits, understand paperwork, and receive personalized guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-cyan-500/30 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Concierge</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-green-400">Online & Ready to Help</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md`}>
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`rounded-2xl p-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'bg-gray-700/50 text-gray-100'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-cyan-500/30 p-6">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message or ask anything..."
                  className="flex-1 bg-gray-900/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Features */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-700/30 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 text-left group"
                  >
                    <Icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                    <span className="text-gray-300 group-hover:text-white">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Capabilities */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Capabilities</h3>
            <div className="space-y-4">
              {[
                '📋 Document Analysis',
                '💰 Price Negotiation',
                '📅 Smart Scheduling',
                '🏠 Property Recommendations',
                '📊 Market Insights',
                '⚖️ Legal Guidance'
              ].map((capability, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <span className="text-gray-300 text-sm">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Availability</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white text-sm">24/7 AI Support</p>
                  <p className="text-gray-400 text-xs">Instant responses anytime</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white text-sm">Sam Realtor</p>
                  <p className="text-gray-400 text-xs">Mon-Sat, 9 AM - 8 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConcierge;