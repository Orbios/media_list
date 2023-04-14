import {ipcRenderer} from 'electron';

export function showDialogForSelectingDirectory(): void {
  return ipcRenderer.send('open-file-dialog');
}
