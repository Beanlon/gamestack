'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import BottomNav from '@/components/bottomNav';
import GameCard from '@/components/Gamecard';
import { getAllGenres, getGamesByGenre } from '@/lib/rawg';

export default function GenresPage() {
  const [genres, setGenres] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [loadingGames, setLoadingGames] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadGenres();
  }, []);

  async function loadGenres() {
    setLoadingGenres(true);
    try {
      const data = await getAllGenres();
      setGenres(data.results);
    } catch (error) {
      console.error('Error loading genres:', error);
    } finally {
      setLoadingGenres(false);
    }
  }

  async function handleGenreClick(genreId, genreName) {
    // Check if genre is already selected
    const isSelected = selectedGenres.some(g => g.id === genreId);
    
    if (isSelected) {
      // Remove genre from selection
      setSelectedGenres(selectedGenres.filter(g => g.id !== genreId));
    } else {
      // Add genre to selection
      setSelectedGenres([...selectedGenres, { id: genreId, name: genreName }]);
    }
  }


  useEffect(() => {
    // Load games whenever selected genres change
    if (selectedGenres.length > 0) {
      loadGamesBySelectedGenres();
    } else {
      setGames([]);
    }
  }, [selectedGenres]);

  async function loadGamesBySelectedGenres() {
    setLoadingGames(true);
    try {
      // Create a comma-separated list of genre IDs
      const genreIds = selectedGenres.map(g => g.id).join(',');
      const data = await getGamesByGenre(genreIds);
      setGames(data.results);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoadingGames(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
  }

  return (
    <>
      <header>
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </header>
      <main className="max-w-7xl bg-gray-900 min-h-screen mx-auto px-3 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Genres Section */}
        <div className="mb-5">
          <h1 className="text-3xl text-white font-bold mb-6">Select genres</h1>
          
          {loadingGenres && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Loading genres...</p>
            </div>
          )}

          {!loadingGenres && genres.length > 0 && (
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 min-w-min">
                {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id, genre.name)}
                  className={`rounded-lg shadow-md hover:shadow-lg transition-all p-6 flex items-center 
                    justify-center h-20 cursor-pointer font-bold text-lg text-center flex-shrink-0 w-40 ${
                    selectedGenres.some(g => g.id === genre.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loadingGenres && genres.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No genres found</p>
            </div>
          )}
        </div>

        <h2 className="text-2xl my-5 text-white text-4xl font-bold">
          {games.length} Games found
        </h2>

        {/* Games Section */}
        {selectedGenres.length > 0 && (
          <div>
            {loadingGames && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">Loading games...</p>
              </div>
            )}
            

            <div className="lfex justify-center items-center gap-6 mt-12 mb-8">
              <button onClick={handlePrev} disabled={!hasPreV}
                className={`flex items-center justify-center w-12 h-12 rounded-lg transition 
                ${
                  hasPrevPage
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

            </div>

            {!loadingGames && games.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}

            {!loadingGames && games.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No games found for selected genres</p>
              </div>
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}