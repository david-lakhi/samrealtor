import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, Home } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Sector 22, Chandigarh',
      property: '3BHK Apartment',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: "Sam's AI property finder understood exactly what we wanted. Within a week, we found our dream home with a garden view. The 3D tours saved us so much time, and the AI negotiated a great price for us!",
      highlight: 'Found dream home in 1 week'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Phase 8, Mohali',
      property: 'Commercial Space',
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: "The investment insights were spot on. Sam's AI predicted 18% ROI, and we're already seeing great returns after just 8 months. The market analysis helped us make the right decision at the right time.",
      highlight: '18% ROI achieved'
    },
    {
      id: 3,
      name: 'Meera Patel',
      location: 'Zirakpur',
      property: '4BHK Villa',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: "The AR property viewing was incredible! We could see exactly how our furniture would look. Sam's team handled all the legal work seamlessly. Best real estate experience ever!",
      highlight: 'Seamless legal support'
    },
    {
      id: 4,
      name: 'Amit Singh',
      location: 'Panchkula',
      property: '2BHK Smart Home',
      rating: 5,
      image: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: "The AI concierge was available 24/7 and answered all our queries instantly. From property search to key handover, everything was perfectly managed. Highly recommend Sam Realtor!",
      highlight: '24/7 AI support'
    },
    {
      id: 5,
      name: 'Sunita Gupta',
      location: 'Sector 35, Chandigarh',
      property: 'Investment Property',
      rating: 5,
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: "Sam's market predictions were incredibly accurate. We bought at the perfect time and the property value has increased by 22% in just one year. The AI investment advisor is a game-changer!",
      highlight: '22% value increase'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const stats = [
    { value: '4.9/5', label: 'Average Rating' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '48hrs', label: 'Avg Response Time' },
    { value: '5000+', label: 'Happy Customers' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Customer Success Stories
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Real experiences from families who found their perfect homes with our AI-powered platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 text-center"
          >
            <div className="text-2xl lg:text-3xl font-bold text-cyan-400 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Testimonial */}
      <div className="relative mb-16">
        <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Customer Image & Info */}
            <div className="flex-shrink-0 text-center lg:text-left">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-24 h-24 rounded-full mx-auto lg:mx-0 mb-4 border-2 border-cyan-400"
              />
              <h3 className="text-xl font-semibold text-white mb-1">
                {testimonials[currentTestimonial].name}
              </h3>
              <div className="flex items-center justify-center lg:justify-start space-x-1 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">
                  {testimonials[currentTestimonial].location}
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-1 mb-3">
                <Home className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm">
                  {testimonials[currentTestimonial].property}
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-1">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="flex-1">
              <Quote className="w-8 h-8 text-cyan-400 mb-4 mx-auto lg:mx-0" />
              <p className="text-gray-300 text-lg leading-relaxed mb-6 text-center lg:text-left">
                {testimonials[currentTestimonial].text}
              </p>
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg p-4 text-center lg:text-left">
                <span className="text-cyan-400 font-semibold">
                  ✨ {testimonials[currentTestimonial].highlight}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevTestimonial}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full p-3 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-cyan-400" />
        </button>
        <button
          onClick={nextTestimonial}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full p-3 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 text-cyan-400" />
        </button>
      </div>

      {/* Testimonial Dots */}
      <div className="flex justify-center space-x-2 mb-12">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentTestimonial
                ? 'bg-cyan-400 scale-125'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Additional Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full border border-cyan-400"
              />
              <div>
                <h4 className="text-white font-semibold">{testimonial.name}</h4>
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3 line-clamp-3">
              {testimonial.text}
            </p>
            <div className="text-cyan-400 text-xs font-semibold">
              {testimonial.highlight}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;