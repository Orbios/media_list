import {moveFile as move} from 'move-file';
import path from 'path';

import config from '@/config';
import {loadDirPref} from './preferences';

const fs = require('fs-extra');

const FILE_NAME = config.dbFileName;

/**
 * Return path to db file (set in preferences)
 */
export function getDbFilePath(prefDir): string {
  // Concatenate and return directory preference with file name
  const fileDir = loadDirPref(prefDir);

  return path.resolve(fileDir, FILE_NAME);
}

export async function moveFile(sourcePath: string, destinationPath: string) {
  if (fileExists(destinationPath)) {
    throw Error('Another file exists at the destination path');
  }

  await move(sourcePath, destinationPath);
}

//helper methods

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
