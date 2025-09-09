# 🎬 Netflix Clone - Enhanced Version

A fully-featured Netflix clone built with **Next.js**, **React**, **Context API**, **TMDB API**, and **Axios** for API requests.

## ✨ Features

### 🎯 Core Features
- ✅ **Next.js Routing** - Page-based routing for Home, Movies, TV Shows, New & Popular, My List
- ✅ **Context API** - Global state management for authentication and app state
- ✅ **TMDB API Integration** - Real movie data from The Movie Database
- ✅ **Axios HTTP Client** - Robust API requests with error handling
- ✅ **Responsive Design** - Mobile-first approach with Bootstrap
- ✅ **Authentication System** - Login, register, and user management

### 🎬 Netflix-Style Features
- ✅ **Movie Detail Pages** - Large posters, descriptions, cast, ratings
- ✅ **Trailer Preview** - Video playback for movie trailers
- ✅ **Horizontal Carousels** - Netflix-style scrolling content rows
- ✅ **Add to My List** - Save favorite movies and TV shows
- ✅ **Search Functionality** - Search across movies and TV shows
- ✅ **User Profiles** - Personalized experience with user accounts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- TMDB API Key (free)

### Installation

1. **Clone and Install**
```bash
cd netflix-clone
npm install
```

2. **Get TMDB API Key**
```bash
# Visit: https://www.themoviedb.org/settings/api
# Create account and request API key
```

3. **Configure Environment**
```bash
# Edit .env.local
NEXT_PUBLIC_TMDB_API_KEY=your_actual_tmdb_api_key_here
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Start Backend Server** (in separate terminal)
```bash
cd ../netflix-fullstack/backend
npm start
```

## 📁 Project Structure

```
netflix-clone/
├── app/                          # Next.js App Router
│   ├── layout.js                # Root layout with AuthProvider
│   ├── page.js                  # Home page
│   ├── movies/                  # Movies page
│   ├── tv-shows/                # TV Shows page
│   ├── new-popular/             # New & Popular page
│   └── my-list/                 # My List page
├── src/
│   ├── components/              # React components
│   │   ├── Header.jsx          # Navigation header
│   │   ├── MovieCard.jsx       # Movie card component
│   │   ├── MovieDetail.jsx     # Movie detail modal
│   │   ├── ContentRow.jsx      # Horizontal carousel
│   │   └── ...
│   ├── context/                 # Context API
│   │   └── AuthContext.jsx     # Authentication context
│   ├── services/                # API services
│   │   └── tmdb.js             # TMDB API service
│   └── utils/                   # Utility functions
├── public/                      # Static assets
└── styles/                      # Global styles
```

## 🔧 Configuration

### TMDB API Setup
1. Visit [TMDB API Settings](https://www.themoviedb.org/settings/api)
2. Create API key (v3 auth)
3. Add to `.env.local`:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

### Backend API
The app connects to a custom backend API running on port 4000:
```javascript
// API endpoints used:
POST /api/auth/login
POST /api/auth/register
GET  /api/movies/my-list
POST /api/movies/my-list
DELETE /api/movies/my-list/:id
```

## 🎯 Key Components

### AuthContext (`src/context/AuthContext.jsx`)
```javascript
const { user, isAuthenticated, login, register, logout, myList } = useAuth()
```

### TMDB Service (`src/services/tmdb.js`)
```javascript
import tmdbService from '../services/tmdb'

// Get trending movies
const trending = await tmdbService.getTrending('all', 'week')

// Search movies
const results = await tmdbService.search('Avengers')
```

### Movie Detail Modal (`src/components/MovieDetail.jsx`)
```jsx
<MovieDetail
  movie={selectedMovie}
  onClose={handleClose}
  onPlayMovie={handlePlay}
/>
```

## 🎨 Styling

### CSS Architecture
- **Bootstrap 5** - Responsive grid and components
- **Custom CSS** - Netflix-style theming
- **Font Awesome** - Icons and symbols
- **Google Fonts** - Netflix Sans font family

### Key Styles
```css
/* Netflix color scheme */
--netflix-red: #e50914;
--netflix-dark: #141414;
--netflix-gray: #808080;

/* Responsive breakpoints */
@media (max-width: 768px) { ... }
```

## 🔐 Authentication Flow

1. **Registration/Login** → Store JWT token in localStorage
2. **Auto-login** → Check token on app load
3. **Protected Routes** → Redirect unauthenticated users
4. **My List** → Sync user's saved movies

## 🎬 TMDB API Integration

### Available Endpoints
```javascript
// Trending content
tmdbService.getTrending(mediaType, timeWindow)

// Popular movies/TV shows
tmdbService.getPopularMovies()
tmdbService.getPopularTVShows()

// Search functionality
tmdbService.search(query, page)

// Movie/TV details
tmdbService.getMovieDetails(movieId)
tmdbService.getTVShowDetails(tvId)

// Trailers and videos
tmdbService.getMovieVideos(movieId)
tmdbService.getTVVideos(tvId)
```

### Data Transformation
TMDB data is transformed to match the app's data structure:
```javascript
{
  id: movie.id,
  title: movie.title,
  description: movie.overview,
  image_url: `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`,
  backdrop_url: `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`,
  rating: movie.vote_average,
  // ... more fields
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_TMDB_API_KEY=your_production_api_key
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

## 🐛 Troubleshooting

### Common Issues

1. **TMDB API Key Issues**
   - Ensure API key is valid and has correct permissions
   - Check `.env.local` file is in project root

2. **Backend Connection Issues**
   - Ensure backend server is running on port 4000
   - Check CORS settings in backend

3. **Authentication Problems**
   - Clear localStorage: `localStorage.clear()`
   - Check JWT token expiration

4. **Build Errors**
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

## 📝 API Reference

### Authentication Endpoints
```javascript
// Login user
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Register user
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Movie List Endpoints
```javascript
// Get user's list
GET /api/movies/my-list

// Add to list
POST /api/movies/my-list
{
  "movieId": 123
}

// Remove from list
DELETE /api/movies/my-list/123
```

## 🎯 Next Steps

### Potential Enhancements
- [ ] **Video Streaming** - Integrate video player for full movies
- [ ] **User Profiles** - Multiple profiles per account
- [ ] **Ratings & Reviews** - User-generated content
- [ ] **Social Features** - Share movies, follow friends
- [ ] **Offline Viewing** - Download content for offline
- [ ] **Advanced Search** - Filters by genre, year, rating
- [ ] **Recommendations** - AI-powered suggestions

### Performance Optimizations
- [ ] **Image Optimization** - Next.js Image component
- [ ] **Lazy Loading** - Load content as needed
- [ ] **Caching** - Redis for API responses
- [ ] **CDN** - Content delivery network
- [ ] **PWA** - Progressive web app features

## 📄 License

This project is for educational purposes. Please respect TMDB's terms of service and Netflix's trademarks.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

**🎬 Happy streaming!** Built with ❤️ using Next.js, React, and TMDB API.