import axios from 'axios';

import config from '@/config';
import notificationHelper from '@/helpers/notificationHelper';
import formatHelper from '@/helpers/formatHelper';

const exports = {
  searchGames,
  getListOfAllGenres,
  getDetailsOfTheGame
};

async function searchGames(
  searchStr: string,
  activePage: number
): Promise<{total: number; games: RawgGame[]} | undefined> {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?search=${searchStr}&page=${activePage}&page_size=${config.pageSize}&key=${config.rawg.apiKey}`
    );

    const games: RawgGame[] = response.data.results?.map((game: any) => {
      return {
        ...game,
        rawgId: game.id,
        id: undefined
      };
    });

    return {
      games,
      total: response.data.count
    };
  } catch (err) {
    console.log(err);
    notificationHelper.error('Error while searching games!');
  }
}

async function getListOfAllGenres() {
  try {
    const response = await axios.get(`https://api.rawg.io/api/genres?key=${config.rawg.apiKey}`);

    const genres = response.data.results.map(item => item.name).sort();

    return genres;
  } catch (err) {
    console.log(err);
    notificationHelper.error('Error while getting genres list!');
  }
}

async function getDetailsOfTheGame(rawgId: number): Promise<Game | undefined> {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${rawgId}?key=${config.rawg.apiKey}`);

    const game: Game = getResultItem(response.data);

    return game;
  } catch (err) {
    console.log(err);
    notificationHelper.error('Error while searching games!');
  }
}

//helper methods

function getResultItem(data) {
  const game: Game = {
    id: 0,
    rawgId: data.id,
    title: data.name,
    alternativeTitle: data.name_original,
    slug: data.slug,
    description: data.description_raw || data.description,
    website: data.website,
    released: formatHelper.getYearFromDate(data.released),
    genres: data.genres.map(genre => genre.name).sort(),
    developers: data.developers.map(developer => developer.name).join(', '),
    posterUrl: data.background_image,
    lists: [1]
  };

  return game;
}

export default exports;
