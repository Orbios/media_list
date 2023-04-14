import {ipcRenderer} from 'electron';

import {store} from '@/store';
import {setPreferenceDir, setNewPreferenceDir} from '@/reducers/commonSlice';

export default function initIpcListeners(): void {
  ipcRenderer.on('selectedFolder', (_, folderPath): void => {
    if (folderPath[0]) {
      store.dispatch(setNewPreferenceDir(folderPath[0]));
    }
  });

  ipcRenderer.invoke('read-user-data').then(prefDir => {
    store.dispatch(setPreferenceDir(prefDir));
  });
}
