'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getGameDetails, getGameScreenshots, getGameVideos } from '@/lib/rawg';
import BottomNav from '@/components/bottomNav';
import Navbar from '@/components/navbar';


export default function GameDetailPage() {
  const params = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const esrbLabel = (name) => {
    const map = {
      'Everyone': 'Content is suitable for all ages. May contain minmal cartoon, fantasy or mild violcence',
      'Everyone 10+': 'Content for Ages 10 and up. May contain more cartoon, fantasy or mild violence, mild language and/ or minimal themes',
      'Teen': 'Content for Ages 13 and up. May contain violence, suggestive themes, crude humor, minimal blood and/ or infrequent use of strong language',
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
        className=" py-3 px-3 h-auto w-auto"
      />
    );
  };

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return `TBA`;
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric'}).format(date);
  }

  const truncateDescription = (text, length = 300) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  useEffect(() => {
    loadGameDetails();
  }, [params.id]);

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
        <main className="max-w-7xl min-h-screen mx-auto bg-gray-50 px-3 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-xl text-gray-500">Loading game details...</p>
        </main>
      </>
    );
  }

  if (!game) {
    return (
      <main className="max-w-7xl min-h-screen mx-auto bg-gray-50 px-3 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-xl text-gray-500">Game not found</p>
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
      <main className="max-w-7xl grid grid-cols-3 gap-6 min-h-screen mx-auto bg-gray-50 px-3 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="col-span-2">
          {/* Hero Image/Video */}
          <div className="relative h-96 rounded-lg overflow-hidden mb-4 shadow-lg bg-black">
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
          {screenshots.length > 1 && (
            <div className="flex items-center justify-center gap-3 mb-8">
              {/* Previous Arrow */}
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  prev === 0 ? screenshots.length - 1 : prev - 1
                )}
                className="flex-shrink-0 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {screenshots.map((screenshot, index) => (
                  <button
                    key={screenshot.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === index 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={screenshot.image}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  prev === screenshots.length - 1 ? 0 : prev + 1
                )}
                className="flex-shrink-0 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          <h1 className="text-3xl font-extrabold text-black mb-4">{game.name}</h1>
          {/* Description */}
          {game.description_raw && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">About</h2>
              <div className="relative">
                <p className={`text-gray-700 leading-relaxed text-justify ${!showFullDescription ? 'line-clamp-6' : ''}`}>
                  {game.description_raw}
                </p>
                {!showFullDescription && game.description_raw.length > 300 && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
                )}
              </div>
              {game.description_raw.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-blue-500 hover:text-blue-700 font-semibold transition"
                >
                  {showFullDescription ? 'See Less' : 'See More'}
                </button>
              )}
            </div>
          )}

          {/* Game Stats */}
          <div className="mb-8 bg-gray-100 rounded-lg p-4">
            <h2 className="text-2xl font-bold text-black mb-4">Game Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {game.rating && (
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-semibold mb-1">USER RATING</p>
                  <p className="text-2xl font-bold text-yellow-500">{game.rating.toFixed(1)}/5</p>
                </div>
              )}
              {game.metacritic && (
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-semibold mb-1">METACRITIC</p>
                  <p className="text-2xl font-bold text-blue-500">{game.metacritic}</p>
                </div>
              )}
              {game.playtime && (
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-semibold mb-1">AVG PLAYTIME</p>
                  <p className="text-2xl font-bold text-green-500">{game.playtime}h</p>
                </div>
              )}
              {game.reviews_count && (
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-semibold mb-1">REVIEWS</p>
                  <p className="text-2xl font-bold text-purple-500">{game.reviews_count}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-xl shadow-xl px-5 py-5 self-start">
          {/* Game Title */}
          <h1 className="text-3xl font-extrabold text-black mb-4">{game.name}</h1>
          <button className="bg-gray-900 w-full cursor-pointer py-2 text-white rounded-lg shadow-lg mt-2 mb-4">
            Add to Favorites
          </button>
          <div className="grid grid-cols-3 bg-white gap-2 rounded-lg border border-gray-200 self-start">
            <div className="col-span-1 ml-3 my-2 flex items-start justify-start">
              {renderEsrbIcon(game.esrb_rating?.name)}
            </div>
            <div className="col-span-2 mr-3 my-2">
              {game.esrb_rating && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-bold">
                    {game.esrb_rating.name}
                  </span>
                </div>
              )}
              <div className="pt-2">
                <p className="text-sm text-gray-700 text-justify">
                  {game.esrb_rating?.name ? esrbLabel(game.esrb_rating.name) : 'No rating available'}
                </p>
              </div>
            </div>
          </div>
          <div className="my-3 ">
            {/* Metadata */}
            <div className="flex flex-col gap-1 text-gray-700">
              {game.developers?.length > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="font-semibold text-sm">Developers</span>
                  {game.developers.map((dev) => (
                    <span className="text-sm"key={dev.id}>
                      {dev.name}
                    </span>
                  ))}
                </div>
              )}
              {game.publishers?.length > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="font-semibold text-sm">Publisher</span>
                  <span className="text-sm">
                    {game.publishers[0].name}
                  </span>
                </div>
              )}
              {game.released && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-sm">Released</span> 
                  <span className="text-sm">
                    {formatReleaseDate(game.released)}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Genres */}
          {game.genres?.length > 0 && (
            <div className="my-4">
              <h2 className="text-2xl font-bold text-black mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-200 px-3 py-1 rounded text-sm"
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
              <h2 className="text-2xl font-bold text-black mb-2">Platforms</h2>
              <div className="flex flex-wrap gap-2">
                {game.parent_platforms.map(({ platform }) => (
                  <span
                    key={platform.id}
                    className="bg-gray-100 px-3 py-1 rounded text-sm"
                  >
                    {platform.name === 'Apple Macintosh' ? 'Mac' : platform.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}