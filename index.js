const SpotifyWebHelper = require('@jonny/spotify-web-helper')
const helper = SpotifyWebHelper();

const Admin = require("firebase-admin");
Admin.initializeApp({
  credential: Admin.credential.applicationDefault(),
  databaseURL: "https://mixable-4c064.firebaseio.com"
});

const db = Admin.database();
const statusRef = db.ref("status");

const leader = process.argv[2] == "--leader"
if (leader) {
  console.log("Leading the session.")
} else {
  console.log("Following the session.")
}

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
        helper.player.play(status.track.track_resource.uri)
        helper.player.seekTo(status.playing_position)
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
    console.log(Date.now() + " " + mode + "pause")
  }
}