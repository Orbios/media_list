import {useState, useEffect} from 'react';

import {useAppSelector, useAppDispatch} from '@/hooks';
import {createEntityAction, confirmAction} from '@/reducers/commonSlice';

import notificationHelper from '@/helpers/notificationHelper';

import gameServiceStubs from '@/services/gameServiceStubs';

import PageWrapper from '@/components/common/PageWrapper';
import Counter from '@/components/common/Counter';
import FilterBar from '@/components/common/FilterBar';

import GameList from './components/GameList';
import EditGame from './components/EditGame';

function GamesPage() {
  const dispatch = useAppDispatch();

  const activePage = useAppSelector(state => state.filter.activePage);
  const searchStr = useAppSelector(state => state.filter.searchStr);
  const sortAsc = useAppSelector(state => state.filter.sortAsc);
  const sortBy = useAppSelector(state => state.filter.sortBy);
  const filterBy = useAppSelector(state => state.filter.filterBy);

  const [games, setGames] = useState<Game[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [genres, setGenres] = useState<string[]>([]);
  const [gameLists, setGameLists] = useState<List[]>([]);

  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);

  useEffect(() => {
    loadGenres();
    loadGameLists();
    loadGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, activePage, searchStr, sortAsc, filterBy]);

  async function loadGenres() {
    const genresList = await gameServiceStubs.getGenres();
    setGenres(genresList);
  }

  async function loadGameLists() {
    const lists = await gameServiceStubs.getGameLists();
    setGameLists(lists);
  }

  async function loadGames() {
    const response = await gameServiceStubs.getGames(activePage, sortBy, searchStr, sortAsc, filterBy);

    setGames(response.dataItems);
    setTotal(response.total);
  }

  async function addNewGameAction() {
    await dispatch(
      createEntityAction({
        entity: 'game',
        action: entity => onCreateGame(entity)
      })
    );
  }

  function onCreateGame(entity: Book | Movie | Game) {
    const game = entity as Game;

    setGameToEdit(game);
  }

  function updateGameState(field: string, value: any) {
    if (!gameToEdit) return;
    setGameToEdit({...gameToEdit, [field]: value});
  }

  function onEditGame(game: Game) {
    setGameToEdit(game);
  }

  async function saveGame() {
    if (!gameToEdit) return;

    await gameServiceStubs.saveGame(gameToEdit);

    notificationHelper.message('Game was saved');

    await loadGames();

    cancelEditGame();
  }

  function cancelEditGame() {
    setGameToEdit(null);
  }

  async function confirmDeleteGame(id: number) {
    await dispatch(
      confirmAction({
        title: 'Delete game',
        action: () => deleteGame(id)
      })
    );
  }

  async function deleteGame(id: number) {
    if (!id) return;

    await gameServiceStubs.deleteGame(id);

    notificationHelper.message('Game was deleted');

    await loadGames();
  }

  async function updateGamePoster(gameId: number, posterUrl: string) {
    if (!gameId) return;

    await gameServiceStubs.updateGamePoster(gameId, posterUrl);

    notificationHelper.message('Game poster was updated');

    await loadGames();
  }

  function render() {
    const editGameVisible = gameToEdit ? true : false;

    return (
      <PageWrapper>
        <FilterBar total={total} entity="game" addNewEntityAction={addNewGameAction} />

        <Counter total={total} title="Games" />

        <GameList
          games={games}
          confirmDeleteGame={confirmDeleteGame}
          onEditGame={onEditGame}
          onUpdatePoster={updateGamePoster}
        />

        {editGameVisible && gameToEdit && (
          <EditGame
            visible={editGameVisible}
            genres={genres}
            game={gameToEdit}
            lists={gameLists}
            onChange={updateGameState}
            close={cancelEditGame}
            save={saveGame}
          />
        )}
      </PageWrapper>
    );
  }

  return render();
}

export default GamesPage;
