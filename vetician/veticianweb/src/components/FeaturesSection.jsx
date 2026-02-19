import React from 'react'
import './FeaturesSection.css'

const FeaturesSection = () => {
  const features = {
    veterinarians: [
      'Digital appointment management',
      'Patient history and records',
      'Digital prescriptions',
      'Online consultations',
      'Payment management',
      'Medical record keeping'
    ],
    petParents: [
      'Easy vet appointment booking',
      'Pet health records',
      'Vaccination reminders',
      'Medicine schedules',
      'Emergency vet locator',
      'Digital prescriptions access',
      'Pet health timeline'
    ],
    paravets: [
      'Connect with veterinarians',
      'Access to medical guidelines',
      'House call management',
      'Service history tracking',
      'Digital reports submission',
      'Emergency response system'
    ],
    petResorts: [
      'Booking management',
      'Pet care schedules',
      'Real-time updates to owners',
      'Facility management',
      'Pet health monitoring',
      'Digital documentation'
    ]
  }

  const userTypes = [
    {
      key: 'veterinarians',
      title: 'For Veterinarians',
      icon: '👨‍⚕️',
      color: '#2563eb',
      description: 'Streamline your practice with digital tools and efficient patient management'
    },
    {
      key: 'petParents',
      title: 'For Pet Parents',
      icon: '🐕',
      color: '#0ea5e9',
      description: 'Keep your furry friends healthy and happy with comprehensive care tools'
    },
    {
      key: 'paravets',
      title: 'For Paravets',
      icon: '🩺',
      color: '#06b6d4',
      description: 'Enhance your veterinary support services with specialized features'
    },
    {
      key: 'petResorts',
      title: 'For Pet Resorts',
      icon: '🏨',
      color: '#0891b2',
      description: 'Manage your pet boarding facility efficiently with dedicated tools'
    }
  ]

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Features & Use Cases</h2>
        <p className="section-subtitle">
          Vetician serves every stakeholder in the pet healthcare ecosystem with specialized tools and features designed to streamline operations and improve pet care
        </p>
        
        <div className="features-grid">
          {userTypes.map((userType, index) => (
            <div key={userType.key} className="feature-category fade-in" style={{animationDelay: `${index * 0.2}s`}}>
              <div className="category-header">
                <div className="category-icon" style={{backgroundColor: userType.color}}>
                  {userType.icon}
                </div>
                <div>
                  <h3 className="category-title">{userType.title}</h3>
                  <p className="category-description">{userType.description}</p>
                </div>
              </div>
              
              <ul className="features-list">
                {features[userType.key].map((feature, featureIndex) => (
                  <li key={featureIndex} className="feature-item">
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection