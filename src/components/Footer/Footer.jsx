'use client';

import { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState(null);
  const [newsletterSuccess, setNewsletterSuccess] = useState(null);
  const [language, setLanguage] = useState('en');

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    try {
      const newsletterRef = collection(db, 'newsletter');
      await addDoc(newsletterRef, { email, timestamp: new Date() });
      setNewsletterSuccess('Subscribed successfully!');
      setEmail('');
      setNewsletterError(null);
    } catch (err) {
      console.error('Newsletter signup error:', err.message);
      setNewsletterError('Failed to subscribe. Please try again.');
      setNewsletterSuccess(null);
    }
  };

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    console.log(`Language changed to: ${e.target.value}`);
    // Simulate UI update (e.g., translate text) - extend with i18n library if needed
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <div className="footer-netflix-logo">
            <span className="footer-netflix-n">N</span>
            <span className="footer-netflix-etflix">ETFLIX</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Netflix Clone. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Help</h4>
            <ul>
              <li><a href="#faq" onClick={(e) => handleLinkClick(e, 'faq')}>FAQ</a></li>
              <li><a href="#help-center" onClick={(e) => handleLinkClick(e, 'help-center')}>Help Center</a></li>
              <li><a href="#terms" onClick={(e) => handleLinkClick(e, 'terms')}>Terms of Use</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#about" onClick={(e) => handleLinkClick(e, 'about')}>About Us</a></li>
              <li><a href="#careers" onClick={(e) => handleLinkClick(e, 'careers')}>Careers</a></li>
              <li><a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')}>Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy" onClick={(e) => handleLinkClick(e, 'privacy')}>Privacy Policy</a></li>
              <li><a href="#cookie-policy" onClick={(e) => handleLinkClick(e, 'cookie-policy')}>Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" data-tooltip="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" data-tooltip="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" data-tooltip="GitHub">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <form onSubmit={handleNewsletterSignup}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
          {newsletterError && <div className="newsletter-error">{newsletterError}</div>}
          {newsletterSuccess && <div className="newsletter-success">{newsletterSuccess}</div>}
          <div className="language-selector">
            <select value={language} onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>
      <button className="back-to-top" onClick={handleBackToTop}>Back to Top</button>
    </footer>
  );
};

export default Footer;