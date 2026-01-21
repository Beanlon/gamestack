const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

/**
 * Search for games
 */
export async function searchGames(query, page = 1) {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page=${page}&page_size=12`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }
  
  return response.json();
}

/**
 * Get popular/trending games
 */
export async function getPopularGames(page = 1) {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=12&ordering=-rating`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch popular games');
  }
  
  return response.json();
}

/**
 * Get game details by ID
 */
export async function getGameDetails(id) {
  const response = await fetch(
    `${BASE_URL}/games/${id}?key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch game details');
  }
  
  return response.json();
}

/**
 * Get game screenshots by ID
 */
export async function getGameScreenshots(id) {
  const response = await fetch(
    `${BASE_URL}/games/${id}/screenshots?key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch game screenshots');
  }
  
  return response.json();
}

/**
 * Get game videos by ID
 */
export async function getGameVideos(id) {
  const response = await fetch(
    `${BASE_URL}/games/${id}/movies?key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch game videos');
  }
  
  return response.json();
}

/**
 * Get games by genre
 */
export async function getGamesByGenre(genreId, page = 1) {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&genres=${genreId}&page=${page}&page_size=12`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch games by genre');
  }
  
  return response.json();
}

export async function getAllGenres() {
  const response = await fetch(
    `${BASE_URL}/genres?key=${API_KEY}&page_size=40`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }
  
  return response.json();
}