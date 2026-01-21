'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar({ searchQuery, setSearchQuery, handleSearch, mobileMenuOpen, setMobileMenuOpen}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white border-gray-700 h-20 border-b-[0.5px] shadow-md fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8">
        <div className="h-full flex justify-between items-center">
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
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
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter game"
            className="bg-gray-700 text-white border-gray-600 focus:ring-blue-400 placeholder:text-gray-400 rounded-lg shadow-sm w-20 sm:w-48 md:w-40 lg:w-[200px] pl-8 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border focus:outline-none focus:ring-2"
            />
            </form>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="hidden md:flex gap-4">
              <Link href="/" className="text-white hover:text-blue-400 flex gap-1.25 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                Explore
              </Link>
              <Link href="/pages/genre" className="text-white hover:text-blue-400 flex gap-1.25 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                Genres
              </Link>
              <Link href="/favorites" className="text-white hover:text-blue-400 flex gap-1.25 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favorites
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}