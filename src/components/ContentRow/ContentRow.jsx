// src/components/ContentRow.jsx
import './ContentRow.css';

const ContentRow = ({ title, movies, onPlayMovie, onFavoriteToggle, onShowDetail }) => {
  return (
    <div className="content-row">
      <h2>{title}</h2>
      <div className="content-row-movies">
        {movies.map((movie, index) => (
          <div key={`${movie.id}-${movie.title}-${index}`} className="movie-card">
           <div className="movie-poster-container">
             <img
               src={movie.image}
               alt={movie.title}
               onClick={() => {
                 console.log('🎬 Movie clicked:', movie.title, {
                   id: movie.id,
                   hasTrailer: !!movie.trailer,
                   trailerUrl: movie.trailer,
                   onShowDetail: typeof onShowDetail,
                   onPlayMovie: typeof onPlayMovie
                 });

                 // Always show movie details when clicking
                 if (onShowDetail) {
                   onShowDetail(movie);
                 } else {
                   console.error('❌ onShowDetail function not provided');
                 }
               }}
               className="clickable-movie"
             />
           </div>
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.match}</p>
              <button onClick={() => onFavoriteToggle(movie)}>
                {movie.isFavorite ? 'Remove from List' : 'Add to List'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRow;