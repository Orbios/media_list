import {getWindow} from '../../window';

export const selectedFolder = (filePaths: string[]): void => {
  const window = getWindow();
  window.webContents.send('selectedFolder', filePaths);
};

export const mainProcessMessage = (): void => {
  const window = getWindow();
  window?.webContents.send('main-process-message', new Date().toLocaleString());
};
