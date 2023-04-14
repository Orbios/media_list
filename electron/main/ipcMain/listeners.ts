import {ipcMain, dialog, app, BrowserWindow} from 'electron';
import {getWindow} from '../../window';
import {selectedFolder} from './senders';

function initIpcListeners(): void {
  const win: BrowserWindow = getWindow();

  ipcMain.handle('read-user-data', _ => {
    const path = app.getPath('userData');
    return path;
  });

  ipcMain.on('open-file-dialog', _ => {
    dialog
      .showOpenDialog(win, {
        buttonLabel: 'Select directory',
        properties: ['openDirectory']
      })
      .then(result => {
        selectedFolder(result.filePaths);
      });
  });
}

export default initIpcListeners;
