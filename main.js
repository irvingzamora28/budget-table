// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const createTables = require('./src/database/desktop/dbSQLiteSetup'); // Ensure SQLite tables are created
const dbAccess = require('./src/database/dbAccessLayer');   // Unified database access layer

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'electron.js'),
      nodeIntegration: true, // Required to allow Electron to access Node.js features
      contextIsolation: false, // Required to allow IPC communication
    },
  });

  win.loadURL('http://localhost:3000');
}

// Call this function when the app is ready to ensure SQLite tables are created
app.whenReady().then(() => {
  createTables(); // Run this to create tables on app launch

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Handle IPC requests between the renderer and main processes
ipcMain.handle('add-user', async (event, user) => {
  try {
    const result = await dbAccess.userRepo.add(user); // Add a user using SQLite
    return result; // Send back result to renderer process
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
});

ipcMain.handle('get-user', async (event, userId) => {
  try {
    const user = await dbAccess.userRepo.getById(userId); // Fetch user details using SQLite
    return user; // Send user data to renderer process
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
