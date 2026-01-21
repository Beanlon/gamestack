import Link from 'next/link';
import EpicLogo from '@/images/Epic-Games-Logo--Streamline-Logos.svg';
import GogLogo from '@/images/Gog-Com-Logo--Streamline-Logos (1).svg';

export const platformIcons = {
  pc: (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor">
      <path d="M0 13.772l6.545.902V8.426H0zm0-6.152h6.545V1.296L0 2.198zm7.265 7.15l8.704 1.2V8.425H7.265zm0-13.57v6.42h8.704V0z" />
    </svg>
  ),
  playstation: (
    <svg viewBox="0 0 21 16" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor">
      <path d="M11.112 16L8 14.654V0s6.764 1.147 7.695 3.987c.931 2.842-.52 4.682-1.03 4.736-1.42.15-1.96-.748-1.96-.748V3.39l-1.544-.648L11.112 16zM12 14.32V16s7.666-2.338 8.794-3.24c1.128-.9-2.641-3.142-4.666-2.704 0 0-2.152.099-4.102.901-.019.008 0 1.51 0 1.51l4.948-1.095 1.743.73L12 14.32zm-5.024-.773s-.942.476-3.041.452c-2.1-.024-3.959-.595-3.935-1.833C.024 10.928 3.476 9.571 6.952 9v1.738l-3.693.952s-.632.786.217.81A11.934 11.934 0 007 12.046l-.024 1.5z" />
    </svg>
  ),
  xbox: (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor">
      <path d="M3.564 1.357l-.022.02c.046-.048.11-.1.154-.128C4.948.435 6.396 0 8 0c1.502 0 2.908.415 4.11 1.136.086.052.324.215.446.363C11.4.222 7.993 2.962 7.993 2.962c-1.177-.908-2.26-1.526-3.067-1.746-.674-.185-1.14-.03-1.362.141zm10.305 1.208c-.035-.04-.074-.076-.109-.116-.293-.322-.653-.4-.978-.378-.295.092-1.66.584-3.342 2.172 0 0 1.894 1.841 3.053 3.723 1.159 1.883 1.852 3.362 1.426 5.415A7.969 7.969 0 0016 7.999a7.968 7.968 0 00-2.13-5.434zM10.98 8.77a55.416 55.416 0 00-2.287-2.405 52.84 52.84 0 00-.7-.686l-.848.854c-.614.62-1.411 1.43-1.853 1.902-.787.84-3.043 3.479-3.17 4.958 0 0-.502-1.174.6-3.88.72-1.769 2.893-4.425 3.801-5.29 0 0-.83-.913-1.87-1.544l-.007-.002s-.011-.009-.03-.02c-.5-.3-1.047-.53-1.573-.56a1.391 1.391 0 00-.878.431A8 8 0 0013.92 13.381c0-.002-.169-1.056-1.245-2.57-.253-.354-1.178-1.46-1.696-2.04z" />
    </svg>
  ),
  nintendo: (
    <svg viewBox="0 0 21 16" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor">
      <path fillRule="evenodd" d="M8 0h5a8 8 0 110 16H8A8 8 0 118 0zm-.135 1.935a6.065 6.065 0 000 12.13h5.12a6.065 6.065 0 000-12.13h-5.12zm-1.33 2.304h2.401l3.199 5.175V4.24h2.346v7.495H12.18L8.864 6.537v5.201H6.53l.005-7.499z" />
    </svg>
  ),
  ios: (
    <svg viewBox="0 0 15 18" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor">
      <path d="M10.869 0h.127c.102 1.26-.379 2.202-.963 2.884-.574.677-1.359 1.334-2.629 1.234-.084-1.242.397-2.114.98-2.794C8.927.69 9.919.126 10.87 0zm3.756 13.196v.036a10.534 10.534 0 01-1.494 2.899c-.57.789-1.267 1.85-2.513 1.85-1.077 0-1.792-.696-2.896-.715-1.167-.02-1.81.583-2.877.734h-.364c-.783-.114-1.416-.74-1.877-1.302A11.452 11.452 0 010 10.134v-.808c.083-1.969 1.033-3.57 2.295-4.345.667-.413 1.583-.764 2.603-.607.437.068.884.219 1.275.368.371.144.835.398 1.275.385.298-.009.594-.165.894-.275.88-.32 1.74-.687 2.877-.514 1.365.207 2.334.818 2.933 1.76-1.155.74-2.068 1.855-1.912 3.76.138 1.73 1.137 2.742 2.385 3.338z" />
    </svg>
  ),
  mac: (
    <svg viewBox="0 0 15 18" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor">
      <path d="M10.869 0h.127c.102 1.26-.379 2.202-.963 2.884-.574.677-1.359 1.334-2.629 1.234-.084-1.242.397-2.114.98-2.794C8.927.69 9.919.126 10.87 0zm3.756 13.196v.036a10.534 10.534 0 01-1.494 2.899c-.57.789-1.267 1.85-2.513 1.85-1.077 0-1.792-.696-2.896-.715-1.167-.02-1.81.583-2.877.734h-.364c-.783-.114-1.416-.74-1.877-1.302A11.452 11.452 0 010 10.134v-.808c.083-1.969 1.033-3.57 2.295-4.345.667-.413 1.583-.764 2.603-.607.437.068.884.219 1.275.368.371.144.835.398 1.275.385.298-.009.594-.165.894-.275.88-.32 1.74-.687 2.877-.514 1.365.207 2.334.818 2.933 1.76-1.155.74-2.068 1.855-1.912 3.76.138 1.73 1.137 2.742 2.385 3.338z" />
    </svg>
  ),
  steam: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012zm8.397-11.528c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
    </svg>
  ),
  epic: (
    <img src={EpicLogo.src || EpicLogo} alt="Epic Games" className="w-4 h-4" />
  ),
  gog: (
    <img src={GogLogo.src || GogLogo} alt="GOG" className="w-4 h-4" />
  ),
};

