import React from 'react'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact', href: '#contact' },
    { name: 'Support', href: '#support' }
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'GDPR', href: '#gdpr' }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#facebook' },
    { name: 'Twitter', icon: '🐦', href: '#twitter' },
    { name: 'Instagram', icon: '📷', href: '#instagram' },
    { name: 'LinkedIn', icon: '💼', href: '#linkedin' }
  ]

  return (
    <footer className="footer">
      <div className="footer-wave"></div>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <h3 className="brand-name">Vetician</h3>
              <p className="brand-tagline">
                Your Complete Pet Healthcare Solution
              </p>
              <p className="brand-description">
                Connecting vets, pet parents, paravets, and pet resorts in one comprehensive platform for better pet healthcare management.
              </p>
            </div>
            
            <div className="download-section">
              <h4>Download Our App</h4>
              <div className="download-buttons">
                <a href="#" className="download-btn">
                  <span className="download-icon">📱</span>
                  <div>
                    <small>Download for</small>
                    <strong>Android</strong>
                  </div>
                </a>
                <a href="#" className="download-btn">
                  <span className="download-icon">🍎</span>
                  <div>
                    <small>Download for</small>
                    <strong>iOS</strong>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="section-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="section-title">Legal</h4>
            <ul className="footer-links">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="section-title">Connect With Us</h4>
            <div className="social-links">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} className="social-link" title={social.name}>
                  {social.icon}
                  <span className="social-tooltip">{social.name}</span>
                </a>
              ))}
            </div>
            
            <div className="contact-info">
              <p><span className="contact-icon">📧</span> care@vetician.com</p>
              <p><span className="contact-icon">📞</span> +1 (555) 123-4567</p>
              <p><span className="contact-icon">📍</span> Gurugram, Hariyana</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {currentYear} Vetician. All rights reserved.</p>
          </div>
          <div className="footer-tagline">
            <p>Made with <span className="heart">❤️</span> for pets and their families</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer