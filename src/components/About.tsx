import React from 'react';
import { Award, Users, TrendingUp, Shield, Star, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  const achievements = [
    { icon: Users, value: '5000+', label: 'Happy Families' },
    { icon: TrendingUp, value: '₹500Cr+', label: 'Properties Sold' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Star, value: '4.9', label: 'Customer Rating' }
  ];

  const services = [
    {
      icon: Shield,
      title: 'Legal Assistance',
      description: 'Complete legal support and documentation guidance',
      features: ['Property verification', 'Document preparation', 'Legal compliance']
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'AI-powered investment recommendations and market analysis',
      features: ['ROI predictions', 'Market trends', 'Portfolio optimization']
    },
    {
      icon: Users,
      title: 'Personal Concierge',
      description: '24/7 dedicated support for all your real estate needs',
      features: ['Property tours', 'Negotiation support', 'After-sales service']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            About Sam Realtor
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Pioneering the future of real estate with AI-powered solutions 
          and unmatched expertise in the Tricity region.
        </p>
      </div>

      {/* Sam's Profile */}
      <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="w-48 h-48 mx-auto lg:mx-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
              <Users className="w-24 h-24 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">Meet Sam Realtor</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              With over 15 years of experience in the Tricity real estate market, 
              Sam has revolutionized property buying and selling through innovative 
              AI technology. Specializing in Chandigarh, Mohali, Zirakpur, and 
              Panchkula, Sam combines deep market knowledge with cutting-edge technology 
              to deliver exceptional results.
            </p>
            
            <div className="space-y-3">
              {[
                'Certified Real Estate Professional',
                'AI Technology Pioneer in Real Estate',
                'Tricity Market Specialist',
                'Customer Satisfaction Champion'
              ].map((credential, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">{credential}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <div
              key={index}
              className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 text-center hover:border-cyan-400/50 transition-all duration-300"
            >
              <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {achievement.value}
              </div>
              <div className="text-gray-400 text-sm">{achievement.label}</div>
            </div>
          );
        })}
      </div>

      {/* Services */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-white text-center mb-8">
          Comprehensive Real Estate Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h4 className="text-xl font-semibold text-white mb-3">{service.title}</h4>
                <p className="text-gray-300 mb-4">{service.description}</p>
                
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">Our Mission</h3>
          <p className="text-gray-300 leading-relaxed">
            To democratize real estate through AI technology, making property 
            buying and selling transparent, efficient, and accessible to everyone. 
            We strive to eliminate traditional barriers and create a seamless 
            experience powered by data-driven insights.
          </p>
        </div>
        
        <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-purple-400 mb-4">Our Vision</h3>
          <p className="text-gray-300 leading-relaxed">
            To become the leading AI-powered real estate platform in North India, 
            setting new standards for customer service, technological innovation, 
            and market transparency. We envision a future where finding your 
            dream home is as simple as describing it.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 text-center">
        <h3 className="text-3xl font-bold text-white mb-8">Why Choose Sam Realtor?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'AI-Powered', desc: 'Cutting-edge technology for better decisions' },
            { title: 'Transparent', desc: 'No hidden costs or surprise fees' },
            { title: 'Expert Guidance', desc: '15+ years of market expertise' },
            { title: 'End-to-End', desc: 'Complete support from search to settlement' }
          ].map((reason, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{reason.title}</h4>
              <p className="text-gray-400 text-sm">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;