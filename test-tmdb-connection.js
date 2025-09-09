// Test TMDB API connection
import TMDBService from './src/services/tmdb.jsx';

async function testTMDBConnection() {
  console.log('🧪 Testing TMDB API connection...');

  try {
    console.log('📡 Testing trending movies fetch...');
    const trendingMovies = await TMDBService.getTrending('all', 'week');
    console.log(`✅ Successfully fetched ${trendingMovies.length} trending movies`);

    if (trendingMovies.length > 0) {
      const firstMovie = trendingMovies[0];
      console.log('🎬 First movie:', {
        title: firstMovie.title,
        id: firstMovie.id,
        hasImage: !!firstMovie.image,
        hasTrailer: !!firstMovie.trailer,
        category: firstMovie.category
      });
    }

    console.log('🎉 TMDB API is working correctly!');
    return true;
  } catch (error) {
    console.error('❌ TMDB API test failed:', error.message);
    console.error('Error details:', error.response?.data || error);
    return false;
  }
}

// Run the test
testTMDBConnection().then(success => {
  if (success) {
    console.log('✅ All tests passed!');
  } else {
    console.log('❌ Tests failed!');
  }
  process.exit(success ? 0 : 1);
});