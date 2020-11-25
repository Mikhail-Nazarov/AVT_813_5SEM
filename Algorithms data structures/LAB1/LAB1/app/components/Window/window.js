const { app, BrowserWindow, globalShortcut} = require('electron')

class MainWindow
{
  constructor(windowProps = {
    width: 400,
    height: 800,
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
      win.resizable = true;

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




