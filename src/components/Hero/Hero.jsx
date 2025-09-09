'use client';

import { useState, useEffect } from 'react';
import './Hero.css';

const Hero = ({ movie, onPlayTrailer }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); // Trigger fade-in animation
  }, [movie]);

  if (!movie) return null;

  const handleWatchNow = () => {
    console.log(`Streaming ${movie.title}...`);
    alert(`Streaming ${movie.title} (simulated)`);
  };

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.9) 100%), url(${movie.backdrop || movie.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Netflix-style decorative elements */}
      <div className="hero-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
        <div className="decoration-circle circle-4"></div>
        <div className="decoration-circle circle-5"></div>
      </div>

      {/* Animated background particles */}
      <div className="hero-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      <div className="hero-overlay"></div>

      {/* Featured movie poster on the right */}
      <div className="hero-poster">
        <div className="poster-container">
          <img src={movie.image} alt={movie.title} className="poster-image" />
          <div className="poster-glow"></div>
        </div>
      </div>

      <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
        <div className="hero-badge">
          <span className="badge-text">FEATURED</span>
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <div className="hero-meta">
          <div className="meta-item">
            <i className="fas fa-star"></i>
            <span className="hero-rating">{movie.match}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-calendar"></i>
            <span className="hero-year">{movie.duration}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-film"></i>
            <span className="hero-genre">{movie.genre}</span>
          </div>
        </div>

        <p className="hero-description">{movie.description}</p>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">4.8</span>
            <span className="stat-label">Rating</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">2.1M</span>
            <span className="stat-label">Views</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">HD</span>
            <span className="stat-label">Quality</span>
          </div>
        </div>

        <div className="hero-buttons">
          <button className="hero-btn play-btn" onClick={() => onPlayTrailer(movie)}>
            <div className="btn-glow"></div>
            <i className="fas fa-play"></i>
            <span>Play Trailer</span>
          </button>
          <button className="hero-btn watch-btn" onClick={handleWatchNow}>
            <i className="fas fa-plus"></i>
            <span>My List</span>
          </button>
          <button className="hero-btn info-btn" onClick={() => setShowInfoModal(true)}>
            <i className="fas fa-info-circle"></i>
            <span>More Info</span>
          </button>
        </div>

        {/* Age rating badge */}
        <div className="age-rating">
          <span className="rating-badge">13+</span>
        </div>
      </div>
      {isHovered && movie.trailer && (
        <div className="hero-preview">
          <iframe
            src={`${movie.trailer}&mute=1`}
            title={`${movie.title} Preview`}
            frameBorder="0"
            allow="autoplay"
          ></iframe>
        </div>
      )}
      {showInfoModal && (
        <div className="info-modal">
          <div className="info-modal-content">
            <button className="info-modal-close" onClick={() => setShowInfoModal(false)}>
              &times;
            </button>
            <h2>{movie.title}</h2>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Rating:</strong> {movie.match}</p>
            <p><strong>Duration:</strong> {movie.duration}</p>
            <p><strong>Description:</strong> {movie.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;