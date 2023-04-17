import {useEffect, useState} from 'react';
import {Modal, Button} from '@/components/bootstrap';
import {isEmpty, upperFirst} from 'lodash';

import config from '@/config';

import bookService from '@/services/bookService';
import bookServiceStubs from '@/services/bookServiceStubs';
import bookMapper from '@/services/mappers/bookMapper';
import movieService from '@/services/movieService';
import movieServiceStubs from '@/services/movieServiceStubs';
import movieMapper from '@/services/mappers/movieMapper';
import gameService from '@/services/gameService';
import gameServiceStubs from '@/services/gameServiceStubs';
import gameMapper from '@/services/mappers/gameMapper';

import TextInput from '@/components/common/TextInput';
import Pagination from '@/components/common/Pagination';

import BookItem from './components/BookItem';
import MovieItem from './components/MovieItem';
import GameItem from './components/GameItem';

import * as styled from './CreateEntityDialog.styled';

interface Props {
  visible: boolean;
  entity: entityType;
  close: () => void;
  action: (entity: Book | Movie | Game) => void;
}

function CreateEntityDialog({visible, entity, close, action}: Props) {
  const [searchStr, setSearchStr] = useState<string>('');
  const [activePage, setActivePage] = useState<number>(1);

  const [searchResults, setSearchResults] = useState<GoogleBook[] | MovieTruncated[] | RawgGame[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [allEntities, setAllEntities] = useState<Book[] | Movie[] | Game[]>([]);

  useEffect(() => {
    async function fetchEntities() {
      let entities: Book[] | Movie[] | Game[] = [];

      switch (entity) {
        case 'book':
          entities = await bookServiceStubs.getAllBooks();
          break;

        case 'movie':
          entities = await movieServiceStubs.getAllMovies();
          break;

        case 'game':
          entities = await gameServiceStubs.getAllGames();
          break;
        default:
          break;
      }

      setAllEntities(entities);
    }

    fetchEntities();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchStr, activePage]);

  useEffect(() => {
    if (activePage === 1) return;
    setActivePage(1);
  }, [searchStr]);

  async function handleSearch() {
    if (searchStr.length < 3) {
      setSearchResults([]);
      return;
    }

    let results: any = [];
    let totalItems: number = 0;

    switch (entity) {
      case 'book':
        const searchBooksResponse = await bookService.searchBooks(searchStr, activePage);

        if (!searchBooksResponse || isEmpty(searchBooksResponse?.books)) {
          setSearchResults([]);
          return;
        }

        results = bookMapper.mapBooks(searchBooksResponse.books, allEntities as Book[]);
        totalItems = searchBooksResponse.total;
        break;

      case 'movie':
        const searchMoviesResponse = await movieService.searchMoviesByTitle(searchStr, activePage);

        if (!searchMoviesResponse || isEmpty(searchMoviesResponse?.movies)) {
          setSearchResults([]);
          return;
        }

        results = movieMapper.mapMovies(searchMoviesResponse.movies, allEntities as Movie[]);
        totalItems = searchMoviesResponse.total;
        break;

      case 'game':
        const searchGamesResponse = await gameService.searchGames(searchStr, activePage);

        if (!searchGamesResponse || isEmpty(searchGamesResponse?.games)) {
          setSearchResults([]);
          return;
        }

        results = gameMapper.mapGames(searchGamesResponse.games, allEntities as Game[]);
        totalItems = searchGamesResponse.total;
        break;

      default:
        break;
    }

    setSearchResults(results);
    setTotal(totalItems);
  }

  async function addCustomEntity() {
    let entityToAdd: any = undefined;

    switch (entity) {
      case 'book':
        entityToAdd = bookMapper.getDefaultCustomBook();
        break;

      case 'movie':
        entityToAdd = movieMapper.getDefaultCustomMovie();
        break;

      case 'game':
        entityToAdd = gameMapper.getDefaultCustomGame();
        break;
      default:
        break;
    }

    await action(entityToAdd);
  }

  function render() {
    const header = `Create ${upperFirst(entity)}`;

    const pageNumber = Math.ceil(total / config.pageSize);

    return (
      <Modal show={visible} onHide={close}>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You can search for a {entity} to import or create a new one.</p>
          <TextInput
            name="searchStr"
            label={`Search for a ${entity}`}
            value={searchStr}
            onChange={(field, value) => setSearchStr(value)}
            placeholder="Search"
          />

          {!isEmpty(searchResults) && (
            <styled.searchContainer>
              <styled.scrollableContainer>
                {searchResults.map(item => {
                  switch (entity) {
                    case 'book':
                      return <BookItem book={item} allBooks={allEntities as Book[]} action={action} />;
                    case 'movie':
                      return <MovieItem movie={item} allMovies={allEntities as Movie[]} action={action} />;
                    case 'game':
                      return <GameItem game={item} allGames={allEntities as Game[]} action={action} />;
                    default:
                      return null;
                  }
                })}
              </styled.scrollableContainer>

              <Pagination
                pageCount={pageNumber}
                activePage={activePage}
                onPageSelection={(page: number) => setActivePage(page)}
              />
            </styled.searchContainer>
          )}

          {searchStr.length >= 3 && isEmpty(searchResults) && <p>No results found.</p>}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={addCustomEntity}>Add Custom</Button>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return render();
}

export default CreateEntityDialog;
