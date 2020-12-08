const MainWindow = require('./components/Window/window.js');
const List = require( './components/List/List' )

const win = new MainWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame:true,
  }, {
    'f5':function(){
            win.reload();
          }
  });

win.createWindow();
