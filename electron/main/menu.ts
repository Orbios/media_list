import {Menu, MenuItem, dialog} from 'electron';

import {getWindow} from '../window';
import {openPreferences, importMovies} from './ipcMain/senders';

export function buildMenu(): void {
  const template: MenuItem[] = getTemplate();

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}

function getTemplate(): MenuItem[] {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Import',
          id: 'import',
          click(): void {
            dialog
              .showOpenDialog(getWindow(), {
                buttonLabel: 'Select file',
                properties: ['openFile'],
                filters: [{name: 'Movies', extensions: ['csv']}]
              })
              .then(result => {
                importMovies(result.filePaths);
              });
          }
        },
        {
          label: 'Preferences',
          id: 'preferences',
          accelerator: 'CmdOrCtrl+,',
          click(): void {
            openPreferences();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          role: 'reload'
        },
        {
          label: 'Toggle Developer Tools',
          role: 'toggleDevTools'
        }
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Zoom In',
          role: 'zoomIn'
        },
        {
          label: 'Zoom Out',
          role: 'zoomOut'
        },
        {
          label: 'Reset Zoom',
          role: 'resetZoom'
        },
        {
          label: 'Minimize',
          role: 'minimize'
        },
        {
          label: 'Close',
          role: 'close'
        }
      ]
    }
  ];

  return template;
}
