import {store} from '@/store';
import {getDbFilePath} from '@/files/fileAccess';

import moviesData from '@/data/db.json';

const fs = require('fs-extra');

export default {
  readData,
  saveData
};

let data = null;
let dbPath = '';

async function readData() {
  if (data) return data;

  const preferenceDir = store.getState().common.preferenceDir;
  dbPath = getDbFilePath(preferenceDir);

  console.log(`Loading DB from '${dbPath}'`);

  const dbExists = await fs.pathExists(dbPath);

  if (!dbExists) {
    console.log(`Cannot open db at ${dbPath}. Generating empty one.`);
    await fs.writeJson(dbPath, getDefaultData());
  }

  let result = await fs.readJson(dbPath);
  data = result;

  return result;
}

async function saveData(data) {
  await fs.writeJson(dbPath, data);
}

//helper methods

function getDefaultData() {
  return moviesData;
}
