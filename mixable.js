const Firebase = require('firebase');
const SpotifyWebHelper = require('@jonny/spotify-web-helper')
const { ipcMain } = require('electron');

const Mixable = {
  leader: false,

  run: function(win) {
    win.webContents.on('did-finish-load', () => {
      this.initialize(win)
    })
  },

  initialize: function(win) {
    let spotify = SpotifyWebHelper();

    let app = Firebase.initializeApp({
      databaseURL: "https://mixable-4c064.firebaseio.com",
    });

    let db = app.database();

    this.refLeader = db.ref("leader");

    this.refLeader.on("value", (snapshot) => {
      if (!snapshot.val()) return;

      this.leader = false;
      win.webContents.send("notifications", {
        title: `Now listening to ${snapshot.val().name}:`
      });
    })

    this.refStatus = db.ref("status");

    spotify.player.on('error', err => { console.log("ERROR: ", err) });
    spotify.player.on('ready', () => {
      if (this.leader) {
        this.setStatus(spotify.status)
      }

      spotify.player.on('status-will-change', status => {
        if (!this.leader) {
          return;
        }

        // same track, send seek only if it is a significant change
        if (spotify.status.track.track_resource.uri == status.track.track_resource.uri) {
          if (Math.abs(spotify.status.playing_position - status.playing_position) > 5) {
            this.setStatus(status)
          }
        }
        // change tracks
        else {
          this.setStatus(status)
        }
      });

      this.refStatus.on("value", (snapshot) => {
        if (this.leader) {
          return;
        }

        status = snapshot.val();
        this.displayStatus("get", status)

        if (status.playing) {
          // same track, just seek
          if (spotify.status.track.track_resource.uri == status.track.track_resource.uri) {
            spotify.player.seekTo(status.playing_position);
          }
          // change tracks
          else {
            spotify.player.play(status.track.track_resource.uri, (err, res) => {
              spotify.player.seekTo(status.playing_position)
            })
          }
        } else {
          spotify.player.pause()
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    });
  },

  toggleLeader: function() {
    this.leader = !this.leader
    this.refLeader.set({ name: process.env['USER'] })
  },

  setStatus: function(status) {
    this.refStatus.set(status)
    this.displayStatus("set", status)
  },

  displayStatus: function(mode, status) {
    if (status.playing) {
      console.log(Date.now() + " " + mode + " play " + status.track.track_resource.uri + " " + status.playing_position)
    } else {
      console.log(Date.now() + " " + mode + " pause")
    }
  }
};

module.exports = Mixable;
