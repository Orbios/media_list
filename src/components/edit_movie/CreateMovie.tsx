import {useEffect, useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import styled from 'styled-components';
import {isEmpty} from 'lodash';
import {RiEditLine} from 'react-icons/ri';
import {FaPlus} from 'react-icons/fa';

import importService from '@/services/importService';
import movieServiceStubs from '@/services/movieServiceStubs';

import TextInput from '@/components/common/TextInput';
import ImageRender from '../movie_list/ImageRender';

const SearchContainer = styled.div`
  height: 325px;
  overflow-y: auto;
`;

const MovieItem = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const MovieContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 10px;
  width: 100%;
`;

interface Props {
  visible: boolean;
  close: () => void;
  action: (movie: Movie) => void;
}

function CreateMovie({visible, close, action}: Props) {
  const [searchStr, setSearchStr] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MovieTruncated[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      const movies: Movie[] = await movieServiceStubs.getAllMovies();
      setAllMovies(movies);
    }

    fetchMovies();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchStr]);

  async function handleSearch() {
    if (searchStr.length < 3) {
      setSearchResults([]);
      return;
    }

    const moviesTruncated: MovieTruncated[] | undefined = await importService.searchMoviesByTitle(searchStr);
    if (!moviesTruncated) {
      setSearchResults([]);
      return;
    }

    const results = moviesTruncated.map(movie => {
      const movieInDb = allMovies.find(
        m => m.imdbID === movie.imdbID || (m.title === movie.title && m.year.toString() === movie.year)
      );

      if (movieInDb) movie.id = movieInDb.id;

      return movie;
    });

    setSearchResults(results);
  }

  async function addCustomMovie() {
    const movieToAdd: Movie = {
      id: 0,
      imdbID: '',
      title: '',
      year: 2016,
      runtime: 120,
      genres: [],
      director: '',
      actors: '',
      plot: '',
      posterUrl: '',
      lists: []
    };

    await action(movieToAdd);
  }

  async function createMovie(imdbID: string) {
    const movie: Movie | undefined = await importService.getMovieByIMDBId(imdbID);

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
    <Modal show={visible} onHide={close}>
      <Modal.Header closeButton onClick={close}>
        <Modal.Title>Create Movie</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>You can search for a movie to import or create a new one.</p>
        <TextInput
          name="searchStr"
          label="Search for a movie"
          value={searchStr}
          onChange={(field, value) => setSearchStr(value)}
          placeholder="Search"
        />

        {!isEmpty(searchResults) && (
          <SearchContainer>
            {searchResults.map((movie: MovieTruncated) => {
              return (
                <MovieItem key={movie.imdbID}>
                  <ImageRender title={movie.title} url={movie.poster} />

                  <MovieContent>
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
                  </MovieContent>
                </MovieItem>
              );
            })}
          </SearchContainer>
        )}

        {searchStr.length >= 3 && isEmpty(searchResults) && <p>No results found.</p>}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={addCustomMovie}>Add Custom</Button>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateMovie;
