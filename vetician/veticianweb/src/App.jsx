import React from 'react'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import StatsSection from './components/StatsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="App">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default App