const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  win.loadFile('public/index.html');
}

ipcMain.handle('run-script', async (_, config) => {
  const cfgPath = path.join(__dirname, 'python', 'config.json');
  fs.writeFileSync(cfgPath, JSON.stringify(config, null, 2));

  return new Promise((resolve, reject) => {
    const py = spawn('python', ['register.py'], { cwd: path.join(__dirname, 'python') });
    let output = '';
    py.stdout.on('data', data => output += data.toString());
    py.stderr.on('data', data => output += data.toString());
    py.on('close', code => resolve(output));
  });
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
