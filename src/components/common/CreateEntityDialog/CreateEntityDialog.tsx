import {useEffect, useState} from 'react';
import {Modal, Button} from '@/components/bootstrap';
import {isEmpty, find} from 'lodash';

import config from '@/config';

import bookService from '@/services/bookService';
import bookServiceStubs from '@/services/bookServiceStubs';
import bookMapper from '@/services/mappers/bookMapper';
import movieService from '@/services/movieService';
import movieServiceStubs from '@/services/movieServiceStubs';
import movieMapper from '@/services/mappers/movieMapper';

import TextInput from '@/components/common/TextInput';
import Pagination from '@/components/common/Pagination';

import BookItem from './components/BookItem';
import MovieItem from './components/MovieItem';

import * as styled from './CreateEntityDialog.styled';

interface Props {
  visible: boolean;
  entity: entityType;
  close: () => void;
  action: (entity: Book | Movie) => void;
}

function CreateEntityDialog({visible, entity, close, action}: Props) {
  const [searchStr, setSearchStr] = useState<string>('');
  const [activePage, setActivePage] = useState<number>(1);

  const [searchResults, setSearchResults] = useState<GoogleBook[] | MovieTruncated[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [allEntities, setAllEntities] = useState<Book[] | Movie[]>([]);

  const isBook = entity === 'book';

  useEffect(() => {
    async function fetchEntities() {
      const entities: Book[] | Movie[] = isBook
        ? await bookServiceStubs.getAllBooks()
        : await movieServiceStubs.getAllMovies();

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

    if (isBook) {
      const searchBooksResponse = await bookService.searchBooks(searchStr, activePage);

      if (!searchBooksResponse || isEmpty(searchBooksResponse?.books)) {
        setSearchResults([]);
        return;
      }

      const mappedBooks = bookMapper.mapBooks(searchBooksResponse.books, allEntities as Book[]);

      setSearchResults(mappedBooks);
      setTotal(searchBooksResponse.total);
    } else {
      const searchMoviesResponse = await movieService.searchMoviesByTitle(searchStr, activePage);

      if (!searchMoviesResponse || isEmpty(searchMoviesResponse?.movies)) {
        setSearchResults([]);
        return;
      }

      const mappedMovies = movieMapper.mapMovies(searchMoviesResponse.movies, allEntities as Movie[]);

      setSearchResults(mappedMovies);
      setTotal(searchMoviesResponse.total);
    }
  }

  async function addCustomEntity() {
    const entityToAdd = isBook ? bookMapper.getDefaultCustomBook() : movieMapper.getDefaultCustomMovie();
    await action(entityToAdd);
  }

  function render() {
    const header = isBook ? 'Create Book' : 'Create Movie';

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
                  return isBook ? (
                    <BookItem book={item} allBooks={allEntities as Book[]} action={action} />
                  ) : (
                    <MovieItem movie={item} allMovies={allEntities as Movie[]} action={action} />
                  );
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
