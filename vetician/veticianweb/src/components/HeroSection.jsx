import React from 'react'
import './HeroSection.css'

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Revolutionizing Pet Healthcare
            </h1>
            <p className="hero-subtitle">
              Connecting Vets, Pet Parents, Paravets, and Pet Resorts in one comprehensive platform
            </p>
            
            <div className="qr-section">
              <div className="qr-codes">
                <div className="qr-item">
                  <div className="qr-placeholder">
                    <div className="qr-code"></div>
                  </div>
                  <p>Download for Android</p>
                </div>
                <div className="qr-item">
                  <div className="qr-placeholder">
                    <div className="qr-code"></div>
                  </div>
                  <p>Download for iOS</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="app-preview">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="app-interface">
                    <div className="status-bar"></div>
                    <div className="app-header">
                      <h3>Vetician</h3>
                    </div>
                    <div className="app-features">
                      <div className="feature-item">📅 Book Appointments</div>
                      <div className="feature-item">🏥 Find Vets</div>
                      <div className="feature-item">💊 Track Medicine</div>
                      <div className="feature-item">📋 Health Records</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="floating-elements">
                <div className="floating-card appointment">
                  <div className="card-icon">📅</div>
                  <p>Next Appointment</p>
                  <span>Tomorrow 2:00 PM</span>
                </div>
                
                <div className="floating-card reminder">
                  <div className="card-icon">💊</div>
                  <p>Medicine Reminder</p>
                  <span>Due in 2 hours</span>
                </div>
                
                <div className="floating-card emergency">
                  <div className="card-icon">🚨</div>
                  <p>Emergency Vet</p>
                  <span>Available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection