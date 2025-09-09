import { useState, useEffect } from 'react';
import TMDBService from '../../services/tmdb';
import './FilterBar.css';

const FilterBar = ({ onGenreFilter, onRatingFilter, onClearFilters }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreObj = await TMDBService.getGenres();
        // Convert object to array format for easier rendering
        const genreList = Object.entries(genreObj).map(([id, name]) => ({
          id: parseInt(id),
          name
        }));
        setGenres(genreList);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreToggle = (genreId) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];

    setSelectedGenres(newSelectedGenres);
    onGenreFilter(newSelectedGenres);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    onRatingFilter(rating);
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSelectedRating('');
    onClearFilters();
  };

  const toggleFilterBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="filter-bar">
      <button className="filter-toggle" onClick={toggleFilterBar}>
        <i className="fas fa-filter"></i>
        Filters
        {(selectedGenres.length > 0 || selectedRating) && (
          <span className="filter-count">
            {selectedGenres.length + (selectedRating ? 1 : 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="filter-content">
          <div className="filter-section">
            <h4>Genres</h4>
            <div className="genre-grid">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  className={`genre-btn ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                  onClick={() => handleGenreToggle(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Minimum Rating</h4>
            <div className="rating-options">
              {[7, 8, 9].map(rating => (
                <button
                  key={rating}
                  className={`rating-btn ${selectedRating === rating.toString() ? 'active' : ''}`}
                  onClick={() => handleRatingChange(rating.toString())}
                >
                  {rating}+ ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="filter-actions">
            <button className="clear-btn" onClick={handleClearFilters}>
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;