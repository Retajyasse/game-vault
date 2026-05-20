const BASE_URL = 'https://api.allorigins.win/raw?url=https://www.freetogame.com/api';

export const fetchAllGames = async () => {
  try {
    const response = await fetch(`${BASE_URL}/games`);
    return await response.json();
  } catch (error) {
    console.error("API Error: ", error);
    return [];
  }
};