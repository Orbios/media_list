import storageHelper from './storageHelper';

type mediaType = 'movies' | 'books' | 'games';

export default {
  getData,
  saveData,
  getGenresForMediaList
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

async function getGenresForMediaList(type: mediaType) {
  const data = await getData();

  return data[type].genres;
}
