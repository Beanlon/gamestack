'use client';

import { useState, useEffect } from 'react';
import GameCard from '@/components/Gamecard';
import Navbar from '@/components/navbar';
import { getPopularGames, searchGames } from '@/lib/rawg';
import BottomNav from '@/components/bottomNav';
import Footer from '@/components/footer';

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  console.log('API Key:', process.env.NEXT_PUBLIC_RAWG_API_KEY);
  console.log('Games:', games);
  console.log('Loading:', loading);

  // Load popular games on mount
  useEffect(() => {
    loadPopularGames(1);
  }, []);

  async function loadPopularGames() {
    setLoading(true);
    try {
      const data = await getPopularGames(page);
      if (page === 1) {
        setGames(data.results);
      } else {
        setGames(prev => [...prev, ...data.results]);
      }
      setHasMore(data.results && data.results.length > 0);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    if (!searchQuery.trim()) {
      loadPopularGames(1);
      return;
    }
    setLoading(true);
    try {
      const data = await searchGames(searchQuery, 1);
      setGames(data.results);
      setHasMore(data.results && data.results.length > 0);
    } catch (error) {
      console.error('Error searching games:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeeMore() {
    const nextPage = page + 1;
    setLoading(true);
    try {
      let data;
      if (!searchQuery.trim()) {
        data = await getPopularGames(nextPage);
      } else {
        data = await searchGames(searchQuery, nextPage);
      }
      setGames(prev => [...prev, ...data.results]);
      setPage(nextPage);
      setHasMore(data.results && data.results.length > 0);
    } catch (error) {
      console.error('Error loading more games:', error);
    } finally {
      setLoading(false);
    }
  }

    return (
    <>
      <header>
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          setMobileMenuOpen={setMobileMenuOpen}
          mobileMenuOpen={mobileMenuOpen}
        />
      </header>
      <main className="max-w-7xl min-h-screen mx-auto px-3 sm:px-6 lg:px-8 pt-24 pb-19">
      <div>
        <div>
          {/* Loading State */}
          {loading && (
            <div className="max-w-7xl text-center py-12">
              <p className="mx-auto text-xl text-gray-400">Loading games...</p>
            </div>
          )}

          {/* Games Grid */}
          {!loading && games.length > 0 && (
            <>
              <div className="bg-gray-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={handleSeeMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'See more'}
                  </button>
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!loading && games.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No games found</p>
            </div>
          )}
        </div>
      </div>
      </main>
      <BottomNav />
      <Footer />
    </>
  );
}
