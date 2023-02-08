const Store = require('electron-store');

const store = new Store();

const KEYS = {
  FILE_PATH: 'filePath'
};

/**
 * Return value for specified preference. If not set, save and return the provided default value
 */
function getPref(prefName: string, defaultValue) {
  let value;

  if (store.has(prefName)) {
    value = store.get(prefName);
  } else {
    value = defaultValue;
    store.set(prefName, value);
  }
  return value;
}

/**
 * Update the specified preference's value
 */
function setPref(prefName: string, value): void {
  store.set(prefName, value);
}

// DB file

/**
 * Return the preference for the directory in which the DB file is saved
 */
export function loadDirPref(prefDir: string): string {
  return getPref(KEYS.FILE_PATH, prefDir);
}

/**
 * Update the DB directory preference
 */
export function saveDirPref(filePath: string): void {
  setPref(KEYS.FILE_PATH, filePath);
}