export const normalizePlatform = (slug = '') => {
  const lower = slug.toLowerCase();
  if (lower.startsWith('playstation')) return 'playstation';
  if (lower.startsWith('xbox')) return 'xbox';
  if (lower.startsWith('nintendo')) return 'nintendo';
  if (lower === 'mac' || lower === 'macos') return 'mac';
  if (lower === 'ios' || lower === 'iphone' || lower === 'ipad') return 'ios';
  if (lower === 'linux' || lower === 'pc') return 'pc';
  if (lower === 'steam') return 'steam';
  if (lower === 'epic' || lower.includes('epic')) return 'epic';
  if (lower === 'gog') return 'gog';
  return lower;
};

export const iconForPlatform = (slug) => platformIcons[normalizePlatform(slug)] ?? null;

export default function GameCard({ game }) {
  return (
    <Link href={`/game/${game.id}`}>
      <div className="h-full rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-white">
        {/* Game Image */}
        <div className="relative h-48 bg-gray-200">
          {game.background_image ?  (
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="p-4 flex-1 flex flex-col">
          {Array.isArray(game.platforms) && game.platforms.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mb-1">
              {Array.from(new Set(game.platforms.slice(0, 6).map(({ platform }) => normalizePlatform(platform?.slug))))
                .slice(0, 6)
                .map((normalizedSlug, index) => {
                  const platform = game.platforms.find(({ platform: p }) => normalizePlatform(p?.slug) === normalizedSlug)?.platform;
                  return (
                    <span
                      key={`${game.id}-${normalizedSlug}-${index}`}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-gray-700"
                      title={platform?.name}
                      aria-label={platform?.name}
                    >
                      {iconForPlatform(normalizedSlug)}
                    </span>
                  );
                })}
            </div> 
          )}

          <h3 className="font-bold text-black text-xl mb-2 leading-tight break-words">{game.name}</h3>
          

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-2">
            {game.genres?.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="text-black text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {genre.name}
              </span>
            ))}
          </div>

        </div>
      </div>
    </Link>
  );
}