'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getGameDetails, getGameScreenshots, getGameVideos } from '@/lib/rawg';
import { iconForPlatform } from '@/components/Gamecard';
import BottomNav from '@/components/bottomNav';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';


export default function GameDetailPage() {
  const params = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDescriptionClamped, setIsDescriptionClamped] = useState(false);
  const descriptionRef = useRef(null);

  const THUMBNAILS_PER_PAGE = 6;

  const esrbLabel = (name) => {
    const map = {
      'Everyone': 'Content is suitable for all ages. May contain minmal cartoon, fantasy or mild violcence',
      'Everyone 10+': 'Content for Ages 10 and up. May contain more cartoon, fantasy or mild violence, mild language and/ or minimal themes',
      'Teen': 'Content for Ages 13 and up. May contain violence, crude humor, minimal blood and/ or infrequent use of strong language',
      'Mature': 'Content for Ages 17 and up. May contain intense violence, blood & gore, sexual content and/or strong language',
      'Adults Only': 'Content for Ages 18 and up. May unclude prolonged scenes of intense violence and/or graphic sexual content',
      'Rating Pending': 'Final rating not assigned yet',
    };
    return map[name] || 'Not rated';
  };

  const renderEsrbIcon = (name) => {
    const svgMap = {
      'Everyone': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/ESRB_Everyone.svg', //
      'Everyone 10+': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/ESRB_Everyone_10%2B.svg', //
      'Teen': 'https://upload.wikimedia.org/wikipedia/commons/b/be/ESRB_Teen.svg', //
      'Mature': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/ESRB_Mature_17%2B.svg', // your link
      'Adults Only': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/ESRB_Adults_Only_18%2B.svg', //
      'Rating Pending': null,
    };
    
    const svgPath = svgMap[name];
    if (!svgPath) return null;

    return (
      <img
        src={svgPath}
        alt={`ESRB ${name}`}
        className=" py-2 h-auto w-auto"
      />
    );
  };

  const mapStoreToPlatformSlug = (slug = '') => {
    const lower = slug.toLowerCase();
    if (lower.includes('steam')) return 'steam';
    if (lower.includes('gog')) return 'gog';
    if (lower.includes('epic')) return 'epic';
    if (lower.includes('playstation') || lower.includes('psn')) return 'playstation';
    if (lower.includes('xbox') || lower.includes('microsoft')) return 'xbox';
    if (lower.includes('nintendo')) return 'nintendo';
    if (lower.includes('apple') || lower.includes('ios')) return 'ios';
    if (lower.includes('mac')) return 'mac';
    if (lower.includes('pc') || lower.includes('windows')) return 'pc';
    return lower;
  };

  const MeteColor = (rating) => {
    if (rating >= 75) return '#5ed35e';
    if (rating >= 50 && rating <= 74) return '#ffc70f';
    if (rating >= 0 && rating <= 49) return '#ff170f';
  }

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return `TBA`;
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric'}).format(date);
  }
  
  const getReleaseLabel = (released, tba) => {
    if (tba || !released) return 'TBA';
    return formatReleaseDate(released);
  };


  const formatDescription = (text) => {
    if (!text) return '';
    
    // Split by double line breaks or single line breaks
    let paragraphs = text.split(/\n\n+/);
    
    // If no double breaks, try single breaks
    if (paragraphs.length === 1) {
      paragraphs = text.split(/\n+/);
    }
    
    // Clean up each paragraph
    paragraphs = paragraphs
      .map(p => {
        // Trim whitespace
        p = p.trim();
        // Remove HTML tags
        p = p.replace(/<[^>]*>/g, '');
        // Remove markdown symbols (*, _, **, __)
        p = p.replace(/[\*_]+/g, '');
        // Remove markdown heading symbols (#)
        p = p.replace(/^#+\s*/g, '');
        // Remove extra brackets and braces
        p = p.replace(/[\[\{\(]+\s*[\]\}\)]+/g, '');
        // Clean up multiple spaces
        p = p.replace(/\s+/g, ' ').trim();
        return p;
      })
      .filter(p => p.length > 0);
    
    return paragraphs;
  }

  const isTitle = (text) => {
    // Check if text looks like a title
    const wordCount = text.split(/\s+/).length;
    const hasNumbers = /\d/.test(text);
    
    // Titles are usually short (1-5 words), don't have many numbers
    return wordCount <= 5 && wordCount > 0 && !hasNumbers;
  }

  const PersonTooltip = ({ items, firstName }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const extraCount = items?.length - 1 || 0;

    if (!items || items.length === 0) return null;

    return (
      <div className="flex items-center gap-1 relative">
        <span className="text-sm">{firstName}</span>
        {extraCount > 0 && (
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="text-xs bg-gray-600 text-gray-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition">
              +{extraCount}
            </span>
            {showTooltip && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-700 text-gray-200 rounded-lg shadow-lg p-3 min-w-max z-50 border border-gray-600">
                <div className="text-xs font-semibold mb-2 text-white">Others:</div>
                {items.slice(1).map((item) => (
                  <div key={item.id} className="text-xs py-1 text-gray-300">
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
  loadGameDetails();
  }, [params.id]);

  useEffect(() => {
    // Check if description is clamped after game data loads
    if (descriptionRef.current && game?.description_raw) {
      const element = descriptionRef.current;
      setIsDescriptionClamped(element.scrollHeight > element.clientHeight);
    }
  }, [game]);

  async function loadGameDetails() {
    setLoading(true);
    try {
      const [gameData, screenshotsData, videosData] = await Promise.all([
        getGameDetails(params.id),
        getGameScreenshots(params.id),
        getGameVideos(params.id)
      ]);
      setGame(gameData);
      
      // Combine media in order: videos first, then background image, then screenshots
      const allMedia = [
        ...(videosData.results || []).map(video => {
          const videoSource = video.data?.max || video.data?.['1080'] || video.data?.['720'] || video.data?.['480'];
          return {
            id: `video-${video.id}`, 
            image: video.preview,
            isVideo: true,
            videoData: videoSource
          };
        }),
        { id: 'bg', image: gameData.background_image, isVideo: false },
        ...(screenshotsData.results || []).map(screenshot => ({ 
          ...screenshot, 
          isVideo: false 
        }))
      ];
      
      setScreenshots(allMedia);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={(e) => e.preventDefault()}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="max-w-7xl min-h-screen mx-auto px-3 sm:px-6 lg:px-8 py-12 pt-24 flex items-center justify-center">
          <p className="text-center text-xl text-gray-400">Loading game details...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!game) {
    return (
      <main className="max-w-7xl min-h-screen mx-auto px-3 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-xl text-gray-400">Game not found</p>
      </main>
    );
  }

  return (
    <>
      <header>
        <Navbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={(e) => e.preventDefault()} // or implement search navigation
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </header>
      <main className="max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen mx-auto px-3 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="col-span-1 lg:col-span-2">
          {/* Hero Image/Video */}
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden mb-4 shadow-lg bg-black">
            {screenshots[currentImageIndex]?.isVideo && screenshots[currentImageIndex]?.videoData ? (
              <video
                src={screenshots[currentImageIndex]?.videoData}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={screenshots[currentImageIndex]?.image || game.background_image}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Screenshot Thumbnails with Navigation */}
          {screenshots.length > 1 && (() => {
            const totalPages = Math.ceil(screenshots.length / THUMBNAILS_PER_PAGE);
            const startIndex = currentPage * THUMBNAILS_PER_PAGE;
            const endIndex = Math.min(startIndex + THUMBNAILS_PER_PAGE, screenshots.length);
            const visibleScreenshots = screenshots.slice(startIndex, endIndex);

            return (
            <div className="flex items-center justify-center gap-1 sm:gap-3 mb-8">
              {/* Previous Arrow */}
              <button
                onClick={() => setCurrentPage((prev) => prev === 0 ? totalPages - 1 : prev - 1)}
                className="hidden sm:flex flex-shrink-0 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-2 transition"
                aria-label="Previous page"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className='overflow-x-auto'>
                {/* Thumbnails */}
                <div className="flex gap-1 sm:gap-2">
                  {visibleScreenshots.map((screenshot, idx) => {
                    const actualIndex = startIndex + idx;
                    return (
                    <button
                      key={screenshot.id}
                      onClick={() => setCurrentImageIndex(actualIndex)}
                      className={`flex-shrink-0 w-30 h-18 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 transition ${
                        currentImageIndex === actualIndex
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={screenshot.image}
                        alt={`Screenshot ${actualIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );})}
                </div>
              </div>


              {/* Next Arrow */}
              <button
                onClick={() => setCurrentPage((prev) => prev === totalPages - 1 ? 0 : prev + 1)}
                className="hidden sm:flex flex-shrink-0 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-2 transition"
                aria-label="Next page"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            );
          })()}

          <h1 className="text-2xl sm:text-3xl font-extrabold pb-4 mb-4 border-b text-white border-gray-700">{game.name}</h1>
          {/* Description */}
          {game.description_raw && (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">About</h2>
              <div className="relative">
                <div 
                  ref={descriptionRef}
                  className={`leading-relaxed ${!showFullDescription ? 'line-clamp-6' : ''} text-gray-300`}
                >
                  {formatDescription(game.description_raw).map((paragraph, index) => (
                    isTitle(paragraph) ? (
                      <h3 key={index} className="text-lg font-bold mb-2 mt-4 first:mt-0 text-white">
                        {paragraph}
                      </h3>
                    ) : (
                      <p key={index} className="mb-4 last:mb-0 text-justify">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
                {!showFullDescription && isDescriptionClamped && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t pointer-events-none from-gray-900 to-transparent"></div>
                )}
              </div>
              {isDescriptionClamped && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showFullDescription ? 'See Less' : 'See More'}
                </button>
              )}
            </div>
          )}
          
          <div>

          </div>

          {/* Game Stats */}
          <div className="mb-8 rounded-lg p-2 sm:p-4 shadow-lg bg-gray-800 border border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">Ratings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {game.rating && (
                <div className="p-2 sm:p-3 rounded-lg bg-gray-700 border border-gray-600">
                  <div className="h-14 w-14 sm:h-20 sm:w-20 mx-auto flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3 ">
                    <svg className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-400 fill-current flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <p className="text-2xl sm:text-4xl font-bold text-white">{game.rating.toFixed(1)}/5</p>
                  </div>
                  <p className="text-xs sm:text-lg text-center font-semibold mb-1 text-gray-400">USER RATING</p>
                </div>
              )}
              {game.reviews_count && (
                <div className="p-2 sm:p-3 rounded-lg bg-gray-700 border border-gray-600">
                  <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl mx-auto flex items-center justify-center mb-2 sm:mb-3">
                    <p className="text-2xl sm:text-4xl text-center font-bold text-white">{game.reviews_count}</p>
                  </div>
                  <p className="text-xs sm:text-lg text-center font-semibold mb-1 text-gray-400">REVIEWS</p>
                </div>
              )}
              {game.metacritic ? (
                <div className="p-2 sm:p-3 rounded-lg col-span-2 sm:col-span-1 bg-gray-700 border border-gray-600">
                  <div style={{ backgroundColor: MeteColor(game.metacritic) }} className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl mx-auto flex items-center justify-center mb-2 sm:mb-3">
                    <p className="text-2xl sm:text-3xl text-center font-bold text-white">{game.metacritic}</p>
                  </div>
                  <p className="text-xs sm:text-lg text-center font-semibold mb-1 text-gray-400">METACRITIC</p>
                </div>
              ) : (
                <div className="p-2 sm:p-3 rounded-lg col-span-2 sm:col-span-1 bg-gray-700">
                  <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl mx-auto flex items-center justify-center mb-2 sm:mb-3 bg-gray-600">
                    <p className="text-lg sm:text-xl text-center font-bold text-gray-400">N/A</p>
                  </div>
                  <p className="text-xs sm:text-lg text-center font-semibold mb-1 text-gray-400">METACRITIC</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:self-start space-y-4">
          <div className="rounded-xl shadow-xl px-4 sm:px-5 py-4 sm:py-5 bg-gray-800 border border-gray-700">
          {/* Game Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white border-b border-gray-200 pb-5">{game.name}</h1>
            <div className="grid grid-cols-2 gap-3 py-4">
            <div className="text-lg sm:text-xl font-bold col-span-2 text-white">
              <p>Where to Play</p>
            </div>
            {/* Store Links */}
            {game.stores?.length > 0 && game.stores.map((storeItem) => {
              let storeUrl = '';
              const storeName = storeItem.store.name.toLowerCase();
              const platformSlug = mapStoreToPlatformSlug(storeItem.store.slug || storeItem.store.name);
              const icon = iconForPlatform(platformSlug);
              
              if (storeName.includes('steam')) {
                storeUrl = `https://store.steampowered.com/app/${game.id}/${game.name}`;
              } else if (storeName.includes('epic')) {
                storeUrl = `https://www.epicgames.com/games/${game.slug}`;
              } else if (storeName.includes('playstation') || storeName.includes('psn')) {
                storeUrl = `https://www.playstation.com/en-us/games/${game.slug}/`;
              } else if (storeName.includes('xbox')) {
                storeUrl = `https://www.xbox.com/en-US/games/${game.slug}`;
              } else if (storeName.includes('nintendo')) {
                storeUrl = `https://www.nintendo.com`;
              } else if (storeName.includes('gog')) {
                storeUrl = `https://www.gog.com/en/games?query=${encodeURIComponent(game.name)}`;
              } else {
                const domain = storeItem.store.domain || '';
                storeUrl = domain.startsWith('http') ? domain : domain ? `https://${domain}` : 'https://rawg.io';
              }

              return (
                <a
                  key={storeItem.store.id}
                  href={storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-500 text-white text-sm sm:text-md font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-center transition"
                >
                  {icon && <span className="text-white">{icon}</span>}
                  <span>{storeItem.store.name.replace(/store/i, '').trim()}</span>
                </a>
              );
            })}

            <div className='col-span-2'>
              <div className="pb-2 sm:pb-3 text-lg sm:text-xl font-semibold text-white">
                <p>Know more</p>
              </div>
              {/* Reddit Link */}
              {game.reddit_url && (
                <a
                  href={game.reddit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-center transition mb-3"
                >
                  Discuss on Reddit
                </a>
              )}

              {/* Official Website */}
              {game.website && (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-center transition"
                >
                  Official Website
                </a>
              )}
            </div>
          </div>
            <div className="grid grid-cols-3 gap-2 rounded-lg border bg-gray-700 border-gray-600">
              <div className="col-span-1 ml-3 my-2 flex items-start justify-start">
                {renderEsrbIcon(game.esrb_rating?.name)}
              </div>
              <div className="col-span-2 mr-3 my-2">
                {game.esrb_rating && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-600">
                    <span className="text-sm font-bold text-white">
                      {game.esrb_rating.name}
                    </span>
                  </div>
                )}
                <div className="pt-2">
                  <p className="text-sm text-justify text-gray-300">
                    {game.esrb_rating?.name ? esrbLabel(game.esrb_rating.name) : 'No rating available'}
                  </p>
                </div>
              </div>
            </div>
            <div className="my-3 ">
              {/* Metadata */}
              <div className="flex flex-col gap-1 text-gray-300">
                {game.developers?.length > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-600">
                    <span className="font-semibold text-sm text-white">Developer</span>
                    <PersonTooltip items={game.developers} firstName={game.developers[0].name} />
                  </div>
                )}
                {game.publishers?.length > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-600">
                    <span className="font-semibold text-sm">Publisher</span>
                    <PersonTooltip items={game.publishers} firstName={game.publishers[0].name} />
                  </div>
                )}
                {game.released && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-600">
                    <span className="font-semibold text-sm">Release Date</span> 
                    <span className="text-sm">
                      {getReleaseLabel(game.released, game.tba)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Genres */}
            {game.genres?.length > 0 && (
              <div className="my-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-700 px-3 py-1 rounded text-sm text-white"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Platforms */}
            {game.parent_platforms?.length > 0 && (
              <div className="mb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Platforms</h2>
                <div className="flex flex-wrap gap-2">
                  {game.parent_platforms.map(({ platform }) => (
                    <span
                      key={platform.id}
                      className="bg-gray-700 px-3 py-1 rounded text-sm text-white"
                    >
                      {platform.name === 'Apple Macintosh' ? 'Mac' : platform.name}
                    </span>
                  ))}
                </div>
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
