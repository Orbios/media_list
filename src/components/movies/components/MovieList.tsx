import {isEmpty, isNaN} from 'lodash';
import {RiDeleteBinLine, RiEditLine} from 'react-icons/ri';

import notificationHelper from '@/helpers/notificationHelper';

import ImageRender from '@/components/common/ImageRender';
import DescriptionTruncated from '@/components/common/DescriptionTruncated';

import * as styled from '@/styles/list.styled';

interface Props {
  movies: Movie[];
  onEditMovie: (movie: Movie) => void;
  confirmDeleteMovie: (id: number) => void;
}

function MovieList({movies, onEditMovie, confirmDeleteMovie}: Props) {
  const anyMovies = !isEmpty(movies);

  if (!anyMovies) return <styled.noItems>No movies.</styled.noItems>;

  function updateMovie(movie: Movie) {
    onEditMovie(movie);
  }

  function openLink(imdbID: string) {
    if (!imdbID) {
      notificationHelper.error('IMDB ID is not defined');
      return;
    }

    const url = `https://www.imdb.com/title/${imdbID}`;

    window.open(url, '_blank');
  }

  function renderMovie(movie: Movie) {
    const displayRuntime = isNaN(movie.runtime) ? 'N/A' : `${movie.runtime} min.`;

    return (
      <styled.itemRow key={movie.id}>
        <styled.imageContainer>
          <ImageRender url={movie.posterUrl} title={movie.title} />
        </styled.imageContainer>

        <styled.itemContent>
          <styled.itemHeader>
            <styled.actionLink variant="link" onClick={() => openLink(movie.imdbID)}>
              {movie.title}
            </styled.actionLink>
            <styled.actionButton variant="outline-secondary" size="sm" onClick={() => confirmDeleteMovie(movie.id)}>
              <RiDeleteBinLine />
            </styled.actionButton>
            <styled.actionButton variant="outline-secondary" size="sm" onClick={() => updateMovie(movie)}>
              <RiEditLine />
            </styled.actionButton>
          </styled.itemHeader>

          <styled.itemInfo>
            {movie.year}
            <span>{displayRuntime}</span>
            <span>{movie.genres.join(', ')}</span>
          </styled.itemInfo>

          <styled.contributors>
            {movie.director}
            <span>{movie.actors}</span>
          </styled.contributors>

          <DescriptionTruncated text={movie.plot} />
        </styled.itemContent>
      </styled.itemRow>
    );
  }

  function render() {
    return <styled.listContainer>{movies.map(movie => renderMovie(movie))}</styled.listContainer>;
  }

  return render();
}

export default MovieList;
