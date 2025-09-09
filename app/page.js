'use client'

import { useState, useEffect } from 'react'
import Header from '../src/components/Header/Header'
import Hero from '../src/components/Hero/Hero'
import ContentRow from '../src/components/ContentRow/ContentRow'
import Footer from '../src/components/Footer/Footer'
import VideoPlayer from '../src/components/VideoPlayer'
import AuthModal from '../src/components/AuthModal/AuthModal'
import TMDBService from '../src/services/tmdb'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [activeCategory, setActiveCategory] = useState('home')
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isTrailer, setIsTrailer] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Dynamic movie data from API
  const [trendingMovies, setTrendingMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [actionMovies, setActionMovies] = useState([])
  const [comedyMovies, setComedyMovies] = useState([])
  const [horrorMovies, setHorrorMovies] = useState([])
  const [tvShows, setTvShows] = useState([])
  const [topRatedTVShows, setTopRatedTVShows] = useState([])
  const [movies, setMovies] = useState([])
  const [allMovies, setAllMovies] = useState([])
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Load movies from TMDB API directly
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('🎬 Loading movies from TMDB...')

        // Load all video categories in parallel for better performance
        const [
          trendingData,
          popularData,
          topRatedData,
          nowPlayingData,
          upcomingData,
          actionData,
          comedyData,
          horrorData,
          tvShowsData,
          topRatedTVData
        ] = await Promise.all([
          TMDBService.getTrending('all', 'week'),
          TMDBService.getPopularMovies(30),
          TMDBService.getTopRatedMovies(30),
          TMDBService.getNowPlayingMovies(30),
          TMDBService.getUpcomingMovies(30),
          TMDBService.getMoviesByGenre(28, 30), // Action genre ID: 28
          TMDBService.getMoviesByGenre(35, 30), // Comedy genre ID: 35
          TMDBService.getMoviesByGenre(27, 30), // Horror genre ID: 27
          TMDBService.getPopularTVShows(30),
          TMDBService.getTopRatedTVShows(30)
        ])

        // Set all the loaded data
        setTrendingMovies(trendingData)
        setPopularMovies(popularData.slice(0, 10))
        setTopRatedMovies(topRatedData.slice(0, 10))
        setNowPlayingMovies(nowPlayingData.slice(0, 10))
        setUpcomingMovies(upcomingData.slice(0, 10))
        setActionMovies(actionData.slice(0, 10))
        setComedyMovies(comedyData.slice(0, 10))
        setHorrorMovies(horrorData.slice(0, 10))
        setTvShows(tvShowsData.slice(0, 10))
        setTopRatedTVShows(topRatedTVData.slice(0, 10))
        setMovies(popularData.slice(0, 10)) // Set movies to popular movies

        // Combine all for allMovies
        setAllMovies([...popularData, ...tvShowsData])

        console.log(`✅ Loaded ${trendingData.length} trending movies`)
        console.log(`✅ Loaded ${popularData.length} popular movies`)
        console.log(`✅ Loaded ${topRatedData.length} top rated movies`)
        console.log(`✅ Loaded ${nowPlayingData.length} now playing movies`)
        console.log(`✅ Loaded ${upcomingData.length} upcoming movies`)
        console.log(`✅ Loaded ${actionData.length} action movies`)
        console.log(`✅ Loaded ${comedyData.length} comedy movies`)
        console.log(`✅ Loaded ${horrorData.length} horror movies`)
        console.log(`✅ Loaded ${tvShowsData.length} TV shows`)
        console.log(`✅ Loaded ${topRatedTVData.length} top rated TV shows`)

      } catch (error) {
        console.error('❌ Error loading movies from TMDB:', error)
        setError('Failed to load movies. Please check your internet connection.')
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePlayMovie = (movie, trailer = true) => {
    console.log('🎬 Playing movie:', movie.title, {
      hasTrailer: !!movie.trailer,
      trailerUrl: movie.trailer,
      trailer_url: movie.trailer_url,
      isTrailer: trailer
    });
    setSelectedMovie(movie)
    setIsTrailer(trailer)
    setShowVideoPlayer(true)
  }

  const handleSearch = (searchData) => {
    if (searchData.type === 'search') {
      console.log('Search query:', searchData.query)
      // TODO: Implement search functionality
    } else if (searchData.type === 'tab') {
      // Handle navigation tabs
      setActiveCategory(searchData.tabId)
    }
  }

  const handleShowDetail = (movie) => {
    console.log('Show movie details:', movie.title)
    // TODO: Implement movie detail view
  }

  const handleFavoriteToggle = (movie) => {
    console.log('Toggle favorite for:', movie.title)
    // TODO: Implement favorite functionality
  }

  const handleSignIn = () => {
    setShowAuthModal(true)
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('tmdb_session_id')
    localStorage.removeItem('tmdb_account_id')
    console.log('User signed out')
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
    console.log('User authenticated:', userData)
  }

  const handleAdmin = () => {
    console.log('Admin panel - not implemented yet')
    // TODO: Implement admin panel
  }

  // Utility function to remove duplicate movies by ID
  const removeDuplicates = (movies) => {
    const seen = new Set()
    return movies.filter(movie => {
      if (seen.has(movie.id)) {
        return false
      }
      seen.add(movie.id)
      return true
    })
  }

  const getCurrentContent = () => {
    switch (activeCategory) {
      case 'home':
        return (
          <div>
            <ContentRow
              title="Trending Now"
              movies={trendingMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Top Rated Movies"
              movies={topRatedMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}h
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Now Playing in Theaters"
              movies={nowPlayingMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Action Movies"
              movies={actionMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Comedy Movies"
              movies={comedyMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Horror Movies"
              movies={horrorMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Popular TV Shows"
              movies={tvShows}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Top Rated TV Shows"
              movies={topRatedTVShows}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Coming Soon"
              movies={upcomingMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        )
      case 'tv-shows':
        return (
          <div>
            <ContentRow
              title="Popular TV Shows"
              movies={tvShows}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Top Rated TV Shows"
              movies={topRatedTVShows}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Trending TV Shows"
              movies={trendingMovies.filter(movie => movie.category === 'tv_show')}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        )
      case 'movies':
        return (
          <div>
            <ContentRow
              title="Popular Movies"
              movies={popularMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Top Rated Movies"
              movies={topRatedMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Now Playing"
              movies={nowPlayingMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Action & Adventure"
              movies={actionMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Comedy Movies"
              movies={comedyMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Horror Movies"
              movies={horrorMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Coming Soon"
              movies={upcomingMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        )
      case 'new-popular':
        return (
          <div>
            <ContentRow
              title="New & Popular Movies"
              movies={removeDuplicates([...trendingMovies.filter(m => m.category === 'movie'), ...popularMovies]).slice(0, 10)}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="New & Popular TV Shows"
              movies={removeDuplicates([...trendingMovies.filter(m => m.category === 'tv_show'), ...tvShows]).slice(0, 10)}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Now Playing in Theaters"
              movies={nowPlayingMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <ContentRow
              title="Coming Soon"
              movies={upcomingMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        )
      default:
        return (
          <div>
            <ContentRow
              title="Trending Now"
              movies={trendingMovies}
              onPlayMovie={handlePlayMovie}
              onShowDetail={handleShowDetail}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold">Loading Netflix Clone...</h2>
          <p className="text-gray-400 mt-2">Fetching movies from TMDB API...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl font-semibold mb-4">Failed to Load Movies</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header
        scrolled={scrolled}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onAdmin={handleAdmin}
        onSearch={handleSearch}
      />

      {/* Test YouTube Button */}
      <div style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => {
            const testMovie = {
              id: 'test',
              title: 'Test YouTube Video',
              trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              image: '/placeholder-movie.jpg',
              match: '100% Match',
              duration: '3:32',
              genre: 'Test',
              category: 'movie'
            };
            console.log('🎬 Testing YouTube with:', testMovie);
            setSelectedMovie(testMovie);
            setIsTrailer(true);
            setShowVideoPlayer(true);
          }}
          style={{
            background: '#e50914',
            color: '#fff',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Test YouTube
        </button>
      </div>

      {/* Spacer for fixed header */}
      <div style={{
        height: scrolled ? '70px' : '90px',
        transition: 'height 0.3s ease'
      }}></div>

      <main>
        {activeCategory === 'home' && (
          <Hero
            featuredMovie={trendingMovies.length > 0 ? trendingMovies[0] : null}
            onPlayMovie={handlePlayMovie}
          />
        )}

        <div className="container-fluid px-4 py-5">
          {getCurrentContent()}
        </div>
      </main>

      <Footer />

      {/* Video Player Modal */}
      {showVideoPlayer && selectedMovie && (
        <VideoPlayer
          movie={selectedMovie}
          onClose={() => {
            console.log('🎬 Closing video player for:', selectedMovie.title);
            setShowVideoPlayer(false);
          }}
          isTrailer={isTrailer}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}