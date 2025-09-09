'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import TMDBService from './services/tmdb';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import FilterBar from './components/FilterBar/FilterBar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';

// Lazy load components
const Hero = lazy(() => import('./components/Hero/Hero'));
const AuthModal = lazy(() => import('./components/AuthModal/AuthModal'));
const AdminPanel = lazy(() => import('./components/AdminPanel/AdminPanel'));

const App = () => {
  const [movies, setMovies] = useState({ movies: [], tv_shows: [] });
  const [trending, setTrending] = useState({ movies: [], tv_shows: [] });
  const [searchResults, setSearchResults] = useState({ movies: [], tv_shows: [] });
  const [favorites, setFavorites] = useState({ movies: [], tv_shows: [] });
  const [watchlist, setWatchlist] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [thrillerMovies, setThrillerMovies] = useState([]);
  const [actionTVShows, setActionTVShows] = useState([]);
  const [comedyTVShows, setComedyTVShows] = useState([]);
  const [dramaTVShows, setDramaTVShows] = useState([]);
  const [crimeTVShows, setCrimeTVShows] = useState([]);
  const [mysteryTVShows, setMysteryTVShows] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');

  const groupByType = (items) => {
    const grouped = { movies: [], tv_shows: [] };
    if (!Array.isArray(items)) {
      console.warn('groupByType received non-array input:', items);
      return grouped;
    }
    items.forEach((item) => {
      if (item.category === 'movie') {
        grouped.movies.push(item);
      } else {
        grouped.tv_shows.push(item);
      }
    });
    grouped.movies.sort((a, b) => a.title.localeCompare(b.title));
    grouped.tv_shows.sort((a, b) => a.title.localeCompare(b.title));
    return grouped;
  };


  const fetchMovies = async (showNotification = false) => {
    setLoading(true);
    try {
      const [
        trendingData,
        popularMovies,
        favoriteMovies,
        topRatedMoviesData,
        nowPlayingMoviesData,
        upcomingMoviesData,
        popularTVShowsData,
        topRatedTVShowsData,
        actionMoviesData,
        comedyMoviesData,
        dramaMoviesData,
        horrorMoviesData,
        romanceMoviesData,
        thrillerMoviesData,
        actionTVShowsData,
        comedyTVShowsData,
        dramaTVShowsData,
        crimeTVShowsData,
        mysteryTVShowsData
      ] = await Promise.all([
        TMDBService.getTrending().catch((err) => {
          console.error('Trending fetch failed:', err.message);
          return [];
        }),
        TMDBService.getPopularMovies().catch((err) => {
          console.error('Popular movies fetch failed:', err.message);
          return [];
        }),
        user
          ? TMDBService.getFavoriteMovies(user.id, user.sessionId).catch((err) => {
              console.error('Favorite movies fetch failed:', err.message);
              return [];
            })
          : Promise.resolve([]),
        TMDBService.getTopRatedMovies().catch((err) => {
          console.error('Top rated movies fetch failed:', err.message);
          return [];
        }),
        TMDBService.getNowPlayingMovies().catch((err) => {
          console.error('Now playing movies fetch failed:', err.message);
          return [];
        }),
        TMDBService.getUpcomingMovies().catch((err) => {
          console.error('Upcoming movies fetch failed:', err.message);
          return [];
        }),
        TMDBService.getPopularTVShows().catch((err) => {
          console.error('Popular TV shows fetch failed:', err.message);
          return [];
        }),
        TMDBService.getTopRatedTVShows().catch((err) => {
          console.error('Top rated TV shows fetch failed:', err.message);
          return [];
        }),
        TMDBService.getActionMovies().catch((err) => {
          console.error('Action movies fetch failed:', err.message);
          return [];
        }),
        TMDBService.getComedyMovies().catch((err) => {
          console.error('Comedy movies fetch failed:', err.message);
          return [];
        }),
        TMDBService.getDramaMovies().catch((err) => {
          console.error('Drama movies fetch failed:', err.message);
          return [];
        }),
        TMDBService.getHorrorMovies().catch((err) => {
          console.error('Horror movies fetch failed:', err.message);
          return [];
        }),
        TMDBService.getRomanceMovies().catch((err) => {
          console.error('Romance movies fetch failed:', err.message);
          return [];
        }),
        TMDBService.getThrillerMovies().catch((err) => {
          console.error('Thriller movies fetch failed:', err.message);
          return [];
        }),
        TMDBService.getActionTVShows().catch((err) => {
          console.error('Action TV shows fetch failed:', err.message);
          return [];
        }),
        TMDBService.getComedyTVShows().catch((err) => {
          console.error('Comedy TV shows fetch failed:', err.message);
          return [];
        }),
        TMDBService.getDramaTVShows().catch((err) => {
          console.error('Drama TV shows fetch failed:', err.message);
          return [];
        }),
        TMDBService.getCrimeTVShows().catch((err) => {
          console.error('Crime TV shows fetch failed:', err.message);
          return [];
        }),
        TMDBService.getMysteryTVShows().catch((err) => {
          console.error('Mystery TV shows fetch failed:', err.message);
          return [];
        }),
      ]);
      setTrending(groupByType(trendingData));
      setMovies(groupByType(popularMovies));
      setFavorites(groupByType(favoriteMovies));
      setTopRatedMovies(topRatedMoviesData);
      setNowPlayingMovies(nowPlayingMoviesData);
      setUpcomingMovies(upcomingMoviesData);
      setPopularTVShows(popularTVShowsData);
      setTopRatedTVShows(topRatedTVShowsData);
      setActionMovies(actionMoviesData);
      setComedyMovies(comedyMoviesData);
      setDramaMovies(dramaMoviesData);
      setHorrorMovies(horrorMoviesData);
      setRomanceMovies(romanceMoviesData);
      setThrillerMovies(thrillerMoviesData);
      setActionTVShows(actionTVShowsData);
      setComedyTVShows(comedyTVShowsData);
      setDramaTVShows(dramaTVShowsData);
      setCrimeTVShows(crimeTVShowsData);
      setMysteryTVShows(mysteryTVShowsData);

      if (showNotification) {
        setUpdateNotification('Content updated with latest movies and shows!');
        setTimeout(() => setUpdateNotification(''), 3000);
      }
    } catch (err) {
      console.error('App fetch error:', err.message);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    if (!user) return;
    try {
      const watchlistRef = collection(db, 'watchlist');
      const q = query(watchlistRef, where('userId', '==', user.id));
      const snapshot = await getDocs(q);
      const watchlistData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWatchlist(watchlistData);
    } catch (err) {
      console.error('Watchlist fetch error:', err.message);
      setError('Failed to load watchlist.');
    }
  };

  const addToWatchlist = async (movie) => {
    if (!user) {
      setError('Please sign in to add to watchlist.');
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const watchlistRef = collection(db, 'watchlist');
      await addDoc(watchlistRef, {
        userId: user.id,
        movieId: movie.id,
        title: movie.title,
        category: movie.category,
        image: movie.image,
      });
      setWatchlist([...watchlist, { movieId: movie.id, title: movie.title, category: movie.category, image: movie.image }]);
    } catch (err) {
      console.error('Add to watchlist error:', err.message);
      setError('Failed to add to watchlist.');
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const watchlistRef = collection(db, 'watchlist');
      const q = query(watchlistRef, where('userId', '==', user.id), where('movieId', '==', movieId));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      setWatchlist(watchlist.filter(item => item.movieId !== movieId));
    } catch (err) {
      console.error('Remove from watchlist error:', err.message);
      setError('Failed to remove from watchlist.');
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchWatchlist();
  }, [user]);

  // Listen for authentication success messages from auth-callback
  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.data.type === 'tmdb_auth_success') {
        console.log('Received auth success message:', event.data);
        handleAuthSuccess(event.data.sessionId);
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  // Real-time updates - poll for new content every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Checking for updates...');
      fetchMovies(true); // Show notification when updating
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults({ movies: [], tv_shows: [] });
      setActiveSection('home');
      return;
    }
    setLoading(true);
    try {
      const results = await TMDBService.searchMovies(query);
      setSearchResults(groupByType(results));
      setActiveSection('search');
    } catch (err) {
      console.error('Search error:', err.message);
      setError('Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async (sessionId) => {
    try {
      const accountDetails = await TMDBService.getAccountDetails(sessionId);
      setUser({ ...accountDetails, sessionId });
      setIsAuthModalOpen(false);
      if (accountDetails.username === 'admin') {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error('Auth success error:', err.message);
      setError('Failed to fetch account details.');
    }
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSearchResults({ movies: [], tv_shows: [] }); // Clear search results when navigating
  };

  const handleGenreFilter = (genres) => {
    setSelectedGenres(genres);
  };

  const handleRatingFilter = (rating) => {
    setSelectedRating(rating);
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSelectedRating('');
  };

  const handlePlayTrailer = (movie) => {
    if (movie.trailer) {
      setSelectedMovie(movie);
    } else {
      console.warn(`No trailer available for ${movie.title}`);
      setError(`No trailer available for ${movie.title}`);
    }
  };

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const heroMovie = trending.movies?.length > 0 ? trending.movies[0] : trending.tv_shows?.length > 0 ? trending.tv_shows[0] : null;

  const renderCarousel = (items, title) => (
    <div className="movie-section">
      <h3>{title}</h3>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={5}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="movie-card">
              <div className="movie-poster-container">
                <img
                  src={item.image}
                  alt={item.title}
                  className="movie-poster"
                  onClick={() => handlePlayTrailer(item)}
                  onMouseEnter={() => item.trailer && setHoveredMovie(item)}
                  onMouseLeave={() => setHoveredMovie(null)}
                />
                {hoveredMovie?.id === item.id && item.trailer && (
                  <div className="hover-preview">
                    <iframe
                      src={`${item.trailer}&mute=1`}
                      title={`${item.title} Preview`}
                      frameBorder="0"
                      allow="autoplay"
                    ></iframe>
                  </div>
                )}
                <button
                  className="watchlist-btn"
                  onClick={() => watchlist.some(w => w.movieId === item.id) ? removeFromWatchlist(item.id) : addToWatchlist(item)}
                >
                  {watchlist.some(w => w.movieId === item.id) ? 'Remove from List' : 'Add to List'}
                </button>
              </div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );


  // Filter content based on selected genres and rating
  const applyFilters = (content) => {
    if (!content || content.length === 0) return content;

    return content.filter(item => {
      // Genre filter
      if (selectedGenres.length > 0) {
        const hasMatchingGenre = selectedGenres.some(genreId =>
          item.genre_ids && item.genre_ids.includes(genreId)
        );
        if (!hasMatchingGenre) return false;
      }

      // Rating filter
      if (selectedRating) {
        const itemRating = parseFloat(item.match?.replace('★ ', '') || '0');
        const minRating = parseFloat(selectedRating);
        if (itemRating < minRating) return false;
      }

      return true;
    });
  };

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}
        onSignIn={() => setIsAuthModalOpen(true)}
        onNavigate={handleNavigation}
        activeSection={activeSection}
      />
      {updateNotification && (
        <div className="update-notification">
          <i className="fas fa-sync-alt"></i>
          {updateNotification}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-spinner">Loading...</div>}
      {heroMovie ? (
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <Hero movie={heroMovie} onPlayTrailer={handlePlayTrailer} />
        </Suspense>
      ) : (
        <div className="hero-placeholder">No trending content available</div>
      )}
      <div className="content">
        {(searchResults.movies?.length > 0 || searchResults.tv_shows?.length > 0) ? (
          <>
            <h2>Search Results</h2>
            {searchResults.movies?.length > 0 && renderCarousel(searchResults.movies, 'Movies')}
            {searchResults.tv_shows?.length > 0 && renderCarousel(searchResults.tv_shows, 'TV Shows')}
          </>
        ) : (
          <>
            {activeSection === 'home' && (
              <>
                <FilterBar
                  onGenreFilter={handleGenreFilter}
                  onRatingFilter={handleRatingFilter}
                  onClearFilters={handleClearFilters}
                />
                <h2>Trending</h2>
                {trending.movies?.length > 0 && renderCarousel(applyFilters(trending.movies), 'Movies')}
                {trending.tv_shows?.length > 0 && renderCarousel(applyFilters(trending.tv_shows), 'TV Shows')}
                {movies.movies?.length > 0 && renderCarousel(applyFilters(movies.movies), 'Popular Movies')}
                {topRatedMovies?.length > 0 && renderCarousel(applyFilters(topRatedMovies), 'Top Rated Movies')}
                {nowPlayingMovies?.length > 0 && renderCarousel(applyFilters(nowPlayingMovies), 'Now Playing')}
                {upcomingMovies?.length > 0 && renderCarousel(applyFilters(upcomingMovies), 'Coming Soon')}
                {popularTVShows?.length > 0 && renderCarousel(applyFilters(popularTVShows), 'Popular TV Shows')}
                {topRatedTVShows?.length > 0 && renderCarousel(applyFilters(topRatedTVShows), 'Top Rated TV Shows')}
                {actionMovies?.length > 0 && renderCarousel(applyFilters(actionMovies), 'Action Movies')}
                {comedyMovies?.length > 0 && renderCarousel(applyFilters(comedyMovies), 'Comedy Movies')}
                {dramaMovies?.length > 0 && renderCarousel(applyFilters(dramaMovies), 'Drama Movies')}
                {horrorMovies?.length > 0 && renderCarousel(applyFilters(horrorMovies), 'Horror Movies')}
                {romanceMovies?.length > 0 && renderCarousel(applyFilters(romanceMovies), 'Romance Movies')}
                {thrillerMovies?.length > 0 && renderCarousel(applyFilters(thrillerMovies), 'Thriller Movies')}
                {actionTVShows?.length > 0 && renderCarousel(applyFilters(actionTVShows), 'Action TV Shows')}
                {comedyTVShows?.length > 0 && renderCarousel(applyFilters(comedyTVShows), 'Comedy TV Shows')}
                {dramaTVShows?.length > 0 && renderCarousel(applyFilters(dramaTVShows), 'Drama TV Shows')}
                {crimeTVShows?.length > 0 && renderCarousel(applyFilters(crimeTVShows), 'Crime TV Shows')}
                {mysteryTVShows?.length > 0 && renderCarousel(applyFilters(mysteryTVShows), 'Mystery TV Shows')}
                {favorites.movies?.length > 0 && renderCarousel(applyFilters(favorites.movies), 'Favorite Movies')}
                {watchlist?.length > 0 && renderCarousel(applyFilters(watchlist), 'My List')}
              </>
            )}
            {activeSection === 'movies' && (
              <>
                <FilterBar
                  onGenreFilter={handleGenreFilter}
                  onRatingFilter={handleRatingFilter}
                  onClearFilters={handleClearFilters}
                />
                <h2>Movies</h2>
                {trending.movies?.length > 0 && renderCarousel(applyFilters(trending.movies), 'Trending Movies')}
                {movies.movies?.length > 0 && renderCarousel(applyFilters(movies.movies), 'Popular Movies')}
                {topRatedMovies?.length > 0 && renderCarousel(applyFilters(topRatedMovies), 'Top Rated Movies')}
                {nowPlayingMovies?.length > 0 && renderCarousel(applyFilters(nowPlayingMovies), 'Now Playing')}
                {upcomingMovies?.length > 0 && renderCarousel(applyFilters(upcomingMovies), 'Coming Soon')}
                {actionMovies?.length > 0 && renderCarousel(applyFilters(actionMovies), 'Action Movies')}
                {comedyMovies?.length > 0 && renderCarousel(applyFilters(comedyMovies), 'Comedy Movies')}
                {dramaMovies?.length > 0 && renderCarousel(applyFilters(dramaMovies), 'Drama Movies')}
                {horrorMovies?.length > 0 && renderCarousel(applyFilters(horrorMovies), 'Horror Movies')}
                {favorites.movies?.length > 0 && renderCarousel(applyFilters(favorites.movies), 'Favorite Movies')}
              </>
            )}
            {activeSection === 'tv-shows' && (
              <>
                <FilterBar
                  onGenreFilter={handleGenreFilter}
                  onRatingFilter={handleRatingFilter}
                  onClearFilters={handleClearFilters}
                />
                <h2>TV Shows</h2>
                {trending.tv_shows?.length > 0 && renderCarousel(applyFilters(trending.tv_shows), 'Trending TV Shows')}
                {popularTVShows?.length > 0 && renderCarousel(applyFilters(popularTVShows), 'Popular TV Shows')}
                {topRatedTVShows?.length > 0 && renderCarousel(applyFilters(topRatedTVShows), 'Top Rated TV Shows')}
              </>
            )}
            {activeSection === 'my-list' && (
              <>
                <FilterBar
                  onGenreFilter={handleGenreFilter}
                  onRatingFilter={handleRatingFilter}
                  onClearFilters={handleClearFilters}
                />
                <h2>My List</h2>
                {watchlist?.length > 0 ? (
                  renderCarousel(applyFilters(watchlist), 'My List')
                ) : (
                  <div className="empty-watchlist">
                    <div className="empty-watchlist-icon">
                      <i className="fas fa-plus-circle"></i>
                    </div>
                    <h3>Your list is empty</h3>
                    <p>Add movies and TV shows to your list to watch them later.</p>
                    {!user && (
                      <div className="auth-prompt">
                        <p><strong>Sign in</strong> to create and manage your personal watchlist!</p>
                        <button
                          className="btn btn-netflix-red"
                          onClick={() => setIsAuthModalOpen(true)}
                        >
                          Sign In
                        </button>
                      </div>
                    )}
                    {user && (
                      <p>Browse movies and click the <strong>"Add to List"</strong> button to get started!</p>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      {isAdmin && (
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <AdminPanel />
        </Suspense>
      )}
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
      </Suspense>
      {selectedMovie && selectedMovie.trailer && (
        <div className="trailer-modal">
          <div className="trailer-modal-content">
            <button className="trailer-close" onClick={() => setSelectedMovie(null)}>
              &times;
            </button>
            <iframe
              src={selectedMovie.trailer}
              title={`${selectedMovie.title} Trailer`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      <Footer />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default App;