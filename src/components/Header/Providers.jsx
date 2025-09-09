'use client';

import { useState, useEffect } from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import AuthModal from './AuthModal/AuthModal';
import AdminPanel from './AdminPanel/AdminPanel';
import MovieDetail from './MovieDetail/MovieDetail';
import TMDBService from '../services/tmdb.jsx';

export default function Providers({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [myListData, setMyListData] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showMovieDetail, setShowMovieDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for existing user session on mount
  useEffect(() => {
    const sessionId = localStorage.getItem('tmdb_session_id');
    const savedUser = localStorage.getItem('tmdb_user');
    if (sessionId && savedUser) {
      setUser(JSON.parse(savedUser));
      loadUserList(sessionId);
    }
  }, []);

  const loadUserList = async (sessionId) => {
    try {
      const account = await TMDBService.getAccountDetails(sessionId);
      const favorites = await TMDBService.getFavoriteMovies(account.id, sessionId, 1);
      setMyListData(favorites.results);
    } catch (error) {
      console.error('Error loading TMDB favorites:', error.message, error.response?.data);
      setErrorMessage('Failed to load your favorites. Please sign in again.');
      setMyListData([]);
    }
  };

  const handleAuthSuccess = (userData, sessionId) => {
    setUser(userData);
    localStorage.setItem('tmdb_session_id', sessionId);
    localStorage.setItem('tmdb_user', JSON.stringify(userData));
    if (sessionId) {
      loadUserList(sessionId);
    }
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('tmdb_session_id');
    localStorage.removeItem('tmdb_user');
    setUser(null);
    setMyListData([]);
  };

  const handleShowMovieDetail = (movie) => {
    setSelectedMovie(movie);
    setShowMovieDetail(true);
  };

  const handleCloseMovieDetail = () => {
    setSelectedMovie(null);
    setShowMovieDetail(false);
  };

  const handlePlayMovie = (movie) => {
    console.log('Playing movie:', movie.title);
  };

  return (
    <>
      {errorMessage && (
        <div className="error-message">
          <h3>{errorMessage}</h3>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <Header
        scrolled={scrolled}
        user={user}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
        onAdmin={() => setShowAdminPanel(true)}
      />

      {children}

      <Footer />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />
      <AdminPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
      <MovieDetail movie={selectedMovie} onClose={handleCloseMovieDetail} onPlayMovie={handlePlayMovie} />
    </>
  );
}