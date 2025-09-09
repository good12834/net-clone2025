import axios from 'axios';
import axiosRetry from 'axios-retry';
import _ from 'lodash';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const bearerToken = import.meta.env.VITE_TMDB_BEARER_TOKEN;
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

console.log('🔑 TMDB Environment Variables:');
console.log('Bearer Token exists:', !!bearerToken);
console.log('API Key exists:', !!apiKey);
console.log('Bearer Token length:', bearerToken?.length);
console.log('API Key length:', apiKey?.length);
console.log('API Key value:', apiKey);
console.log('Bearer Token preview:', bearerToken?.substring(0, 20) + '...');

if (!bearerToken && !apiKey) {
  console.warn('⚠️ TMDB API keys not found - running in demo mode');
}

// Demo data for when API keys are not available
const demoMovies = [
  {
    id: 1,
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    genre: "Action, Crime, Drama",
    genre_ids: [28, 80, 18],
    match: "★ 9.0",
    category: "movie",
    trailer: null
  },
  {
    id: 2,
    title: "Inception",
    description: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
    image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    genre: "Action, Sci-Fi, Thriller",
    genre_ids: [28, 878, 53],
    match: "★ 8.8",
    category: "movie",
    trailer: null
  },
  {
    id: 3,
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
    image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    genre: "Drama, Fantasy, Horror",
    genre_ids: [18, 14, 27],
    match: "★ 8.7",
    category: "tv_show",
    trailer: null
  }
];

