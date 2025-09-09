import Hero from '../components/Hero/Hero';
import ContentRow from '../components/ContentRow';
import TMDBService from '../services/tmdb.jsx';

async function getPageData() {
  try {
    // In a real app, you'd fetch fresh data. For this example, we check cache first.
    // Note: Caching behavior in Server Components is more robust with `fetch`.
    // We are simulating a fetch here.
    const [trending, popularMovies, popularTV] = await Promise.all([
      TMDBService.getTrending('all', 'week'),
      TMDBService.getPopularMovies(1),
      TMDBService.getPopularTVShows(1),
    ]);

    const actionMovies = trending.filter(m => m.genre?.toLowerCase().includes('action')).slice(0, 10);
    const comedyMovies = trending.filter(m => m.genre?.toLowerCase().includes('comedy')).slice(0, 10);
    const dramaMovies = trending.filter(m => m.genre?.toLowerCase().includes('drama')).slice(0, 10);
    const sciFiMovies = trending.filter(m => m.genre?.toLowerCase().includes('sci-fi') || m.genre?.toLowerCase().includes('fantasy')).slice(0, 10);

    return {
      trendingData: trending.slice(0, 12),
      moviesData: actionMovies.length > 0 ? actionMovies : trending.slice(0, 10),
      tvShowsData: comedyMovies.length > 0 ? comedyMovies : popularTV.slice(0, 10),
      newPopularData: dramaMovies.length > 0 ? dramaMovies : popularMovies.slice(0, 10),
      popularData: sciFiMovies.length > 0 ? sciFiMovies : popularMovies.slice(0, 10),
    };
  } catch (error) {
    console.error('Error fetching page data:', error.message);
    // Fallback to empty arrays on error
    return {
      trendingData: [],
      moviesData: [],
      tvShowsData: [],
      newPopularData: [],
      popularData: [],
    };
  }
}

export default async function HomePage() {
  const {
    trendingData,
    moviesData,
    tvShowsData,
    newPopularData,
    popularData,
  } = await getPageData();

  // Note: onFavoriteToggle and onShowDetail would need to be handled client-side.
  // This example focuses on rendering the static data.
  // You would typically pass movie data to a client component that handles interactions.

  return (
    <main>
      <Hero featuredMovie={trendingData.length > 0 ? trendingData[0] : null} />

      <ContentRow title="Trending Now" movies={trendingData} />
      <ContentRow title="Action & Adventure" movies={moviesData} />
      <ContentRow title="Comedy Specials" movies={tvShowsData} />
      <ContentRow title="Drama Series" movies={newPopularData} />
      <ContentRow title="Sci-Fi & Fantasy" movies={popularData} />
      <ContentRow title="Award Winners" movies={trendingData.slice(0, 8)} />
      <ContentRow title="Documentaries" movies={tvShowsData.slice(0, 6)} />
      <ContentRow title="Thrillers" movies={newPopularData.slice(0, 6)} />
      <ContentRow title="Romance" movies={popularData.slice(0, 6)} />
    </main>
  );
}