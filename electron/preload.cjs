const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('jassData', Object.freeze({
  getDrives: () => ipcRenderer.invoke('jass-data:get-drives'),
  listDirectory: (directoryPath) =>
    ipcRenderer.invoke('jass-data:list-directory', directoryPath)
}));
