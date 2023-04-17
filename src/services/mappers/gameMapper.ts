import {find} from 'lodash';

const exports = {
  getDefaultCustomGame,
  mapGames
};

function getDefaultCustomGame(): Game {
  const customGame: Game = {
    id: 0,
    rawgId: 0,
    title: '',
    slug: '',
    description: '',
    website: '',
    released: 2023,
    developers: '',
    genres: [],
    posterUrl: '',
    lists: []
  };

  return customGame;
}

function mapGames(games: RawgGame[], allGames: Game[]): RawgGame[] {
  const mappedGames = games.map(rawgGame => {
    const gameInDb: Game | undefined = find(
      allGames,
      (game: Game) => game.rawgId === rawgGame.rawgId || (game.title === rawgGame.name && game.slug === rawgGame.slug)
    );

    if (gameInDb) rawgGame.id = gameInDb.id;

    return rawgGame;
  });

  return mappedGames;
}

export default exports;
