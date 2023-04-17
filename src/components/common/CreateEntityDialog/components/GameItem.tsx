import {Button} from '@/components/bootstrap';
import {RiEditLine} from 'react-icons/ri';
import {FaPlus} from 'react-icons/fa';

import gameService from '@/services/gameService';

import ImageRender from '@/components/common/ImageRender';

import * as styled from '../CreateEntityDialog.styled';

interface Props {
  game: RawgGame;
  allGames: Game[];
  action: (game: Game) => void;
}

function GameItem({game, allGames, action}: Props) {
  async function createGame(rawgId: number) {
    const game: Game | undefined = await gameService.getDetailsOfTheGame(rawgId);

    if (!game) return;

    await action(game);
  }

  async function editGame(gameId?: number) {
    if (!gameId) return;

    const movieToEdit = allGames.find(m => m.id === gameId);

    if (!movieToEdit) return;

    await action(movieToEdit);
  }

  return (
    <styled.entityItem key={game.rawgId}>
      <ImageRender title={game.name} url={game.background_image} />

      <styled.entityContent>
        <div>
          <h5>{game.name}</h5>
          <p>
            {game.released} | {game.genres.map(genre => genre.name).join(', ')}
          </p>
        </div>

        <div>
          {game.id ? (
            <Button variant="outline-secondary" size="sm" onClick={() => editGame(game.id)}>
              <RiEditLine />
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={() => createGame(game.rawgId)}>
              <FaPlus />
            </Button>
          )}
        </div>
      </styled.entityContent>
    </styled.entityItem>
  );
}

export default GameItem;
