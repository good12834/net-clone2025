'use client';

import { useState, useEffect } from 'react';
import TMDBService from '../../services/tmdb';
import './Header.css';

const Header = ({ onSearch, onSignIn, onNavigate, activeSection }) => {
   const [searchQuery, setSearchQuery] = useState('');
   const [suggestions, setSuggestions] = useState([]);
   const [searchHistory, setSearchHistory] = useState([]);
   const [user, setUser] = useState(null);
   const [showProfileMenu, setShowProfileMenu] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('tmdb_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser).account);
    }
    // Only load search history if we don't have any current suggestions
    if (suggestions.length === 0) {
      const storedHistory = localStorage.getItem('search_history');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    }
  }, [suggestions.length]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      const newHistory = [searchQuery, ...searchHistory.filter(q => q !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('search_history', JSON.stringify(newHistory));
      setSuggestions([]);
    }
  };

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const results = await TMDBService.getSearchSuggestions(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    onSearch(suggestion.title);
    const newHistory = [suggestion.title, ...searchHistory.filter(q => q !== suggestion.title)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
    setSuggestions([]);
  };

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
    onSearch(query);
    setSuggestions([]);
  };

  const handleSignOut = () => {
    localStorage.removeItem('tmdb_session');
    setUser(null);
    setShowProfileMenu(false);
    console.log('User signed out');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeSuggestions = () => {
    console.log('Close button clicked');
    setSuggestions([]);
    setSearchHistory([]);
    setSearchQuery('');
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        console.log('Clicked outside, closing suggestions');
        setSuggestions([]);
        setSearchHistory([]);
        setSearchQuery('');
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        console.log('Escape pressed, closing suggestions');
        setSuggestions([]);
        setSearchHistory([]);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="netflix-n">N</span>
          <span className="netflix-etflix">ETFLIX</span>
        </div>
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a
            href="#home"
            className={activeSection === 'home' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onNavigate('home'); toggleMenu(); }}
          >
            Home
          </a>
          <a
            href="#movies"
            className={activeSection === 'movies' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onNavigate('movies'); toggleMenu(); }}
          >
            Movies
          </a>
          <a
            href="#tv-shows"
            className={activeSection === 'tv-shows' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onNavigate('tv-shows'); toggleMenu(); }}
          >
            TV Shows
          </a>
          <a
            href="#my-list"
            className={activeSection === 'my-list' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onNavigate('my-list'); toggleMenu(); }}
          >
            My List
          </a>
        </nav>
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search movies or TV shows..."
              value={searchQuery}
              onChange={handleInputChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>
          {(suggestions.length > 0 || searchHistory.length > 0) && (
            <ul className="suggestions-list">
              <li className="suggestion-close">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeSuggestions();
                  }}
                  className="close-btn"
                >
                  <i className="fas fa-times"></i>
                </button>
              </li>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion.title} ({suggestion.category === 'movie' ? 'Movie' : 'TV Show'})
                </li>
              ))}
              {searchHistory.length > 0 && suggestions.length === 0 && (
                <>
                  <li className="suggestion-header">Recent Searches</li>
                  {searchHistory.map((query, index) => (
                    <li
                      key={index}
                      onClick={() => handleHistoryClick(query)}
                      className="suggestion-item"
                    >
                      {query}
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </div>
        <div className="user-menu">
          {user ? (
            <div className="profile-container">
              <img
                src="https://placehold.co/32x32?text=User"
                alt="User"
                className="user-icon"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />
              <button className="menu-toggle" onClick={toggleMenu}>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-item">{user.username}</div>
                  <div className="profile-item" onClick={() => console.log('Navigate to profile')}>
                    Profile
                  </div>
                  <div className="profile-item" onClick={() => console.log('Navigate to settings')}>
                    Settings
                  </div>
                  <div className="profile-item" onClick={handleSignOut}>
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-section">
              <button className="sign-in-btn" onClick={onSignIn}>
                <img src="https://placehold.co/32x32?text=User" alt="User" className="user-icon" />
                Sign In
              </button>
              <button className="menu-toggle" onClick={toggleMenu}>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;