const axiosInstance = axios.create({
  baseURL: TMDB_API_URL,
  headers: bearerToken ? {
    Authorization: `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  } : {},
  // Only use API key as fallback for read operations, not in headers
  params: !bearerToken && apiKey ? { api_key: apiKey } : {},
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1500,
  retryCondition: (error) => error.response?.status === 929,
});

const TMDBService = {
  async getGenres(mediaType = 'movie') {
    try {
      console.log(`Fetching genres for ${mediaType}...`);
      const response = await axiosInstance.get(`/genre/${mediaType}/list`);
      console.log(`TMDB genres for ${mediaType}:`, response.data.genres);
      return response.data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
    } catch (error) {
      console.error(`❌ TMDB API error for genres: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch genres: ${error.message}`);
    }
  },

  async getTrending(mediaType = 'all', timeWindow = 'week') {
    try {
      console.log(`Fetching trending ${mediaType} for ${timeWindow}...`);
      const response = await axiosInstance.get(`/trending/${mediaType}/${timeWindow}`);
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for trending ${mediaType}: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch trending ${mediaType}: ${error.message}`);
    }
  },

  async getPopularMovies(page = 1) {
    try {
      console.log(`Fetching popular movies (page ${page})...`);
      const response = await axiosInstance.get(`/movie/popular?page=${page}`);
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for popular movies: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch popular movies: ${error.message}`);
    }
  },

  async getTopRatedMovies(page = 1) {
    try {
      console.log(`Fetching top rated movies (page ${page})...`);
      const response = await axiosInstance.get(`/movie/top_rated?page=${page}`);
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for top rated movies: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch top rated movies: ${error.message}`);
    }
  },

  async getNowPlayingMovies(page = 1) {
    try {
      console.log(`Fetching now playing movies (page ${page})...`);
      const response = await axiosInstance.get(`/movie/now_playing?page=${page}`);
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for now playing movies: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch now playing movies: ${error.message}`);
    }
  },

  async getUpcomingMovies(page = 1) {
    try {
      console.log(`Fetching upcoming movies (page ${page})...`);
      const response = await axiosInstance.get(`/movie/upcoming?page=${page}`);
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for upcoming movies: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch upcoming movies: ${error.message}`);
    }
  },

  async getPopularTVShows(page = 1) {
    try {
      console.log(`Fetching popular TV shows (page ${page})...`);
      const response = await axiosInstance.get(`/tv/popular?page=${page}`);
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for popular TV shows: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch popular TV shows: ${error.message}`);
    }
  },

  async getTopRatedTVShows(page = 1) {
    try {
      console.log(`Fetching top rated TV shows (page ${page})...`);
      const response = await axiosInstance.get(`/tv/top_rated?page=${page}`);
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for top rated TV shows: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch top rated TV shows: ${error.message}`);
    }
  },

  async getMoviesByGenre(genreId, page = 1) {
    try {
      console.log(`Fetching movies for genre ${genreId} (page ${page})...`);
      const response = await axiosInstance.get(`/discover/movie`, {
        params: { with_genres: genreId, page }
      });
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for movies by genre ${genreId}: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch movies by genre: ${error.message}`);
    }
  },

  async getTVShowsByGenre(genreId, page = 1) {
    try {
      console.log(`Fetching TV shows for genre ${genreId} (page ${page})...`);
      const response = await axiosInstance.get(`/discover/tv`, {
        params: { with_genres: genreId, page }
      });
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for TV shows by genre ${genreId}: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch TV shows by genre: ${error.message}`);
    }
  },

  async getActionMovies(page = 1) {
    return this.getMoviesByGenre(28, page); // Action genre ID = 28
  },

  async getComedyMovies(page = 1) {
    return this.getMoviesByGenre(35, page); // Comedy genre ID = 35
  },

  async getDramaMovies(page = 1) {
    return this.getMoviesByGenre(18, page); // Drama genre ID = 18
  },

  async getHorrorMovies(page = 1) {
    return this.getMoviesByGenre(27, page); // Horror genre ID = 27
  },

  async getRomanceMovies(page = 1) {
    return this.getMoviesByGenre(10749, page); // Romance genre ID = 10749
  },

  async getThrillerMovies(page = 1) {
    return this.getMoviesByGenre(53, page); // Thriller genre ID = 53
  },

  async getActionTVShows(page = 1) {
    return this.getTVShowsByGenre(28, page); // Action genre ID = 28
  },

  async getComedyTVShows(page = 1) {
    return this.getTVShowsByGenre(35, page); // Comedy genre ID = 35
  },

  async getDramaTVShows(page = 1) {
    return this.getTVShowsByGenre(18, page); // Drama genre ID = 18
  },

  async getCrimeTVShows(page = 1) {
    return this.getTVShowsByGenre(80, page); // Crime genre ID = 80
  },

  async getMysteryTVShows(page = 1) {
    return this.getTVShowsByGenre(9648, page); // Mystery genre ID = 9648
  },

  async getMovieDetails(movieId) {
    try {
      console.log(`Fetching movie details for ID: ${movieId}`);
      const response = await axiosInstance.get(`/movie/${movieId}`, {
        params: { append_to_response: 'credits,videos,similar,recommendations' }
      });
      return response.data;
    } catch (error) {
      console.error(`❌ TMDB API error for movie details (ID: ${movieId}): ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
  },

  async getTVShowDetails(showId) {
    try {
      console.log(`Fetching TV show details for ID: ${showId}`);
      const response = await axiosInstance.get(`/tv/${showId}`, {
        params: { append_to_response: 'credits,videos,similar,recommendations' }
      });
      return response.data;
    } catch (error) {
      console.error(`❌ TMDB API error for TV show details (ID: ${showId}): ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to fetch TV show details: ${error.message}`);
    }
  },

  async getMovieCast(movieId) {
    try {
      console.log(`Fetching cast for movie ID: ${movieId}`);
      const response = await axiosInstance.get(`/movie/${movieId}/credits`);
      return response.data.cast.slice(0, 10); // Return top 10 cast members
    } catch (error) {
      console.error(`❌ TMDB API error for movie cast (ID: ${movieId}): ${error.response?.status} ${error.message}`);
      return [];
    }
  },

  async getTVShowCast(showId) {
    try {
      console.log(`Fetching cast for TV show ID: ${showId}`);
      const response = await axiosInstance.get(`/tv/${showId}/credits`);
      return response.data.cast.slice(0, 10); // Return top 10 cast members
    } catch (error) {
      console.error(`❌ TMDB API error for TV show cast (ID: ${showId}): ${error.response?.status} ${error.message}`);
      return [];
    }
  },

  async getSimilarMovies(movieId) {
    try {
      console.log(`Fetching similar movies for ID: ${movieId}`);
      const response = await axiosInstance.get(`/movie/${movieId}/similar`);
      return await this.transformMovies(response.data.results.slice(0, 12));
    } catch (error) {
      console.error(`❌ TMDB API error for similar movies (ID: ${movieId}): ${error.response?.status} ${error.message}`);
      return [];
    }
  },

  async getSimilarTVShows(showId) {
    try {
      console.log(`Fetching similar TV shows for ID: ${showId}`);
      const response = await axiosInstance.get(`/tv/${showId}/similar`);
      return await this.transformMovies(response.data.results.slice(0, 12));
    } catch (error) {
      console.error(`❌ TMDB API error for similar TV shows (ID: ${showId}): ${error.response?.status} ${error.message}`);
      return [];
    }
  },

  async getFavoriteMovies(accountId, sessionId) {
    if (!accountId || !sessionId) {
      throw new Error('Account ID and session ID required');
    }
    try {
      console.log(`Fetching favorite movies for account ${accountId}...`);

      if (!apiKey) {
        throw new Error('TMDB API key is required for favorite movies.');
      }

      // For user-specific endpoints, TMDB requires API key as query parameter
      const authInstance = axios.create({
        baseURL: TMDB_API_URL,
        params: { api_key: apiKey },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await authInstance.get(`/account/${accountId}/favorite/movies`, {
        params: { session_id: sessionId },
      });
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for favorite movies: ${error.response?.status} ${error.message}`);
      if (error.response?.status === 401) {
        throw new Error('Invalid session. Please try authenticating again.');
      } else if (error.response?.status === 404) {
        throw new Error('Favorite movies endpoint not found. Please check your API key permissions.');
      }
      throw new Error(`Failed to fetch favorite movies: ${error.message}`);
    }
  },

  async searchMovies(query) {
    try {
      console.log(`Searching for movies/TV shows with query: ${query}`);
      const response = await axiosInstance.get('/search/multi', {
        params: { query, include_adult: false },
      });
      return await this.transformMovies(response.data.results);
    } catch (error) {
      console.error(`❌ TMDB API error for search: ${error.response?.status} ${error.message}`);
      throw new Error(`Failed to search movies: ${error.message}`);
    }
  },

  async getSearchSuggestions(query) {
    if (!query) return [];
    try {
      console.log(`Fetching search suggestions for query: ${query}`);
      const response = await axiosInstance.get('/search/multi', {
        params: { query, include_adult: false, page: 1 },
      });
      const suggestions = response.data.results.slice(0, 5).map((item) => ({
        id: item.id,
        title: item.title || item.name,
        category: item.media_type === 'movie' ? 'movie' : 'tv_show',
      }));
      console.log(`Search suggestions:`, suggestions);
      return suggestions;
    } catch (error) {
      console.error(`❌ TMDB API error for search suggestions: ${error.response?.status} ${error.message}`);
      return [];
    }
  },

  async createRequestToken() {
    try {
      console.log('🔑 Creating TMDB request token...');

      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        throw new Error('TMDB API key is not configured. Please get your FREE API key from https://www.themoviedb.org/settings/api and update VITE_TMDB_API_KEY in .env.local.');
      }

      // For authentication endpoints, TMDB requires API key as query parameter
      const authInstance = axios.create({
        baseURL: TMDB_API_URL,
        params: { api_key: apiKey },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Testing TMDB API connectivity...');
      const testResponse = await authInstance.get('/movie/popular', { params: { page: 1 } });
      console.log('✅ TMDB API test successful');

      const response = await authInstance.post('/authentication/token/new');
      console.log('✅ TMDB request token created:', response.data.request_token);
      return response.data.request_token;
    } catch (error) {
      console.error(`❌ TMDB API error for request token:`, error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);

      if (error.response?.status === 401) {
        throw new Error('Invalid TMDB API key. Please check VITE_TMDB_API_KEY in .env.local or get a new key from https://www.themoviedb.org/settings/api.');
      } else if (error.response?.status === 429) {
        throw new Error('TMDB API rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 404) {
        throw new Error('TMDB API endpoint not found. Your API key may not have authentication permissions. Please check your API key settings at https://www.themoviedb.org/settings/api.');
      }
      throw new Error(`Failed to create request token: ${error.message}`);
    }
  },

  async createSession(requestToken) {
    try {
      console.log('Creating TMDB session with token:', requestToken);

      if (!apiKey) {
        throw new Error('TMDB API key is required for session creation.');
      }

      // For session creation, TMDB requires API key as query parameter
      const authInstance = axios.create({
        baseURL: TMDB_API_URL,
        params: { api_key: apiKey },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await authInstance.post('/authentication/session/new', {
        request_token: requestToken,
      });
      console.log('TMDB session ID:', response.data.session_id);
      return response.data.session_id;
    } catch (error) {
      console.error(`❌ TMDB API error for session creation: ${error.response?.status} ${error.message}`);
      if (error.response?.status === 401) {
        throw new Error('Invalid request token. Please try authenticating again.');
      } else if (error.response?.status === 404) {
        throw new Error('Session creation endpoint not found. Please check your API key permissions.');
      }
      throw new Error(`Failed to create session: ${error.message}`);
    }
  },

  async getAccountDetails(sessionId) {
    try {
      console.log('Fetching TMDB account details...');

      if (!apiKey) {
        throw new Error('TMDB API key is required for account details.');
      }

      // For account details, TMDB requires API key as query parameter
      const authInstance = axios.create({
        baseURL: TMDB_API_URL,
        params: { api_key: apiKey },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await authInstance.get('/account', {
        params: { session_id: sessionId },
      });
      console.log('TMDB account details:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ TMDB API error for account details: ${error.response?.status} ${error.message}`);
      if (error.response?.status === 401) {
        throw new Error('Invalid session. Please try authenticating again.');
      } else if (error.response?.status === 404) {
        throw new Error('Account details endpoint not found. Please check your API key permissions.');
      }
      throw new Error(`Failed to fetch account details: ${error.message}`);
    }
  },

  async getMovieVideos(movieId) {
    try {
      console.log(`Fetching videos for movie ID: ${movieId}`);
      const response = await axiosInstance.get(`/movie/${movieId}/videos`);
      const trailer = response.data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube' && video.official
      ) || response.data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      ) || response.data.results.find(
        (video) => video.site === 'YouTube'
      );
      if (!trailer) {
        console.log(`No YouTube trailer found for movie ID: ${movieId}`);
        return null;
      }
      return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0`;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`No videos available for movie ID: ${movieId}`);
        return null;
      }
      console.error(`❌ TMDB API error for movie videos (ID: ${movieId}): ${error.response?.status} ${error.message}`);
      return null;
    }
  },

  async getTVShowVideos(showId) {
    try {
      console.log(`Fetching videos for TV show ID: ${showId}`);
      const response = await axiosInstance.get(`/tv/${showId}/videos`);
      const trailer = response.data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube' && video.official
      ) || response.data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      ) || response.data.results.find(
        (video) => video.site === 'YouTube'
      );
      if (!trailer) {
        console.log(`No YouTube trailer found for TV show ID: ${showId}`);
        return null;
      }
      return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0`;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`No videos available for TV show ID: ${showId}`);
        return null;
      }
      console.error(`❌ TMDB API error for TV show videos (ID: ${showId}): ${error.response?.status} ${error.message}`);
      return null;
    }
  },

  async transformMovies(movies) {
    console.log('Transforming movies...');
    const genres = await this.getGenres('movie');
    const tvGenres = await this.getGenres('tv');
    const transformed = await Promise.all(
      movies.map(async (movie, index) => {
        const isMovie = movie.media_type === 'movie' || !movie.media_type;
        const id = movie.id;
        const trailer = isMovie
          ? await this.getMovieVideos(id)
          : await this.getTVShowVideos(id);
        await new Promise((resolve) => setTimeout(resolve, 300));
        return {
          id,
          title: movie.title || movie.name || 'Unknown Title',
          description: movie.overview || 'No description available.',
          image: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Image',
          backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : null,
          genre: movie.genre_ids ? movie.genre_ids.map(id => genres[id] || tvGenres[id] || 'Unknown').join(', ') : 'Unknown Genre',
          genre_ids: movie.genre_ids || [],
          duration: movie.runtime || 'N/A',
          match: movie.vote_average ? `★ ${movie.vote_average.toFixed(1)}` : 'N/A',
          category: isMovie ? 'movie' : 'tv_show',
          trailer,
        };
      })
    );
    console.log('Movies transformed:', transformed.length);
    return transformed;
  },
};

export default TMDBService;

