import {ipcRenderer} from 'electron';

export function showDialogForSelectingDirectory(): void {
  return ipcRenderer.send('open-file-dialog');
}

export function reloadMainWindow(): void {
  return ipcRenderer.send('reload-main-window');
}
