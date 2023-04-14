import {Menu, MenuItem} from 'electron';

export function buildMenu(): void {
  const template: MenuItem[] = getTemplate();

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}

function getTemplate(): MenuItem[] {
  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          role: 'undo'
        },
        {
          label: 'Redo',
          role: 'redo'
        },
        {type: 'separator'},
        {
          label: 'Cut',
          role: 'cut'
        },
        {
          label: 'Copy',
          role: 'copy'
        },
        {
          label: 'Paste',
          role: 'paste'
        },
        {
          label: 'Select All',
          role: 'selectAll'
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
