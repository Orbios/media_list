const csv = require('@fast-csv/parse');
const path = require('path');
const fs = require('fs');
const jsonfile = require('jsonfile');
const axios = require('axios');
const _ = require('lodash');

//by default all imported movies are watched
const PREDEFINED_LIST_ID = 1;

function readData() {
  const filePath = path.join(__dirname, 'data', 'movies.csv');

  const result = [];

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

async function generateDb(inputList) {
  const dbPath = './scripts/data/db.json';

  const actions = inputList.map(input =>
    axios.get(`http://www.omdbapi.com/?i=${input.id}&plot=short&r=json&apikey=219f99af`)
  );

  const db = await jsonfile.readFile(dbPath);

  const genres = db.movies.genres;

  try {
    const responses = await Promise.all(actions);

    for (const response of responses) {
      const movieItem = getResultItem(response.data);

      const idExists = db.movies.items.some(m => m.id === movieItem.id);

      if (!idExists) {
        for (const genre of movieItem.genres) {
          if (!_.includes(genres, genre)) {
            genres.push(genre);
          }
        }
        db.movies.items.push(movieItem);
      }
    }

    await jsonfile.writeFile(dbPath, db);
    console.log('Imported!');
  } catch (err) {
    console.log(err);
  }
}

function getResultItem(data) {
  const movieId = data.imdbID;

  try {
    const item = {
      id: movieId,
      title: data.Title,
      year: data.Year,
      runtime: data.Runtime.substring(0, data.Runtime.length - 1 - 3),
      genres: data.Genre.split(', '),
      director: data.Director,
      actors: data.Actors,
      plot: data.Plot,
      posterUrl: data.Poster !== 'N/A' ? data.Poster : '',
      lists: [PREDEFINED_LIST_ID]
    };

    return item;
  } catch (err) {
    console.log(`Error while importing movie with ID ${movieId}`);
    console.log(err);
  }
}

async function run() {
  try {
    const data = await readData();

    //const data = require('./data/input_old.json').input;

    await generateDb(data);
  } catch (err) {
    console.log(err);
  }
}

run();
