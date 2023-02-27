import {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import {isEmpty} from 'lodash';

import {useAppSelector, useAppDispatch} from '@/hooks';
import {togglePreferencesVisibility} from '@/reducers/commonSlice';

import SORT_BY from '@/constants/sortBy';
import FILTER_BY from '@/constants/filterBy';

import notificationHelper from '@/helpers/notificationHelper';

import movieService from '@/services/movieServiceStubs';

import Confirm from '@/components/common/Confirm';
import Preferences from '@/components/common/Preferences';

import FilterBar from './filter_bar/FilterBar';
import MovieList from './movie_list/MovieList';
import EditMovie from './edit_movie/EditMovie';
import CreateMovie from './edit_movie/CreateMovie';

import * as styled from './App.styled';

function App() {
  const dispatch = useAppDispatch();

  const preferencesVisible = useAppSelector(state => state.common.preferencesVisible);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [movieLists, setMovieLists] = useState<List[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [movieToDeleteId, setMovieToDeleteId] = useState<number | null>(null);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [createMovieModalVisible, setCreateMovieModalVisible] = useState<boolean>(false);

  const [activePage, setActivePage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>(SORT_BY.TITLE);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [searchStr, setSearchStr] = useState<string>('');
  const [filterBy, setFilterBy] = useState<number>(FILTER_BY.WATCHED);

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
    const genresList = await movieService.getGenres();
    setGenres(genresList);
  }

  async function loadMovieLists() {
    const lists = await movieService.getMovieLists();
    setMovieLists(lists);
  }

  async function loadMovies() {
    const response = await movieService.getMovies(activePage, sortBy, searchStr, sortAsc, filterBy);

    setMovies(response.dataItems);
    setTotal(response.total);
  }

  function sortByAction(key: string) {
    setSortBy(key);
    setActivePage(1);
  }

  function filterByAction(key: number) {
    setFilterBy(key);
    setActivePage(1);
  }

  function sortByDirection() {
    setSortAsc(direction => !direction);
    setActivePage(1);
  }

  function onSearch(searchString: string) {
    setSearchStr(searchString);
    setActivePage(1);
  }

  function onReset() {
    setSearchStr('');
    setActivePage(1);
    setSortBy(SORT_BY.TITLE);
  }

  function onPageSelection(page: number) {
    setActivePage(page);
  }

  function confirmDeleteMovie(id: number) {
    setMovieToDeleteId(id);
  }

  async function deleteMovie() {
    if (!movieToDeleteId) return;

    await movieService.deleteMovie(movieToDeleteId);

    notificationHelper.message('Movie was deleted');

    await loadMovies();

    cancelDeleteMovie();
  }

  function cancelDeleteMovie() {
    setMovieToDeleteId(null);
  }

  function closeCreateMovieModal() {
    setCreateMovieModalVisible(false);
  }

  function onCreateMovie(movie: Movie) {
    setMovieToEdit(movie);
    closeCreateMovieModal();
  }

  function updateMovieState(field: string, value: any) {
    if (!movieToEdit) return;
    console.log(value);
    setMovieToEdit({...movieToEdit, [field]: value});
  }

  function onEditMovie(movie: Movie) {
    setMovieToEdit(movie);
  }

  async function saveMovie() {
    if (!movieToEdit) return;

    await movieService.saveMovie(movieToEdit);

    notificationHelper.message('Movie was saved');

    await loadMovies();

    cancelEditMovie();
  }

  function cancelEditMovie() {
    setMovieToEdit(null);
  }

  function closePreferencesModal() {
    dispatch(togglePreferencesVisibility());
  }

  function renderMoviesCounter() {
    return <div>Movies count: {total}</div>;
  }

  function render() {
    const anyMovies = !isEmpty(movies);

    const deleteConfirmVisible = movieToDeleteId ? true : false;
    const editMovieVisible = movieToEdit ? true : false;

    return (
      <styled.wrapper>
        <Container>
          <FilterBar
            total={total}
            activePage={activePage}
            sortBy={sortBy}
            sortAsc={sortAsc}
            searchStr={searchStr}
            sortByAction={sortByAction}
            sortByDirection={sortByDirection}
            filterBy={filterBy}
            filterByAction={filterByAction}
            onSearch={onSearch}
            onReset={onReset}
            onPageSelection={onPageSelection}
            onAddMovie={() => setCreateMovieModalVisible(true)}
          />

          {anyMovies && renderMoviesCounter()}

          <MovieList movies={movies} confirmDeleteMovie={confirmDeleteMovie} onEditMovie={onEditMovie} />

          {deleteConfirmVisible && (
            <Confirm visible={deleteConfirmVisible} action={deleteMovie} close={cancelDeleteMovie} />
          )}

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
            <CreateMovie visible={createMovieModalVisible} close={closeCreateMovieModal} action={onCreateMovie} />
          )}
        </Container>

        {preferencesVisible && <Preferences visible={preferencesVisible} close={closePreferencesModal} />}
      </styled.wrapper>
    );
  }

  return render();
}

export default App;
