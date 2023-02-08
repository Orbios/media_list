import {getWindow} from '../../window';

export const selectedFolder = (filePaths: string[]): void => {
  getWindow().webContents.send('selectedFolder', filePaths);
};

export const mainProcessMessage = (): void => {
  getWindow()?.webContents.send('main-process-message', new Date().toLocaleString());
};

export const openPreferences = (): void => {
  getWindow().webContents.send('openPreferences');
};

export const importMovies = (filePaths: string[]): void => {
  getWindow().webContents.send('importMovies', filePaths);
};
