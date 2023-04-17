import {isEmpty} from 'lodash';
import {RiDeleteBinLine, RiEditLine} from 'react-icons/ri';

import notificationHelper from '@/helpers/notificationHelper';

import ImageRender from '@/components/common/ImageRender';
import DescriptionTruncated from '@/components/common/DescriptionTruncated';

import * as styled from '@/styles/list.styled';

interface Props {
  games: Game[];
  onEditGame: (game: Game) => void;
  confirmDeleteGame: (id: number) => void;
}

function GameList({games, onEditGame, confirmDeleteGame}: Props) {
  const anyGames = !isEmpty(games);

  if (!anyGames) return <styled.noItems>No games.</styled.noItems>;

  function updateGame(game: Game) {
    onEditGame(game);
  }

  function openLink(website: string) {
    if (!website) {
      notificationHelper.error('Website is not defined');
      return;
    }

    window.open(website, '_blank');
  }

  function renderGame(game: Game) {
    return (
      <styled.itemRow key={game.id}>
        <styled.imageContainer>
          <ImageRender url={game.posterUrl} title={game.title} />
        </styled.imageContainer>

        <styled.itemContent>
          <styled.itemHeader>
            <styled.actionLink variant="link" onClick={() => openLink(game.website)}>
              {game.title} {game.alternativeTitle && <span> ({game.alternativeTitle})</span>}
            </styled.actionLink>
            <styled.actionButton variant="outline-secondary" size="sm" onClick={() => confirmDeleteGame(game.id)}>
              <RiDeleteBinLine />
            </styled.actionButton>
            <styled.actionButton variant="outline-secondary" size="sm" onClick={() => updateGame(game)}>
              <RiEditLine />
            </styled.actionButton>
          </styled.itemHeader>

          <styled.itemInfo>
            {game.released}
            <span>{game.genres.join(', ')}</span>
            {game.rating && game.ratingTop && (
              <span>
                Rating: <b>{game.rating}</b> from {game.ratingTop}
              </span>
            )}
          </styled.itemInfo>

          <styled.contributors>{game.developers}</styled.contributors>

          <DescriptionTruncated text={game.description} />
        </styled.itemContent>
      </styled.itemRow>
    );
  }

  function render() {
    return <styled.listContainer>{games.map(game => renderGame(game))}</styled.listContainer>;
  }

  return render();
}

export default GameList;
