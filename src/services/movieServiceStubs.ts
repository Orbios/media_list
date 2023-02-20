import config from '@/config';
import storageHelper from '@/services/storageHelper';

import SORT_BY from '@/constants/sortBy';

const exports = {
  getMovies,
  deleteMovie,
  saveMovie,
  getGenres,
  getMovieLists
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
  const mappedMovies = await getMappedMovies();

  const movies = searchMovies(mappedMovies, searchStr, filterBy);

  sortMovies(movies, sortBy, sortAsc);

  const result = getPage(movies, page, config.pageSize);

  return Promise.resolve({
    total: movies.length,
    dataItems: result
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
      if (containsString(movie[field], searchStr)) return true;
    }

    for (const genre of movie.genres) {
      if (containsString(genre, searchStr)) return true;
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

function containsString(obj: any, searchStr: string) {
  return obj.toString().toLowerCase().indexOf(searchStr.toLowerCase()) !== -1;
}

function getPage(movies: Movie[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  const end = page * perPage;
  return movies.slice(start, end);
}

async function getMappedMovies(): Promise<Movie[]> {
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

export default exports;
