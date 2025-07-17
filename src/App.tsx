import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SmartFinder from './components/SmartFinder';
import Explore3D from './components/Explore3D';
import AIConcierge from './components/AIConcierge';
import InvestmentInsights from './components/InvestmentInsights';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import ParticleBackground from './components/ParticleBackground';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-x-hidden">
      <ParticleBackground />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="relative z-10">
        <section id="home" className="min-h-screen">
          <Hero />
        </section>
        
        <section id="smart-finder" className="min-h-screen py-20">
          <SmartFinder />
        </section>
        
        <section id="explore" className="min-h-screen py-20">
          <Explore3D />
        </section>
        
        <section id="concierge" className="min-h-screen py-20">
          <AIConcierge />
        </section>
        
        <section id="investment" className="min-h-screen py-20">
          <InvestmentInsights />
        </section>
        
        <section id="about" className="min-h-screen py-20">
          <About />
        </section>
        
        <section id="testimonials" className="py-20">
          <Testimonials />
        </section>
        
        <section id="contact" className="py-20">
          <Contact />
        </section>
      </main>
    </div>
  );
}

export default App;