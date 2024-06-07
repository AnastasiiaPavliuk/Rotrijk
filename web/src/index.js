const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let win1, win2;

function createWindows() {
  const displays = screen.getAllDisplays();
  if (displays.length < 2) {
    console.log('Need at least two monitors');
    app.quit();
    return;
  }

  // Create first window on the first display
  win1 = new BrowserWindow({
    x: displays[0].bounds.x + 50,
    y: displays[0].bounds.y + 50,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win1.loadFile('src/index.html');

  // Create second window on the second display
  win2 = new BrowserWindow({
    x: displays[1].bounds.x + 50,
    y: displays[1].bounds.y + 50,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win2.loadFile('src/finish.html');
}

app.whenReady().then(createWindows);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});

// Handle communication between windows
ipcMain.on('finish-from-win1', (event) => {
  win2.webContents.send('display-finish', 'finished');
});
