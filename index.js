const SpotifyWebHelper = require('@jonny/spotify-web-helper')
const helper = SpotifyWebHelper();

const Admin = require("firebase-admin");
Admin.initializeApp({
  credential: Admin.credential.cert("./mixable-4c064-firebase-adminsdk-gsn7q-bd7a3fc21c.json"),
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
    statusRef.set(helper.status)
    helper.player.on('status-will-change', status => {
      console.log("SET STATUS: ", status)
      statusRef.set(status)
    });
  } else {
    statusRef.on("value", function(snapshot) {
      status = snapshot.val();
      console.log("GET STATUS: ", status)

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