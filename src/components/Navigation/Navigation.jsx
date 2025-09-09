// src/components/Navigation.jsx
import './Navigation.css';

const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <nav className="navigation">
      <ul>
        <li className={activeTab === 'home' ? 'active' : ''}>
          <button onClick={() => onTabChange('home')}>Home</button>
        </li>
        <li className={activeTab === 'tv-shows' ? 'active' : ''}>
          <button onClick={() => onTabChange('tv-shows')}>TV Shows</button>
        </li>
        <li className={activeTab === 'movies' ? 'active' : ''}>
          <button onClick={() => onTabChange('movies')}>Movies</button>
        </li>
        <li className={activeTab === 'new-popular' ? 'active' : ''}>
          <button onClick={() => onTabChange('new-popular')}>New & Popular</button>
        </li>
        <li className={activeTab === 'my-list' ? 'active' : ''}>
          <button onClick={() => onTabChange('my-list')}>My List</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;


