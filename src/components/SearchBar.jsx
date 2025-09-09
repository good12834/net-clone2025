// import { useState, useEffect, useRef } from 'react'
// import TMDBService from '../services/tmdb.jsx'
// import './SearchBar.css'

// const SearchBar = ({ onSearch, onClose }) => {
//   const [query, setQuery] = useState('')
//   const [results, setResults] = useState([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [showResults, setShowResults] = useState(false)
//   const searchRef = useRef(null)

//   // Handle search input
//   const handleSearch = async (searchQuery) => {
//     setQuery(searchQuery)

//     if (searchQuery.trim().length < 2) {
//       setResults([])
//       setShowResults(false)
//       return
//     }

//     setIsSearching(true)
//     try {
//       console.log('🔍 Searching TMDB for:', searchQuery)
//       const searchResults = await TMDBService.search(searchQuery, 1)
//       console.log('📋 Search results:', searchResults.results?.length || 0, 'items found')
//       setResults(searchResults.results || [])
//       setShowResults(true)
//     } catch (error) {
//       console.error('❌ Search error:', error)
//       setResults([])
//     } finally {
//       setIsSearching(false)
//     }
//   }

//   // Handle movie selection
//   const handleMovieSelect = (movie) => {
//     console.log('🎬 Movie selected:', movie.title)
//     setQuery('')
//     setResults([])
//     setShowResults(false)
//     if (onSearch) {
//       onSearch(movie)
//     }
//   }

//   // Close search when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowResults(false)
//         if (onClose) onClose()
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [onClose])

//   return (
//     <div className="search-container" ref={searchRef}>
//       <div className="search-input-wrapper">
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search movies, TV shows..."
//           value={query}
//           onChange={(e) => handleSearch(e.target.value)}
//           onFocus={() => query.length >= 2 && setShowResults(true)}
//         />
//         <button
//           className="search-clear-btn"
//           onClick={() => {
//             setQuery('')
//             setResults([])
//             setShowResults(false)
//           }}
//           style={{ display: query ? 'block' : 'none' }}
//         >
//           ×
//         </button>
//       </div>

//       {showResults && (
//         <div className="search-results">
//           {isSearching ? (
//             <div className="search-loading">
//               <div className="loading-spinner"></div>
//               Searching TMDB...
//             </div>
//           ) : results.length > 0 ? (
//             <>
//               {results.slice(0, 6).map((movie) => (
//                 <div
//                   key={movie.id}
//                   className="search-result-item"
//                   onClick={() => handleMovieSelect(movie)}
//                 >
//                   <img
//                     src={movie.image}
//                     alt={movie.title}
//                     className="search-result-image"
//                     onError={(e) => {
//                       e.target.src = '/placeholder-movie.jpg'
//                     }}
//                   />
//                   <div className="search-result-info">
//                     <h4>{movie.title}</h4>
//                     <p>{movie.genre} • {movie.duration}</p>
//                     <span className="search-result-rating">
//                       {movie.match}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//               {results.length > 6 && (
//                 <div className="search-view-all">
//                   <button
//                     onClick={() => {
//                       setShowResults(false)
//                       if (onSearch) onSearch({ type: 'search', query })
//                     }}
//                   >
//                     View all {results.length} results for "{query}"
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : query.length >= 2 && !isSearching ? (
//             <div className="search-no-results">
//               No movies found for "{query}"
//             </div>
//           ) : null}
//         </div>
//       )}
//     </div>
//   )
// }

// export default SearchBar