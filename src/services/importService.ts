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

interface InputList {
  id: string;
  title: string;
}

const exports = {
  importMoviesFromFile
};

async function importMoviesFromFile(filePath: string) {
  try {
    const inputList: InputList[] = await readData(filePath);

    const actions = inputList.map(input =>
      axios.get(`http://www.omdbapi.com/?i=${input.id}&plot=short&r=json&apikey=219f99af`)
    );

    const db = await storageHelper.readData();

    const genres = db.movies.genres;

    try {
      let movieId = db?.movies?.items?.length ? db.movies.items.length + 1 : 1;

      const responses = await Promise.all(actions);

      for (const response of responses) {
        const movieItem: Movie | undefined = getResultItem(response.data, movieId);
        movieId = movieId + 1;

        const idExists = db.movies.items.some(m => m.imdbID === movieItem?.imdbID);

        if (!idExists) {
          movieItem?.genres.forEach(genre => {
            if (!includes(genres, genre)) {
              genres.push(genre);
            }
          });

          db.movies.items.push(movieItem);
        }
      }
      await storageHelper.saveData(db);

      notificationHelper.message('Movies were successfully imported!');

      reloadMainWindow();
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
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
