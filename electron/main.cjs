const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function isInsideRoot(root, target) {
  const relative = path.relative(root, target);
  return relative === '' ||
    (!relative.startsWith('..' + path.sep) &&
     relative !== '..' &&
     !path.isAbsolute(relative));
}

function validateDirectory(input) {
  if (typeof input !== 'string' || input.length > 32767) {
    throw new Error('Invalid directory path.');
  }

  const target = path.resolve(input);

  if (process.platform === 'win32') {
    if (!/^[A-Za-z]:\\/.test(target)) {
      throw new Error('Only local drive paths are supported.');
    }

    const root = path.parse(target).root;
    if (!isInsideRoot(root, target)) {
      throw new Error('Path is outside the selected drive.');
    }
  } else if (!path.isAbsolute(target)) {
    throw new Error('An absolute directory path is required.');
  }

  return target;
}

ipcMain.handle('jass-data:get-drives', async () => {
  if (process.platform !== 'win32') {
    return [{
      path: path.parse(process.cwd()).root,
      name: 'System root',
      type: 'filesystem'
    }];
  }

  const drives = [];
  for (let code = 65; code <= 90; code++) {
    const letter = String.fromCharCode(code);
    const root = `${letter}:\\`;

    try {
      await fs.promises.access(root, fs.constants.R_OK);
      const stats = await fs.promises.stat(root);
      if (stats.isDirectory()) {
        drives.push({
          path: root,
          name: `Drive ${letter}:`,
          type: 'drive'
        });
      }
    } catch {
      // An unavailable or disconnected drive is skipped.
    }
  }

  return drives;
});

ipcMain.handle('jass-data:list-directory', async (_event, input) => {
  const directory = validateDirectory(input);
  const info = await fs.promises.stat(directory);

  if (!info.isDirectory()) {
    throw new Error('The selected path is not a directory.');
  }

  const entries = await fs.promises.readdir(directory, {
    withFileTypes: true
  });

  const results = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);

    try {
      const stats = await fs.promises.lstat(fullPath);
      return {
        name: entry.name,
        path: fullPath,
        isDirectory: entry.isDirectory(),
        isSymbolicLink: entry.isSymbolicLink(),
        size: stats.size,
        modified: stats.mtime.toISOString()
      };
    } catch {
      return {
        name: entry.name,
        path: fullPath,
        isDirectory: entry.isDirectory(),
        isSymbolicLink: entry.isSymbolicLink(),
        size: null,
        modified: null,
        unavailable: true
      };
    }
  }));

  return results.sort((a, b) =>
    Number(b.isDirectory) - Number(a.isDirectory) ||
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 960,
    minWidth: 1050,
    minHeight: 700,
    backgroundColor: '#111018',
    title: 'JASS LayoutLab Studio',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const devUrl =
    process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173';
  win.loadURL(devUrl);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
