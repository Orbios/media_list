import SORT_BY from '@/constants/sortBy';

import utils from '@/helpers/utils';
import storageHelper from '@/services/storageHelper';

const exports = {
  getMovies,
  getAllMovies,
  deleteMovie,
  saveMovie,
  getGenres,
  getMovieLists,
  updateMoviePoster
};

let jsondata: any = null;
async function getData() {
  if (!jsondata) {
    jsondata = await storageHelper.readData();
  }
  return jsondata;
}

async function saveData() {
  const data = await getData();
  if (!data) return;
  await storageHelper.saveData(data);
}

async function getMovies(page: number, sortBy: string, searchStr: string, sortAsc: boolean, filterBy: number) {
  const mappedMovies = await getAllMovies();

  const movies = searchMovies(mappedMovies, searchStr, filterBy);

  sortMovies(movies, sortBy, sortAsc);

  const result = utils.getItemsPerPage(movies, page);

  return Promise.resolve({
    total: movies.length,
    dataItems: result
  });
}

async function getAllMovies(): Promise<Movie[]> {
  const data = await getData();
  const movies = data.movies.items;

  return movies.map(item => {
    return {
      ...item,
      year: Number(item.year),
      runtime: Number(item.runtime)
    };
  });
}

async function deleteMovie(id: number) {
  const data = await getData();
  const movies = data.movies.items;

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].id === id) {
      movies.splice(i, 1);
    }
  }

  return saveData();
}

function saveMovie(movie: Movie) {
  if (movie.id) return updateMovie(movie);

  return addMovie(movie);
}

async function updateMovie(movie: any) {
  const data = await getData();
  const movies = data.movies.items;

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].id === movie.id) {
      movies[i] = movie;
    }
  }

  return saveData();
}

async function addMovie(movie: any) {
  const data = await getData();
  const movies = data.movies.items;

  let maxId = 0;

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].id > maxId) {
      maxId = movies[i].id;
    }
  }

  movie.id = maxId + 1;

  movies.push(movie);

  return saveData();
}

async function getGenres() {
  const data = await getData();
  return data.movies.genres;
}

async function getMovieLists() {
  const data = await getData();
  return data.movies.lists;
}

async function updateMoviePoster(movieId: number, posterUrl: string) {
  const data = await getData();
  const movies = data.movies.items;

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].id === movieId) {
      movies[i].posterUrl = posterUrl;
    }
  }

  return saveData();
}

// helper methods

function searchMovies(movies: Movie[], searchStr: string, filterBy: number) {
  if (filterBy) {
    movies = movies.filter((movie: Movie) => {
      return movie?.lists?.includes(filterBy);
    });
  }

  if (!searchStr) return movies;

  const textSearchFields: string[] = ['title', 'year', 'actors', 'director', 'plot'];

  return movies.filter((movie: any) => {
    for (const field of textSearchFields) {
      if (utils.containsString(movie[field], searchStr)) return true;
    }

    for (const genre of movie.genres) {
      if (utils.containsString(genre, searchStr)) return true;
    }

    return false;
  });
}

function sortMovies(movies: Movie[], sortBy: string, isAsc: boolean) {
  const dirNum = isAsc ? 1 : -1;

  if (sortBy === SORT_BY.TITLE) {
    movies.sort((x, y) => x.title.localeCompare(y.title) * dirNum);
  }

  if (sortBy === SORT_BY.YEAR) {
    movies.sort((x: any, y: any) => (x.year - y.year) * dirNum);
  }

  if (sortBy === SORT_BY.RUNTIME) {
    movies.sort((x: any, y: any) => (x.runtime - y.runtime) * dirNum);
  }
}

export default exports;
