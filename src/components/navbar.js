'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {searchGames} from '@/lib/rawg';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Navbar({ searchQuery, setSearchQuery, handleSearch, mobileMenuOpen, setMobileMenuOpen }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    searchGames(searchQuery, 1)
      .then(data => setSuggestions(data.results || []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoadingSuggestions(false));
  }, [searchQuery]);

  // Close overlay on route change
  useEffect(() => {
    if (!showMobileOverlay) return;
    const handleRoute = () => setShowMobileOverlay(false);
    router.events?.on?.('routeChangeStart', handleRoute);
    return () => router.events?.off?.('routeChangeStart', handleRoute);
  }, [showMobileOverlay, router]);

  return (
    <nav className="bg-gray-800 text-white border-gray-700 border-b-[0.5px] shadow-md fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-auto py-3 h-full px-3 sm:px-6 lg:px-8">
        <div className="h-full flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-3 md:gap-3 lg:gap-4">
            <Link href="/" className="text-lg sm:text-2xl md:text-2xl font-bold hover:text-blue-400 transition">
              GameStack
            </Link>
                <form onSubmit={handleSearch} className="relative">
            <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle cx="11" cy="11" r="10" />
                <line x1="16.5" y1="19.5" x2="21" y2="24" />
            </svg>
                 <input
                   ref={inputRef}
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onFocus={() => {
                     if (window.innerWidth < 640) setShowMobileOverlay(true);
                   }}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       e.preventDefault();
                       return false;
                     }
                   }}
                   placeholder="Enter game"
                   className="bg-gray-700 text-white border-gray-600 focus:ring-blue-400 placeholder:text-gray-400 rounded-lg shadow-sm w-20 sm:w-48 md:w-40 lg:w-[200px] pl-8 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border focus:outline-none focus:ring-2"
                 />
                {/* Desktop/Tablet Suggestions Panel */}
                {searchQuery && suggestions.length > 0 && !showMobileOverlay && (
                  <div className="absolute left-0 right-0 mt-5 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-80 min-w-[320px] w-[350px] overflow-y-auto scrollbar-hide thin-scrollbar">
                    {suggestions.map(game => (
                      <div
                        key={game.id}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-700 cursor-pointer text-base border-b border-gray-700"
                        onClick={() => {
                          setSearchQuery('');
                          setSuggestions([]);
                          setShowMobileOverlay(false);
                          router.push(`/game/${game.id}`);
                        }}
                      >
                        {game.background_image && (
                          <img 
                            src={game.background_image}
                            alt={game.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <span className="whitespace-nowrap truncate max-w-[200px]">{game.name}</span>
                      </div>
                    ))}
                    <div
                      className="sticky bottom-0 bg-gray-900 flex items-center justify-center px-4 py-3 hover:bg-blue-700 cursor-pointer text-base font-semibold text-blue-400"
                        onClick={() => {
                          setSuggestions([]);
                          setShowMobileOverlay(false);
                          handleSearch({ preventDefault: () => {} });
                        }}
                    >
                      See all results
                    </div>
                  </div>
                )}
                {/* Mobile Fullscreen Overlay */}
                {showMobileOverlay && (
                  <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col">
                    <div className="flex items-center px-4 py-3 border-b border-gray-700">
                      <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        placeholder="Search games..."
                        className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                        style={{ minWidth: 0 }}
                      />
                      <button
                        type="button"
                        className="ml-3 text-gray-400 hover:text-white text-2xl font-bold"
                        onClick={() => {
                          setShowMobileOverlay(false);
                          setSearchQuery('');
                          setSuggestions([]);
                        }}
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto thin-scrollbar px-2 py-4">
                      {suggestions.length === 0 && !loadingSuggestions && (
                        <div className="text-center text-gray-400 mt-8">No results found.</div>
                      )}
                      {suggestions.map(game => (
                        <div
                          key={game.id}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-gray-700 cursor-pointer text-base border-b border-gray-700"
                          onClick={() => {
                            setSearchQuery('');
                            setSuggestions([]);
                            setShowMobileOverlay(false);
                            router.push(`/game/${game.id}`);
                          }}
                        >
                          {game.background_image && (
                            <img 
                              src={game.background_image}
                              alt={game.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <span className="whitespace-nowrap truncate max-w-[200px]">{game.name}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="bg-gray-900 flex items-center justify-center px-4 py-4 hover:bg-blue-700 cursor-pointer text-base font-semibold text-blue-400 border-t border-gray-700"
                        onClick={() => {
                          setSuggestions([]);
                          setShowMobileOverlay(false);
                          handleSearch({ preventDefault: () => {} });
                        }}
                    >
                      See all results
                    </div>
                  </div>
                )}
            </form>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="hidden md:flex gap-4">
              <Link href="/pages/genre" className="text-white hover:text-blue-400 flex gap-1.25 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                Genres
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}