import React from 'react'
import './HowItWorksSection.css'

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Download App',
      description: 'Download Vetician from Google Play Store or Apple App Store',
      icon: '📱'
    },
    {
      number: 2,
      title: 'Create Profile',
      description: 'Set up your profile based on your role - Vet, Pet Parent, Paravet, or Resort',
      icon: '👤'
    },
    {
      number: 3,
      title: 'Connect with Services',
      description: 'Browse and connect with veterinarians, paravets, or pet resorts in your area',
      icon: '🔗'
    },
    {
      number: 4,
      title: 'Book & Manage',
      description: 'Book appointments, manage schedules, and track your pet\'s health journey',
      icon: '📅'
    }
  ]

  return (
    <section className="how-it-works-section section">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Getting started with Vetician is simple and straightforward. Follow these easy steps to join our pet healthcare community.
        </p>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={step.number} className="step-item fade-in" style={{animationDelay: `${index * 0.2}s`}}>
              <div className="step-number">
                <span>{step.number}</span>
              </div>
              
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <div className="connector-line"></div>
                  <div className="connector-arrow">→</div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="cta-section">
          <a href="#" className="btn btn-primary">Get Started Today</a>
          <a href="#contact" className="btn btn-secondary">Learn More</a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection