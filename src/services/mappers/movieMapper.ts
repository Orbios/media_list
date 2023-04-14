import {find} from 'lodash';

const exports = {
  getDefaultCustomMovie,
  mapMovies
};

function getDefaultCustomMovie(): Movie {
  const customMovie: Movie = {
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

  return customMovie;
}

function mapMovies(movies: MovieTruncated[], allMovies: Movie[]): MovieTruncated[] {
  const mappedMovies = movies.map(movieTruncated => {
    const movieInDb: Movie | undefined = find(
      allMovies,
      (movie: Movie) =>
        movie.imdbID === movieTruncated.imdbID ||
        (movie.title === movieTruncated.title && movie.year.toString() === movieTruncated.year)
    );

    if (movieInDb) movieTruncated.id = movieInDb.id;

    return movieTruncated;
  });

  return mappedMovies;
}

export default exports;
