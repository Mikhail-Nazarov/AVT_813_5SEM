const { app, BrowserWindow, globalShortcut} = require('electron')

class MainWindow
{
  constructor(windowProps = {
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame:true,
  }, shortcuts = {})
  {
    this.shortcuts = shortcuts;
    this.windowProps = windowProps;
  }

  createWindow()
  {
    app.whenReady().then(() => {
      let win = new BrowserWindow(this.windowProps);
      win.removeMenu();
      win.loadFile('app/index.html');
      win.webContents.openDevTools();

      app.on('ready',() => {
        for(shortcut in this.shortcuts)
        {
          globalShortcut.register(shortcut, this.shortcuts[shortcut]);
        }
      });

    });
  }
}

module.exports = MainWindow;




