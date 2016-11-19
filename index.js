const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');
const Mixable = require("./mixable.js");

const iconPath = path.join(__dirname, 'icon.png');
let appIcon = null;
let win = null;

app.on('ready', function(){
  Mixable.run();

  win = new BrowserWindow({show: false});
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
