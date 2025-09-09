'use client';

import { useState, useEffect } from 'react';
import TMDBService from '../../services/tmdb';
import './Home.css';

const Home = ({ searchResults }) => {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [featuredTrailer, setFeaturedTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const [trendingData, popularData] = await Promise.all([
          TMDBService.getTrending('all', 'week'),
          TMDBService.getPopularMovies(1),
        ]);
        setTrending(trendingData);
        setPopularMovies(popularData);
        // Set featured trailer from the first trending item
        if (trendingData.length > 0 && trendingData[0].trailer) {
          const videoId = trendingData[0].trailer.split('v=')[1];
          setFeaturedTrailer(`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`);
        }
      } catch (err) {
        setError('Failed to fetch movies. Please try again.');
        console.error('Home fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="home-container">
      <h1 className="text-white mb-4">Welcome to Netflix</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-white text-center">
          <i className="fas fa-spinner fa-spin fa-2x"></i>
        </div>
      ) : (
        <>
          {featuredTrailer && (
            <section className="mb-5 featured-trailer">
              <h2 className="text-white mb-3">Featured Trailer</h2>
              <div className="ratio ratio-16x9">
                <iframe
                  src={featuredTrailer}
                  title="Featured Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}
          {searchResults?.length > 0 ? (
            <section className="mb-5">
              <h2 className="text-white mb-3">Search Results</h2>
              <div className="row">
                {searchResults.map((item) => (
                  <div key={item.id} className="col-6 col-md-4 col-lg-3 mb-3">
                    <div className="card bg-dark text-white h-100">
                      <img src={item.image} alt={item.title} className="card-img-top" />
                      <div className="card-body">
                        <h5 className="card-title">{item.title}</h5>
                        <p className="card-text">{item.genre}</p>
                        <p className="card-text">{item.match}</p>
                        {item.trailer && (
                          <a href={item.trailer} target="_blank" rel="noopener noreferrer" className="btn btn-netflix-red btn-sm">
                            Watch Trailer
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <>
              <section className="mb-5">
                <h2 className="text-white mb-3">Trending Now</h2>
                <div className="row">
                  {trending.map((item) => (
                    <div key={item.id} className="col-6 col-md-4 col-lg-3 mb-3">
                      <div className="card bg-dark text-white h-100">
                        <img src={item.image} alt={item.title} className="card-img-top" />
                        <div className="card-body">
                          <h5 className="card-title">{item.title}</h5>
                          <p className="card-text">{item.genre}</p>
                          <p className="card-text">{item.match}</p>
                          {item.trailer && (
                            <a href={item.trailer} target="_blank" rel="noopener noreferrer" className="btn btn-netflix-red btn-sm">
                              Watch Trailer
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="mb-5">
                <h2 className="text-white mb-3">Popular Movies</h2>
                <div className="row">
                  {popularMovies.map((item) => (
                    <div key={item.id} className="col-6 col-md-4 col-lg-3 mb-3">
                      <div className="card bg-dark text-white h-100">
                        <img src={item.image} alt={item.title} className="card-img-top" />
                        <div className="card-body">
                          <h5 className="card-title">{item.title}</h5>
                          <p className="card-text">{item.genre}</p>
                          <p className="card-text">{item.match}</p>
                          {item.trailer && (
                            <a href={item.trailer} target="_blank" rel="noopener noreferrer" className="btn btn-netflix-red btn-sm">
                              Watch Trailer
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;