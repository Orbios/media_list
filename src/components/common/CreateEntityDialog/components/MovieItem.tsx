import {Button} from '@/components/bootstrap';
import {RiEditLine} from 'react-icons/ri';
import {FaPlus} from 'react-icons/fa';

import movieService from '@/services/movieService';

import ImageRender from '@/components/common/ImageRender';

import * as styled from '../CreateEntityDialog.styled';

interface Props {
  movie: MovieTruncated;
  allMovies: Movie[];
  action: (movie: Movie) => void;
}

function MovieItem({movie, allMovies, action}: Props) {
  async function createMovie(imdbID: string) {
    const movie: Movie | undefined = await movieService.getMovieByIMDBId(imdbID);

    if (!movie) return;

    await action(movie);
  }

  async function editMovie(movieId?: number) {
    if (!movieId) return;

    const movieToEdit = allMovies.find(m => m.id === movieId);

    if (!movieToEdit) return;

    await action(movieToEdit);
  }

  return (
    <styled.entityItem key={movie.imdbID}>
      <ImageRender title={movie.title} url={movie.poster} />

      <styled.entityContent>
        <div>
          <h5>{movie.title}</h5>
          <p>
            {movie.year} | {movie.type}
          </p>
        </div>

        <div>
          {movie.id ? (
            <Button variant="outline-secondary" size="sm" onClick={() => editMovie(movie.id)}>
              <RiEditLine />
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={() => createMovie(movie.imdbID)}>
              <FaPlus />
            </Button>
          )}
        </div>
      </styled.entityContent>
    </styled.entityItem>
  );
}

export default MovieItem;
