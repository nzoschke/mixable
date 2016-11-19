const {app, Tray, Menu} = require('electron');
const path = require('path');
const Mixable = require("./mixable.js");

const iconPath = path.join(__dirname, 'icon.png');
let appIcon = null;

app.on('ready', function(){
  Mixable.run();

  appIcon = new Tray(iconPath);
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Leader',
      click: function() {
        Mixable.leader = !Mixable.leader;
      }
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
    }
  ]);

  appIcon.setToolTip('Mixable');
  appIcon.setContextMenu(contextMenu);
});
