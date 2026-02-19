import React from 'react'
import './StatsSection.css'

const StatsSection = () => {
  const stats = [
    {
      number: '50K+',
      label: 'Active Users',
      description: 'Pet parents trust Vetician',
      icon: '👥'
    },
    {
      number: '1,200+',
      label: 'Registered Veterinarians',
      description: 'Professional vets on our platform',
      icon: '👨‍⚕️'
    },
    {
      number: '300+',
      label: 'Pet Resorts Connected',
      description: 'Quality boarding facilities',
      icon: '🏨'
    },
    {
      number: '100K+',
      label: 'Successful Appointments',
      description: 'Happy pets and satisfied owners',
      icon: '✅'
    }
  ]

  return (
    <section className="stats-section section">
      <div className="container">
        <h2 className="section-title">Trusted by Thousands</h2>
        <p className="section-subtitle">
          Join our growing community of pet healthcare professionals and loving pet parents
        </p>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item card fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <p className="stat-description">{stat.description}</p>
            </div>
          ))}
        </div>
        
        <div className="testimonial-section">
          <div className="testimonial card">
            <div className="testimonial-content">
              <p>"Vetician has transformed how I manage my veterinary practice. The digital appointment system and patient records have made everything so much more efficient."</p>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍⚕️</div>
                <div>
                  <div className="author-name">Dr. Sarah Johnson</div>
                  <div className="author-title">Veterinarian, PetCare Clinic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection