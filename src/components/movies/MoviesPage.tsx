import {useState, useEffect} from 'react';

import {useAppSelector, useAppDispatch} from '@/hooks';
import {confirmAction} from '@/reducers/commonSlice';

import notificationHelper from '@/helpers/notificationHelper';

import movieServiceStubs from '@/services/movieServiceStubs';

import PageWrapper from '@/components/common/PageWrapper';
import Counter from '@/components/common/Counter';
import FilterBar from '@/components/common/FilterBar';
import CreateEntityDialog from '@/components/common/CreateEntityDialog';

import MovieList from './components/movie_list/MovieList';
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
  const [createMovieModalVisible, setCreateMovieModalVisible] = useState<boolean>(false);

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

  function closeCreateMovieModal() {
    setCreateMovieModalVisible(false);
  }

  function onCreateMovie(entity: Book | Movie) {
    const movie = entity as Movie;

    setMovieToEdit(movie);
    closeCreateMovieModal();
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

  function render() {
    const editMovieVisible = movieToEdit ? true : false;

    return (
      <PageWrapper>
        <FilterBar total={total} entity="movie" addNewEntityAction={() => setCreateMovieModalVisible(true)} />

        <Counter total={total} title="Movies" />

        <MovieList movies={movies} confirmDeleteMovie={confirmDeleteMovie} onEditMovie={onEditMovie} />

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

        {createMovieModalVisible && (
          <CreateEntityDialog
            visible={createMovieModalVisible}
            entity="movie"
            close={closeCreateMovieModal}
            action={onCreateMovie}
          />
        )}
      </PageWrapper>
    );
  }

  return render();
}

export default MoviesPage;
