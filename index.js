const {app, Tray, Menu} = require('electron');
const path = require('path');
const Mixable = require("./mixable.js");

const iconPath = path.join(__dirname, 'icon.png');

app.on('ready', function(){
  const appIcon = new Tray(iconPath);

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
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:',
      }
    ]);
  }

  Mixable.run();

  appIcon.setToolTip('Mixable');
  appIcon.setContextMenu(buildMenu());
});
