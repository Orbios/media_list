import {useEffect, useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import styled from 'styled-components';
import {isEmpty} from 'lodash';

import importService from '@/services/importService';

import TextInput from '@/components/common/TextInput';
import ImageRender from '../movie_list/ImageRender';

const ContainerCentered = styled.div`
  display: flex;
  justify-content: center;
`;

const SearchContainer = styled.div<{searchMode: boolean}>`
  height: ${props => (props.searchMode ? '325px' : 'auto')};
  overflow-y: auto;
`;

const MovieItem = styled.div<{searchMode: boolean}>`
  display: flex;
  cursor: pointer;
  padding: 10px;
  border-bottom: ${props => (props.searchMode ? '1px solid #ccc' : 'none')};
`;

const MovieContent = styled.div`
  margin-left: 10px;
`;

interface Props {
  visible: boolean;
  close: () => void;
  action: (movie: Movie) => void;
}

function CreateMovie({visible, close, action}: Props) {
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [movieToImport, setMovieToImport] = useState<MovieTruncated | null>(null);
  const [searchStr, setSearchStr] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MovieTruncated[]>([]);

  useEffect(() => {
    handleSearch();
    setMovieToImport(null);
  }, [searchStr]);

  async function handleSearch() {
    if (searchStr.length < 3) {
      setSearchResults([]);
      return;
    }

    const results: MovieTruncated[] | undefined = await importService.searchMoviesByTitle(searchStr);
    if (!results) {
      setSearchResults([]);
      return;
    }

    setSearchResults(results);
  }

  function selectMovie(movie: MovieTruncated) {
    setSearchResults([movie]);
    setMovieToImport(movie);
  }

  async function handleAction() {
    if (isCustomMode) {
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

      return action(movieToAdd);
    }

    const movie: Movie | undefined = await importService.getMovieByIMDBId(movieToImport?.imdbID || '');

    if (!movie) return;

    action(movie);
  }

  function render() {
    let disabled = true;
    if (isCustomMode) disabled = false;
    if (movieToImport) disabled = false;

    const searchMode = movieToImport ? false : true;

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
            <SearchContainer searchMode={searchMode}>
              {searchResults.map((movie: MovieTruncated) => {
                return (
                  <MovieItem key={movie.imdbID} searchMode={searchMode} onClick={() => selectMovie(movie)}>
                    <ImageRender title={movie.title} url={movie.poster} />

                    <MovieContent>
                      <h5>{movie.title}</h5>
                      <p>
                        {movie.year} | {movie.type}
                      </p>
                    </MovieContent>
                  </MovieItem>
                );
              })}
            </SearchContainer>
          )}

          {searchStr.length >= 3 && isEmpty(searchResults) && <p>No results found.</p>}

          <ContainerCentered>
            <p>OR</p>
          </ContainerCentered>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" id="custom-mode">
              <Form.Check.Input
                type="checkbox"
                value={isCustomMode.toString()}
                onChange={e => setIsCustomMode(e.target.checked)}
              />
              <Form.Check.Label>Create custom movie</Form.Check.Label>
            </Form.Check>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleAction} disabled={disabled}>
            Proceed
          </Button>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return render();
}

export default CreateMovie;
