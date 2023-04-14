const path = require('path');
const jsonfile = require('jsonfile');

const filePath = `/Users/erik/Dropbox/Programms_Data/media_list.json`;

async function run() {
  try {
    const originalFileData = await jsonfile.readFile(filePath);
    const fileName = path.basename(filePath);
    const folderPath = path.dirname(filePath);
    const backupFilePath = path.join(folderPath, `copy_${fileName}`);
    await jsonfile.writeFile(backupFilePath, originalFileData);

    const currentPath = process.cwd();
    const dataSamplePath = path.join(currentPath, 'src', 'data', 'media_list.json');
    const sampleFileData = await jsonfile.readFile(dataSamplePath);

    sampleFileData.movies.items = originalFileData.movies.items;

    await jsonfile.writeFile(filePath, sampleFileData);

    console.log('Done!');
  } catch (err) {
    console.log(err);
  }
}

run();
