const { app, BrowserWindow } = require('electron');
const { app: serverApp, server } = require('./local-app/server');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
