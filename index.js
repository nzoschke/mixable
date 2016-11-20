const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');
const Mixable = require("./mixable.js");

const iconPath = path.join(__dirname, 'icon.png');

// causes a short flip in the doc, but this is the only way so far
// see: https://github.com/electron/electron/issues/422
app.dock.hide();

let win = null;

app.on('ready', function(){
  const appIcon = new Tray(iconPath);
  let win = new BrowserWindow({ show: false })
  win.loadURL(`file://${__dirname}/index.html`)

  function toggleLeader() {
    Mixable.leader = !Mixable.leader;
    if (Mixable.leader) {
      console.log('now leading');
    }
    else {
      console.log('now listening');
    }
    appIcon.setContextMenu(buildMenu())
  }

  function buildMenu() {
    return Menu.buildFromTemplate([
      {
        label: Mixable.leader ? '✓ Leader' : 'Leader',
        click: toggleLeader,
      },
      {
        label: "Debug mode",
        click: () => {
          win.show();
          win.toggleDevTools();
        }
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:',
      }
    ]);
  }

  Mixable.run(win);

  appIcon.setToolTip('Mixable');
  appIcon.setContextMenu(buildMenu());
});
