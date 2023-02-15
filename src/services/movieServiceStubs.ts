import {uniq} from 'lodash';

import config from '@/config';

import SORT_BY from '@/constants/sortBy';

import dataService from './dataService';

export type ListType = 'completed' | 'desired' | 'miscellaneous';

export default {
  getMovies,
  deleteMovie,
  saveMovie
};

async function getMovies(page: number, sortBy: string, searchStr: string, sortAsc: boolean, listType: ListType) {
  const mappedMovies = await getMappedMovies(listType);

  const movies = searchMovies(mappedMovies, searchStr);

  sortMovies(movies, sortBy, sortAsc);

  const result = getPage(movies, page, config.pageSize);

  return Promise.resolve({
    total: movies.length,
    dataItems: result
  });
}

async function deleteMovie(id: number, listType: ListType) {
  const data = await dataService.getData();
  const movies = data.movies.lists[listType];

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].id === id) {
      movies.splice(i, 1);
    }
  }

  return dataService.saveData();
}

function saveMovie(movie: Movie, listType: ListType) {
  if (movie.id) return updateMovie(movie, listType);

  return addMovie(movie, listType);
}

async function updateMovie(movie: any, listType: ListType) {
  const data = await dataService.getData();
  const movies = data.movies.lists[listType];

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].id === movie.id) {
      movies[i] = movie;
    }
  }

  return dataService.saveData();
}

async function addMovie(movie: any, listType: ListType) {
  const data = await dataService.getData();
  const movies = data.movies.lists[listType];

  let maxId = 0;

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].id > maxId) {
      maxId = movies[i].id;
    }
  }

  movie.id = maxId + 1;

  movies.push(movie);

  return dataService.saveData();
}

// helper methods

function searchMovies(movies: Movie[], searchStr: string) {
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

async function getMappedMovies(listType: ListType): Promise<Movie[]> {
  const data = await dataService.getData();

  const movies = data.movies.lists[listType];

  return movies.map(item => {
    return {
      ...item,
      year: Number(item.year),
      runtime: Number(item.runtime)
    };
  });
}
