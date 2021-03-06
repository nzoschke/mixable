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

  function updateMenu() {
    appIcon.setContextMenu(buildMenu())
  }

  function buildMenu() {
    return Menu.buildFromTemplate([
      {
        label: Mixable.leader ? '✓ Leader' : 'Lead session',
        click: () => Mixable.setLeader(!Mixable.leader, false)
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

  Mixable.onLeaderChange = updateMenu;
  Mixable.run(win);

  // not working currently, see: https://github.com/electron/electron/issues/3599
  appIcon.setToolTip('Mixable');
  appIcon.setContextMenu(buildMenu());

  appIcon.on('drop-text', function(event, text) {
    console.log(text);
    if (text.includes("https://open.spotify.com")) {
      Mixable.becomeLeaderAndPlay(text);
    }
  });
});
