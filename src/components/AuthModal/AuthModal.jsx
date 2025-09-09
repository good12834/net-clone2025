'use client';

import { useState } from 'react';
import TMDBService from '../../services/tmdb'; // Fixed import path
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestToken = await TMDBService.createRequestToken();
      // Use production URL for GitHub Pages deployment
      const isProduction = window.location.hostname !== 'localhost';
      const baseUrl = isProduction
        ? 'https://good12834.github.io/net-clone2025'
        : 'http://localhost:5179';
      const redirectUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${baseUrl}/auth-callback`;
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('AuthModal error:', err.message);
      if (err.message.includes('Invalid TMDB API key')) {
        setError('Invalid TMDB API key. Please contact support.');
      } else if (err.message.includes('rate limit')) {
        setError('TMDB API rate limit exceeded. Please try again in a few seconds.');
      } else {
        setError('Failed to initiate TMDB authentication. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <button className="auth-close" onClick={onClose}>
          &times;
        </button>
        <h2>Sign In</h2>
        <p>Connect your TMDB account to access personalized features.</p>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" onClick={handleAuth} disabled={loading}>
          {loading ? 'Connecting...' : 'Sign in with TMDB'}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
