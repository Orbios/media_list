import {useState, useEffect} from 'react';

import {useAppSelector, useAppDispatch} from '@/hooks';
import {confirmAction, createEntityAction} from '@/reducers/commonSlice';

import notificationHelper from '@/helpers/notificationHelper';

import movieServiceStubs from '@/services/movieServiceStubs';

import PageWrapper from '@/components/common/PageWrapper';
import Counter from '@/components/common/Counter';
import FilterBar from '@/components/common/FilterBar';

import MovieList from './components/MovieList';
import EditMovie from './components/EditMovie';

function MoviesPage() {
  const dispatch = useAppDispatch();

  const activePage = useAppSelector(state => state.filter.activePage);
  const searchStr = useAppSelector(state => state.filter.searchStr);
  const sortAsc = useAppSelector(state => state.filter.sortAsc);
  const sortBy = useAppSelector(state => state.filter.sortBy);
  const filterBy = useAppSelector(state => state.filter.filterBy);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [movieLists, setMovieLists] = useState<List[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);

  useEffect(() => {
    loadGenres();
    loadMovieLists();
    loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, activePage, searchStr, sortAsc, filterBy]);

  async function loadGenres() {
    const genresList = await movieServiceStubs.getGenres();
    setGenres(genresList);
  }

  async function loadMovieLists() {
    const lists = await movieServiceStubs.getMovieLists();
    setMovieLists(lists);
  }

  async function loadMovies() {
    const response = await movieServiceStubs.getMovies(activePage, sortBy, searchStr, sortAsc, filterBy);

    setMovies(response.dataItems);
    setTotal(response.total);
  }

  async function confirmDeleteMovie(id: number) {
    await dispatch(
      confirmAction({
        title: 'Delete movie',
        action: () => deleteMovie(id)
      })
    );
  }

  async function deleteMovie(id: number) {
    if (!id) return;

    await movieServiceStubs.deleteMovie(id);

    notificationHelper.message('Movie was deleted');

    await loadMovies();
  }

  async function addNewMovieAction() {
    await dispatch(
      createEntityAction({
        entity: 'movie',
        action: entity => onCreateMovie(entity)
      })
    );
  }

  function onCreateMovie(entity: Book | Movie | Game) {
    const movie = entity as Movie;

    setMovieToEdit(movie);
  }

  function updateMovieState(field: string, value: any) {
    if (!movieToEdit) return;
    setMovieToEdit({...movieToEdit, [field]: value});
  }

  function onEditMovie(movie: Movie) {
    setMovieToEdit(movie);
  }

  async function saveMovie() {
    if (!movieToEdit) return;

    await movieServiceStubs.saveMovie(movieToEdit);

    notificationHelper.message('Movie was saved');

    await loadMovies();

    cancelEditMovie();
  }

  function cancelEditMovie() {
    setMovieToEdit(null);
  }

  async function updateMoviePoster(movieId: number, posterUrl: string) {
    if (!movieId) return;

    await movieServiceStubs.updateMoviePoster(movieId, posterUrl);

    notificationHelper.message('Movie poster was updated');

    await loadMovies();
  }

  function render() {
    const editMovieVisible = movieToEdit ? true : false;

    return (
      <PageWrapper>
        <FilterBar total={total} entity="movie" addNewEntityAction={addNewMovieAction} />

        <Counter total={total} title="Movies" />

        <MovieList
          movies={movies}
          confirmDeleteMovie={confirmDeleteMovie}
          onEditMovie={onEditMovie}
          onUpdatePoster={updateMoviePoster}
        />

        {editMovieVisible && movieToEdit && (
          <EditMovie
            visible={editMovieVisible}
            genres={genres}
            movie={movieToEdit}
            lists={movieLists}
            onChange={updateMovieState}
            close={cancelEditMovie}
            save={saveMovie}
          />
        )}
      </PageWrapper>
    );
  }

  return render();
}

export default MoviesPage;
