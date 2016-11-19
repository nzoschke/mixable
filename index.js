const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');

const iconPath = path.join(__dirname, 'icon.png');
let appIcon = null;
let win = null;

app.on('ready', function(){
  startMixable();
  win = new BrowserWindow({show: false});
  appIcon = new Tray(iconPath);
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
    }
  ]);
  appIcon.setToolTip('Mixable');
  appIcon.setContextMenu(contextMenu);
});

function startMixable() {
  const SpotifyWebHelper = require('@jonny/spotify-web-helper')
  const helper = SpotifyWebHelper();

  const Firebase = require('firebase');
  const app = Firebase.initializeApp({
    databaseURL: "https://mixable-4c064.firebaseio.com",
  })

  const db = app.database();
  const statusRef = db.ref("status");

  helper.player.on('status-will-change', status => {
    // same track, send seek only if it is a significant change
    if (helper.status.track.track_resource.uri == status.track.track_resource.uri) {
      if (Math.abs(helper.status.playing_position - status.playing_position) > 5) {
        setStatus(status)
      }
    }
    // change tracks
    else {
      setStatus(status)
    }
  });

  helper.player.on('error', err => { console.log("ERROR: ", err) });

  helper.player.on('ready', () => {
    if (leader) {
      setStatus(helper.status)

      helper.player.on('status-will-change', status => {
        setStatus(status)
      });
    } else {
      statusRef.on("value", function(snapshot) {
        status = snapshot.val();
        displayStatus("get", status)

        if (status.playing) {
          // same track, just seek
          if (helper.status.track.track_resource.uri == status.track.track_resource.uri) {
            helper.player.seekTo(status.playing_position);
          }
          // change tracks
          else {
            helper.player.play(status.track.track_resource.uri, (err, res) => {
              helper.player.seekTo(status.playing_position)
            })
          }
        } else {
          helper.player.pause()
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  });

  function setStatus(status) {
    statusRef.set(status)
    displayStatus("set", status)
  }

  function displayStatus(mode, status) {
    if (status.playing) {
      console.log(Date.now() + " " + mode + " play " + status.track.track_resource.uri + " " + status.playing_position)
    } else {
      console.log(Date.now() + " " + mode + " pause")
    }
  }
}