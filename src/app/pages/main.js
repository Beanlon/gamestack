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

  console.log('API Key:', process.env.NEXT_PUBLIC_RAWG_API_KEY);
  console.log('Games:', games);
  console.log('Loading:', loading);

  // Load popular games on mount
  useEffect(() => {
    loadPopularGames();
  }, []);

  async function loadPopularGames() {
    setLoading(true);
    try {
      const data = await getPopularGames();
      setGames(data. results);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (! searchQuery.trim()) {
      loadPopularGames();
      return;
    }

    setLoading(true);
    try {
      const data = await searchGames(searchQuery);
      setGames(data.results);
    } catch (error) {
      console.error('Error searching games:', error);
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
            <div className="bg-gray-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
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
