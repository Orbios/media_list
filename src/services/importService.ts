import axios from 'axios';
import * as csv from '@fast-csv/parse';
import {includes} from 'lodash';

const fs = require('fs-extra');

import notificationHelper from '@/helpers/notificationHelper';
import storageHelper from '@/services/storageHelper';
import {reloadMainWindow} from '@/electron/senders';

const NOT_APPLICABLE = 'N/A';

//by default all imported movies are watched
const PREDEFINED_LIST_ID = 1;
const RELOAD_TIMEOUT = 3000;

interface InputList {
  id: string;
  title: string;
}

const exports = {
  importMoviesFromFile,
  searchMoviesByTitle,
  getMovieByIMDBId
};

async function importMoviesFromFile(filePath: string) {
  try {
    const inputList: InputList[] = await readData(filePath);

    const actions = inputList.map(input =>
      axios.get(`http://www.omdbapi.com/?i=${input.id}&plot=short&r=json&apikey=219f99af`)
    );

    const db = await storageHelper.readData();

    const genres = db.movies.genres;

    let movieId = db?.movies?.items?.length ? db.movies.items.length + 1 : 1;

    const responses = await Promise.all(actions);

    let added = 0;
    let skipped = 0;

    for (const response of responses) {
      const movieItem: Movie | undefined = getResultItem(response.data, movieId);
      movieId = movieId + 1;

      const idExists = db.movies.items.some(m => m.imdbID === movieItem?.imdbID);

      if (idExists) {
        skipped = skipped + 1;
        continue;
      }

      movieItem?.genres.forEach(genre => {
        if (!includes(genres, genre)) {
          genres.push(genre);
        }
      });

      db.movies.items.push(movieItem);
      added = added + 1;
    }
    await storageHelper.saveData(db);

    notificationHelper.message(`Movies were successfully imported! Added: ${added}, Skipped: ${skipped}`);

    if (added > 0) {
      setTimeout(() => {
        reloadMainWindow();
      }, RELOAD_TIMEOUT);
    }
  } catch (err) {
    console.log(err);
    notificationHelper.error('Error while importing movies!');
  }
}

async function searchMoviesByTitle(searchStr: string): Promise<MovieTruncated[] | undefined> {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?s=${searchStr}&plot=short&r=json&apikey=219f99af`);

    if (response.data.Response === 'False') return undefined;

    return response.data.Search.map((item: any) => {
      return {
        imdbID: item.imdbID,
        title: item.Title,
        year: item.Year,
        type: item.Type,
        poster: item.Poster
      };
    });
  } catch (err) {
    console.log(err);
    notificationHelper.error('Error while searching movies!');
  }
}

async function getMovieByIMDBId(id: string): Promise<Movie | undefined> {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?i=${id}&plot=short&r=json&apikey=219f99af`);

    if (response.data.Response === 'False') return undefined;

    return getResultItem(response.data, 0);
  } catch (err) {
    console.log(err);
    notificationHelper.error('Error while getting movie by IMDB id!');
  }
}

//helper methods

function readData(filePath: string): Promise<InputList[]> {
  const result: InputList[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv.parse({headers: true}))
      .on('error', error => {
        console.error(error);
        reject(error);
      })
      .on('data', row => {
        result.push({
          id: row.Const,
          title: row.Title
        });
      })
      .on('end', () => resolve(result));
  });
}

function getResultItem(data, id): Movie | undefined {
  const movieId = data.imdbID;

  const runtime =
    data.Runtime !== NOT_APPLICABLE ? data.Runtime.substring(0, data.Runtime.length - 1 - 3) : data.Runtime;

  const getYear = year => {
    const [startYear] = year.split('–');
    return Number(startYear);
  };

  try {
    const movie: Movie = {
      id,
      imdbID: movieId,
      title: data.Title,
      year: getYear(data.Year),
      runtime,
      genres: data.Genre.split(', '),
      director: data.Director,
      actors: data.Actors,
      plot: data.Plot,
      posterUrl: data.Poster !== NOT_APPLICABLE ? data.Poster : '',
      lists: [PREDEFINED_LIST_ID]
    };

    return movie;
  } catch (err) {
    console.log(`Error while importing movie with ID ${movieId}`);
    console.log(err);
  }
}

export default exports;
