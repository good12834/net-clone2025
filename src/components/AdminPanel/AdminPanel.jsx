'use client';

import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import TMDBService from '../../services/tmdb';
import './AdminPanel.css';

const AdminPanel = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search function
  const handleSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setError('Please enter a search query');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { results } = await TMDBService.search(query, 1);
        setSearchResults(results);
      } catch (error) {
        setError('Search failed. Please try again.');
        console.error('Admin search error:', error.message);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch.flush();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-panel d-flex justify-content-center align-items-center">
      <div className="admin-panel-content bg-dark text-white p-4 rounded shadow-lg">
        <button className="admin-panel-close btn btn-outline-light" onClick={onClose}>
          &times;
        </button>
        <h2 className="mb-4">Admin Panel</h2>
        <form onSubmit={handleSearchSubmit} className="input-group mb-3">
          <input
            type="text"
            className="form-control bg-dark text-white border-netflix-red"
            placeholder="Search movies or TV shows..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            className="btn btn-netflix-red"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </button>
        </form>
        {error && <div className="text-danger mb-3">{error}</div>}
        <div className="admin-results row">
          {searchResults.map((item) => (
            <div key={item.id} className="admin-result-item col-6 col-md-4 col-lg-3 mb-3">
              <img
                src={item.image}
                alt={item.title}
                className="img-fluid rounded"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
              <p className="mt-2 text-center">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;