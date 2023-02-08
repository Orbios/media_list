import {ipcRenderer} from 'electron';

import {store} from '@/store';
import {setPreferenceDir, setNewPreferenceDir, togglePreferencesVisibility} from '@/reducers/commonSlice';
import importService from '@/services/importService';

export default function initIpcListeners(): void {
  ipcRenderer.on('selectedFolder', (_, folderPath): void => {
    if (folderPath[0]) {
      store.dispatch(setNewPreferenceDir(folderPath[0]));
    }
  });

  ipcRenderer.invoke('read-user-data').then(prefDir => {
    store.dispatch(setPreferenceDir(prefDir));
  });

  ipcRenderer.on('openPreferences', (): void => {
    store.dispatch(togglePreferencesVisibility());
  });

  ipcRenderer.on('importMovies', (_, filePath): void => {
    if (filePath[0]) {
      importService.importMoviesFromFile(filePath[0]);
    }
  });
}
