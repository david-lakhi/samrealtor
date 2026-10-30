import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Calendar, FileText, Loader2, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: 'inquiry',
    propertyType: '',
    budget: '',
    date: '',
    time: '',
    location: '',
    consent: false,
    message: ''
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [website, setWebsite] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setFormSuccess('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...formData, type: formData.requestType, source: 'contact form', website }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your message. Please try again.');
      const wasVisit = formData.requestType === 'visit';
      setFormData({ name: '', email: '', phone: '', requestType: 'inquiry', propertyType: '', budget: '', date: '', time: '', location: '', consent: false, message: '' });
      setWebsite('');
      setFormSuccess(wasVisit ? 'Your visit request has been sent. Sam will contact you to confirm the time.' : 'Your enquiry has been sent. Sam will get back to you soon.');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not send your message. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const goToConcierge = () => {
    document.getElementById('concierge')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToVisitForm = () => {
    setFormData((current) => ({ ...current, requestType: 'visit' }));
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToConsultationForm = () => {
    setFormData((current) => ({ ...current, requestType: 'inquiry', message: current.message || 'I would like to discuss my property requirements and get a consultation.' }));
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const localToday = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 88470 24002',
      subContent: 'Mon-Sat, 9 AM - 8 PM',
      color: 'text-green-400'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'sam.realtorz@gmail.com',
      subContent: 'Quick response guaranteed',
      color: 'text-cyan-400'
    },
    {
      icon: MapPin,
      title: 'Visit Office',
      content: 'Sector 17, Chandigarh',
      subContent: 'Main real estate hub',
      color: 'text-purple-400'
    },
    {
      icon: Clock,
      title: 'AI Available',
      content: '24/7 Support',
      subContent: 'Always here to help',
      color: 'text-yellow-400'
    }
  ];

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'AI Chat',
      description: 'Get instant answers',
      action: 'Start chatting with AI'
    },
    {
      icon: Calendar,
      title: 'Schedule Visit',
      description: 'Book property tours',
      action: 'Schedule now'
    },
    {
      icon: FileText,
      title: 'Get Consultation',
      description: 'Free market analysis',
      action: 'Book consultation'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Get In Touch
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Ready to find your dream home? Contact Sam Realtor today for 
          personalized AI-powered real estate solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
          
          <form id="contact-form" onSubmit={handleSubmit} className="scroll-mt-24 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">What can we help you with? *</label>
              <select name="requestType" value={formData.requestType} onChange={handleInputChange} className="w-full rounded-lg border border-gray-600/50 bg-gray-900/50 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20">
                <option value="inquiry">Ask a question / property enquiry</option>
                <option value="visit">Plan a property visit</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                  maxLength={100}
                  required
                  className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  maxLength={200}
                  required
                  className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={20}
                  required
                  className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="+91 88470 24002"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                >
                  <option value="">Select property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="independent house">Independent house</option>
                  <option value="villa">Villa</option>
                  <option value="farmhouse">Farmhouse</option>
                  <option value="builder floor">Builder floor</option>
                  <option value="plot">Plot</option>
                  <option value="agricultural land">Agricultural land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Budget Range
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              >
                <option value="">Select budget range</option>
                <option value="30-50">₹30-50 Lakh</option>
                <option value="50-75">₹50-75 Lakh</option>
                <option value="75-100">₹75 Lakh - 1 Cr</option>
                <option value="100+">₹1 Cr+</option>
              </select>
            </div>

            {formData.requestType === 'visit' && <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div><label className="mb-2 block text-sm font-medium text-gray-300">Preferred visit date *</label><input type="date" name="date" min={localToday()} value={formData.date} onChange={handleInputChange} required className="w-full rounded-lg border border-gray-600/50 bg-gray-900/50 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20" /></div>
              <div><label className="mb-2 block text-sm font-medium text-gray-300">Preferred time *</label><input type="time" name="time" value={formData.time} onChange={handleInputChange} required className="w-full rounded-lg border border-gray-600/50 bg-gray-900/50 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20" /></div>
              <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-gray-300">Meeting location or preferred area *</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} maxLength={200} required placeholder="e.g. Sector 67, Mohali or a nearby landmark" className="w-full rounded-lg border border-gray-600/50 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20" /></div>
            </div>}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                {formData.requestType === 'visit' ? 'Additional notes (optional)' : 'Your question *'}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                maxLength={1200}
                required={formData.requestType === 'inquiry'}
                className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                placeholder={formData.requestType === 'visit' ? 'Any details to help us plan the visit…' : 'Tell us what you would like to know…'}
              />
            </div>

            <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-400"><input type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} required className="mt-1 accent-cyan-400" /><span>I agree that Sam Realtor may contact me about this {formData.requestType === 'visit' ? 'visit request' : 'enquiry'} using the details I provided. *</span></label>
            <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label></div>
            {formError && <p role="alert" className="text-sm text-rose-300">{formError}</p>}
            {formSuccess && <p role="status" className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0" />{formSuccess}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{saving ? 'Sending…' : formData.requestType === 'visit' ? 'Send visit request' : 'Send enquiry'}</span>
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{info.title}</h4>
                      <p className={`${info.color} font-medium`}>{info.content}</p>
                      <p className="text-gray-400 text-sm">{info.subContent}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
            
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={action.title === 'AI Chat' ? goToConcierge : action.title === 'Schedule Visit' ? goToVisitForm : goToConsultationForm}
                    className="w-full flex items-center space-x-4 p-4 bg-gray-700/30 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 text-left group"
                  >
                    <Icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
                    <div>
                      <h4 className="text-white font-semibold group-hover:text-cyan-300">
                        {action.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-4">Our Locations</h3>
            <div className="h-48 bg-gray-700/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-gray-300">Interactive Map</p>
                <p className="text-gray-500 text-sm">Serving entire Tricity region</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Need Immediate Assistance?</h3>
        <p className="text-gray-300 mb-6">
          Our AI Concierge is available 24/7 for urgent queries and support
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+918847024002" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>Call Now: +91 88470 24002</span>
          </a>
          <button type="button" onClick={goToConcierge} className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Chat with AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
