import SORT_BY from '@/constants/sortBy';

import utils from '@/helpers/utils';
import storageHelper from '@/services/storageHelper';

const exports = {
  getGames,
  getAllGames,
  getGenres,
  getGameLists,
  saveGame,
  deleteGame
};

let jsondata: any = null;
async function getData() {
  if (!jsondata) {
    jsondata = await storageHelper.readData();
  }
  return jsondata;
}

async function saveData() {
  const data = await getData();
  if (!data) return;
  await storageHelper.saveData(data);
}

async function getGames(page: number, sortBy: string, searchStr: string, sortAsc: boolean, filterBy: number) {
  const mappedGames = await getAllGames();

  const games = searchGames(mappedGames, searchStr, filterBy);

  sortGames(games, sortBy, sortAsc);

  const result = utils.getItemsPerPage(games, page);

  return Promise.resolve({
    total: games.length,
    dataItems: result
  });
}

async function getAllGames(): Promise<Game[]> {
  const data = await getData();
  const games = data.games.items;

  return games;
}

async function getGenres() {
  const data = await getData();
  return data.games.genres.sort();
}

async function getGameLists() {
  const data = await getData();
  return data.games.lists;
}

function saveGame(game: Game) {
  if (game.id) return updateGame(game);

  return addGame(game);
}

async function updateGame(game: any) {
  const data = await getData();
  const games = data.games.items;

  for (let i = 0; i < games.length; i++) {
    if (games[i].id === game.id) {
      games[i] = game;
    }
  }

  return saveData();
}

async function addGame(game: any) {
  const data = await getData();
  const games = data.games.items;

  let maxId = 0;

  for (let i = 0; i < games.length; i++) {
    if (games[i].id > maxId) {
      maxId = games[i].id;
    }
  }

  game.id = maxId + 1;

  games.push(game);

  return saveData();
}

async function deleteGame(id: number) {
  const data = await getData();
  const games = data.games.items;

  for (let i = 0; i < games.length; i++) {
    if (games[i].id === id) {
      games.splice(i, 1);
    }
  }

  return saveData();
}

// helper methods

function searchGames(games: Game[], searchStr: string, filterBy: number) {
  if (filterBy) {
    games = games.filter((game: Game) => {
      return game?.lists?.includes(filterBy);
    });
  }

  if (!searchStr) return games;

  const textSearchFields: string[] = ['title', 'alternativeTitle', 'slug', 'developers', 'description'];

  return games.filter((game: any) => {
    for (const field of textSearchFields) {
      const gameField = game[field];
      if (!gameField) continue;

      if (utils.containsString(gameField, searchStr)) return true;
    }

    for (const genre of game.genres) {
      if (utils.containsString(genre, searchStr)) return true;
    }

    return false;
  });
}

function sortGames(games: Game[], sortBy: string, isAsc: boolean) {
  const dirNum = isAsc ? 1 : -1;

  if (sortBy === SORT_BY.TITLE) {
    games.sort((x, y) => x.title.localeCompare(y.title) * dirNum);
  }

  if (sortBy === SORT_BY.RELEASE_DATE) {
    games.sort((x: any, y: any) => (x.released - y.released) * dirNum);
  }

  if (sortBy === SORT_BY.RATING) {
    games.sort((x: any, y: any) => (x.rating - y.rating) * dirNum);
  }
}

export default exports;
