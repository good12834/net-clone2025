// src/components/MovieDetail.jsx
import React, { useState } from 'react';
import './MovieDetail.css';

// const MovieDetail = ({ movie, onClose, onPlayMovie }) => {
//   if (!movie) return null;

//   return (
//     <div className="movie-detail">
//       <div className="movie-detail-content">
//         <button className="movie-detail-close" onClick={onClose}>&times;</button>
//         <img src={movie.image} alt={movie.title} />
//         <h2>{movie.title}</h2>
//         <p>{movie.genre} | {movie.duration} | {movie.match}</p>
//         <button onClick={() => onPlayMovie(movie)}>Play</button>
//         {movie.trailer && (
//           <a href={movie.trailer} target="_blank" rel="noopener noreferrer">Watch Trailer</a>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MovieDetail;
// src/components/MovieDetail.jsx
import React, { useState, useEffect } from 'react';
import TMDBService from '../../services/tmdb';
import './MovieDetail.css';

const MovieDetail = ({ movie, onClose, onPlayMovie }) => {
  const [detailedMovie, setDetailedMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const fetchDetailedData = async () => {
      if (!movie) return;

      setLoading(true);
      try {
        const [movieDetails, castData, similarData] = await Promise.all([
          movie.category === 'movie'
            ? TMDBService.getMovieDetails(movie.id)
            : TMDBService.getTVShowDetails(movie.id),
          movie.category === 'movie'
            ? TMDBService.getMovieCast(movie.id)
            : TMDBService.getTVShowCast(movie.id),
          movie.category === 'movie'
            ? TMDBService.getSimilarMovies(movie.id)
            : TMDBService.getSimilarTVShows(movie.id)
        ]);

        setDetailedMovie(movieDetails);
        setCast(castData);
        setSimilarMovies(similarData);
      } catch (error) {
        console.error('Error fetching detailed movie data:', error);
        // Fallback to basic movie data
        setDetailedMovie(movie);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedData();
  }, [movie]);

  if (!movie) return null;

  const displayMovie = detailedMovie || movie;

  const handleVideoClick = () => {
    setIsVideoPlaying(true);
  };

  const handleTrailerClick = () => {
    if (movie.trailer) {
      window.open(movie.trailer, '_blank');
    }
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="movie-detail-overlay">
      <div className="movie-detail-modal">
        <button className="movie-detail-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        {/* Movie Backdrop */}
        <div className="movie-backdrop">
          <img src={displayMovie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${displayMovie.backdrop_path}`
            : movie.backdrop || movie.image}
            alt={movie.title} />
          <div className="backdrop-overlay"></div>
        </div>

        <div className="movie-detail-content">
          {/* Movie Poster */}
          <div className="movie-poster-section">
            <img src={movie.image} alt={movie.title} className="movie-poster" />
          </div>

          {/* Movie Info */}
          <div className="movie-info-section">
            <h1 className="movie-title">{movie.title}</h1>

            <div className="movie-meta">
              <span className="match-badge">{movie.match}</span>
              <span className="year-badge">
                {displayMovie.release_date
                  ? new Date(displayMovie.release_date).getFullYear()
                  : displayMovie.first_air_date
                    ? new Date(displayMovie.first_air_date).getFullYear()
                    : '2024'}
              </span>
              <span className="duration-badge">
                {displayMovie.runtime
                  ? formatRuntime(displayMovie.runtime)
                  : displayMovie.episode_run_time?.[0]
                    ? `${displayMovie.episode_run_time[0]}m`
                    : movie.duration}
              </span>
              <span className="genre-badge">{movie.genre}</span>
            </div>

            <div className="movie-description">
              <p>{displayMovie.overview || movie.description || `Experience the thrilling story of ${movie.title}.`}</p>
            </div>

            {/* Action Buttons */}
            <div className="movie-actions">
              <button
                className="play-btn"
                onClick={() => onPlayMovie(movie)}
              >
                <i className="fas fa-play"></i>
                Play
              </button>

              {movie.trailer && (
                <button
                  className="trailer-btn"
                  onClick={handleTrailerClick}
                >
                  <i className="fas fa-film"></i>
                  Watch Trailer
                </button>
              )}

              <button className="favorite-btn">
                <i className="fas fa-plus"></i>
                My List
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="detail-tabs">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'cast' ? 'active' : ''}`}
                onClick={() => setActiveTab('cast')}
              >
                Cast & Crew
              </button>
              <button
                className={`tab-btn ${activeTab === 'similar' ? 'active' : ''}`}
                onClick={() => setActiveTab('similar')}
              >
                More Like This
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-section">
                  <div className="overview-grid">
                    <div className="overview-item">
                      <strong>Status:</strong>
                      <span>{displayMovie.status || 'Released'}</span>
                    </div>
                    {displayMovie.budget && displayMovie.budget > 0 && (
                      <div className="overview-item">
                        <strong>Budget:</strong>
                        <span>{formatCurrency(displayMovie.budget)}</span>
                      </div>
                    )}
                    {displayMovie.revenue && displayMovie.revenue > 0 && (
                      <div className="overview-item">
                        <strong>Revenue:</strong>
                        <span>{formatCurrency(displayMovie.revenue)}</span>
                      </div>
                    )}
                    {displayMovie.number_of_seasons && (
                      <div className="overview-item">
                        <strong>Seasons:</strong>
                        <span>{displayMovie.number_of_seasons}</span>
                      </div>
                    )}
                    {displayMovie.number_of_episodes && (
                      <div className="overview-item">
                        <strong>Episodes:</strong>
                        <span>{displayMovie.number_of_episodes}</span>
                      </div>
                    )}
                    <div className="overview-item">
                      <strong>Original Language:</strong>
                      <span>{displayMovie.original_language?.toUpperCase() || 'EN'}</span>
                    </div>
                    <div className="overview-item">
                      <strong>Popularity:</strong>
                      <span>{displayMovie.popularity ? Math.round(displayMovie.popularity) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cast' && (
                <div className="cast-section">
                  <h3>Cast</h3>
                  <div className="cast-grid">
                    {cast.length > 0 ? cast.map((actor) => (
                      <div key={actor.id} className="cast-member">
                        <img
                          src={actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : 'https://via.placeholder.com/185x278?text=No+Image'}
                          alt={actor.name}
                          className="cast-image"
                        />
                        <div className="cast-info">
                          <h4>{actor.name}</h4>
                          <p>{actor.character}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="no-data">Cast information not available</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'similar' && (
                <div className="similar-section">
                  <h3>More Like This</h3>
                  <div className="similar-grid">
                    {similarMovies.length > 0 ? similarMovies.slice(0, 6).map((similarMovie) => (
                      <div key={similarMovie.id} className="similar-movie">
                        <img
                          src={similarMovie.image}
                          alt={similarMovie.title}
                          className="similar-image"
                        />
                        <h4>{similarMovie.title}</h4>
                        <p>{similarMovie.match}</p>
                      </div>
                    )) : (
                      <p className="no-data">Similar content not available</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Trailer Section */}
            {movie.trailer && (
              <div className="trailer-section">
                <h3>Official Trailer</h3>
                <div className="trailer-container">
                  <div className={`video-player-wrapper ${isVideoPlaying ? 'playing' : ''}`}>
                    {!isVideoLoaded && (
                      <div className="video-loading">
                        <i className="fas fa-spinner fa-spin"></i> Loading trailer...
                      </div>
                    )}
                    <iframe
                      src={`${movie.trailer.replace('watch?v=', 'embed/')}?autoplay=0&rel=0&modestbranding=1&showinfo=0`}
                      title={`${movie.title} trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      className="netflix-video-player"
                      onLoad={handleVideoLoad}
                    ></iframe>
                    <div className="video-overlay" onClick={handleVideoClick}>
                      <div className="play-button-large">
                        <i className="fas fa-play"></i>
                      </div>
                      <div className="video-info">
                        <h4>{movie.title}</h4>
                        <p>Watch the official trailer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;





// 'use client'

// import { useState, useEffect } from 'react'
// import api from '../api'
// import VideoPlayer from './VideoPlayer'

// const MovieDetail = ({ movie, onClose, onPlayMovie }) => {
//   const [isFavorite, setIsFavorite] = useState(false)
//   const [isLiked, setIsLiked] = useState(false)
//   const [showVideoPlayer, setShowVideoPlayer] = useState(false)
//   const [isTrailerMode, setIsTrailerMode] = useState(true)

//   useEffect(() => {
//     // Check if movie is in user's list
//     const checkFavoriteStatus = async () => {
//       const token = localStorage.getItem('token')
//       if (token && movie) {
//         try {
//           const userList = await api.getMyList(token)
//           const isInList = userList.some(item => item.id === movie.id)
//           setIsFavorite(isInList)
//         } catch (error) {
//           console.error('Error checking favorite status:', error)
//         }
//       }
//     }

//     checkFavoriteStatus()
//   }, [movie])

//   const handlePlay = (trailer = false) => {
//     setIsTrailerMode(trailer)
//     setShowVideoPlayer(true)
//   }

//   const handleCloseVideoPlayer = () => {
//     setShowVideoPlayer(false)
//   }

//   const handleFavorite = async () => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       alert('Please sign in to add movies to your list')
//       return
//     }

//     try {
//       if (isFavorite) {
//         await api.removeFromMyList(movie.id, token)
//         setIsFavorite(false)
//       } else {
//         await api.addToMyList(movie.id, token)
//         setIsFavorite(true)
//       }
//     } catch (error) {
//       console.error('Error updating favorites:', error)
//     }
//   }

//   const handleLike = () => {
//     setIsLiked(!isLiked)
//     // You could add API call here to save like status
//   }

//   if (!movie) return null

//   return (
//     <div
//       className="movie-detail-overlay"
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'rgba(0,0,0,0.9)',
//         zIndex: 1000,
//         overflowY: 'auto'
//       }}
//     >
//       {/* Close Button */}
//       <button
//         onClick={onClose}
//         style={{
//           position: 'absolute',
//           top: '20px',
//           right: '20px',
//           zIndex: 1001,
//           background: 'rgba(0,0,0,0.8)',
//           border: 'none',
//           borderRadius: '50%',
//           width: '50px',
//           height: '50px',
//           color: '#fff',
//           fontSize: '24px',
//           cursor: 'pointer',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }}
//       >
//         ✕
//       </button>

//       {/* Hero Section with Background */}
//       <div
//         className="movie-detail-hero"
//         style={{
//           position: 'relative',
//           minHeight: '70vh',
//           backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), url(${movie.backdrop_url || movie.image})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundAttachment: 'fixed',
//           display: 'flex',
//           alignItems: 'center'
//         }}
//       >
//         {/* Content Container */}
//         <div className="container">
//           <div className="row align-items-center">
//             {/* Movie Poster */}
//             <div className="col-md-4 col-lg-3 mb-4 mb-md-0">
//               <img
//                 src={movie.image}
//                 alt={movie.title}
//                 className="img-fluid rounded shadow-lg"
//                 style={{
//                   maxWidth: '300px',
//                   width: '100%',
//                   boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
//                 }}
//               />
//             </div>

//             {/* Movie Info */}
//             <div className="col-md-8 col-lg-9 text-white">
//               <h1
//                 className="movie-title mb-3"
//                 style={{
//                   fontSize: '3rem',
//                   fontWeight: '700',
//                   textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
//                   marginBottom: '1rem'
//                 }}
//               >
//                 {movie.title}
//               </h1>

//               {/* Movie Meta Info */}
//               <div className="movie-meta mb-4">
//                 <span
//                   className="match-percentage me-3 fw-bold"
//                   style={{
//                     color: '#46d369',
//                     fontSize: '1.2rem',
//                     background: 'rgba(0,0,0,0.6)',
//                     padding: '5px 10px',
//                     borderRadius: '4px'
//                   }}
//                 >
//                   {movie.match}
//                 </span>
//                 <span className="me-3" style={{ fontSize: '1.1rem' }}>
//                   {movie.duration}
//                 </span>
//                 <span
//                   className="genre-badge"
//                   style={{
//                     background: 'rgba(255,255,255,0.2)',
//                     padding: '5px 10px',
//                     borderRadius: '20px',
//                     fontSize: '0.9rem'
//                   }}
//                 >
//                   {movie.genre || 'Action, Drama'}
//                 </span>
//               </div>

//               {/* Action Buttons */}
//               <div className="movie-actions mb-4">
//                 <button
//                   className="btn btn-light me-3 px-4 py-2"
//                   style={{
//                     fontSize: '1.2rem',
//                     fontWeight: '600',
//                     borderRadius: '4px',
//                     border: 'none',
//                     background: '#fff',
//                     color: '#000',
//                     padding: '12px 24px'
//                   }}
//                   onClick={() => handlePlay(false)}
//                 >
//                   <span style={{ marginRight: '8px' }}>▶</span>
//                   Play
//                 </button>

//                 <button
//                   className="btn btn-outline-light me-3 px-4 py-2"
//                   style={{
//                     fontSize: '1.2rem',
//                     borderRadius: '4px',
//                     border: '2px solid rgba(255,255,255,0.8)',
//                     background: 'transparent',
//                     color: '#fff',
//                     padding: '12px 24px'
//                   }}
//                   onClick={() => handlePlay(true)}
//                 >
//                   <span style={{ marginRight: '8px' }}>🎬</span>
//                   Trailer
//                 </button>

//                 <button
//                   className={`btn me-3 rounded-circle ${isFavorite ? 'btn-danger' : 'btn-outline-light'}`}
//                   style={{
//                     width: '50px',
//                     height: '50px',
//                     border: isFavorite ? 'none' : '2px solid rgba(255,255,255,0.8)',
//                     fontSize: '1.2rem'
//                   }}
//                   onClick={handleFavorite}
//                   title={isFavorite ? 'Remove from My List' : 'Add to My List'}
//                 >
//                   {isFavorite ? '❤️' : '➕'}
//                 </button>

//                 <button
//                   className={`btn rounded-circle ${isLiked ? 'btn-warning' : 'btn-outline-light'}`}
//                   style={{
//                     width: '50px',
//                     height: '50px',
//                     border: isLiked ? 'none' : '2px solid rgba(255,255,255,0.8)',
//                     fontSize: '1.2rem'
//                   }}
//                   onClick={handleLike}
//                   title={isLiked ? 'Unlike' : 'Like'}
//                 >
//                   {isLiked ? '👍' : '👍'}
//                 </button>
//               </div>

//               {/* Movie Description */}
//               <div className="movie-description">
//                 <p
//                   style={{
//                     fontSize: '1.1rem',
//                     lineHeight: '1.6',
//                     maxWidth: '600px',
//                     textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
//                   }}
//                 >
//                   {movie.description || `Experience the thrilling story of ${movie.title}. This ${movie.duration} ${movie.genre || 'action-packed'} adventure will keep you on the edge of your seat with its compelling storyline and stunning visuals.`}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* Additional Info Section */}
//       <div className="additional-info py-5" style={{ background: '#000' }}>
//         <div className="container">
//           <div className="row">
//             <div className="col-md-6">
//               <h3 className="text-white mb-3">About This Movie</h3>
//               <div className="info-grid">
//                 <div className="info-item mb-3">
//                   <strong className="text-white">Genre:</strong>
//                   <span className="text-muted ms-2">{movie.genre || 'Action, Drama'}</span>
//                 </div>
//                 <div className="info-item mb-3">
//                   <strong className="text-white">Rating:</strong>
//                   <span className="text-muted ms-2">{movie.match}</span>
//                 </div>
//                 <div className="info-item mb-3">
//                   <strong className="text-white">Duration:</strong>
//                   <span className="text-muted ms-2">{movie.duration}</span>
//                 </div>
//                 <div className="info-item mb-3">
//                   <strong className="text-white">Release Year:</strong>
//                   <span className="text-muted ms-2">{movie.release_date ? new Date(movie.release_date).getFullYear() : '2024'}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="col-md-6">
//               <h3 className="text-white mb-3">Cast & Crew</h3>
//               <div className="cast-info">
//                 <p className="text-muted mb-3">
//                   Starring: Leading actors and actresses bring this story to life with compelling performances.
//                 </p>
//                 <p className="text-muted">
//                   Directed by: Talented directors who crafted this visual masterpiece.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Video Player Modal */}
//       {showVideoPlayer && (
//         <VideoPlayer
//           movie={movie}
//           onClose={handleCloseVideoPlayer}
//           isTrailer={isTrailerMode}
//         />
//       )}
//     </div>
//   )
// }

// export default MovieDetail


