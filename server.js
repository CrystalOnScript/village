process.env.DEBUG = 'actions-on-google:*';
//const ApiAiApp = require('actions-on-google').ApiAiApp;
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const firebase = require("firebase");
const admin = require("firebase-admin");

const config = {
  apiKey: "AIzaSyD-np5USZAOXmA51TB8EmNcPPYCnffOmjI",
  authDomain: "villageapp-6bbe4.firebaseapp.com",
  databaseURL: "https://villageapp-6bbe4.firebaseio.com",
  projectId: "villageapp-6bbe4",
  storageBucket: "villageapp-6bbe4.appspot.com",
  messagingSenderId: "955973472886"
};
firebase.initializeApp(config);

const database = firebase.database();
// let FBtoken = firebase.database().ref("/tokens/").once('value');
// console.log(FBtoken);

const serviceAccount = require("./villageSDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://villageapp-6bbe4.firebaseio.com"
});
// Include Server Dependencies
const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.text());
expressApp.use(bodyParser.json({ type: "application/vnd.api+json" }));

expressApp.use(express.static(path.resolve(__dirname, 'build')));

// Main "/" Route. Redirects user to rendered React application.
expressApp.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



expressApp.post("/api/messaging", function(req, res) {
  console.log("Messaging token: " + req.body.token);
  var registrationToken = req.body.token;

  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  var payload = {
      notification: {
        title: "Hello World",
        body: "Fun message you have!"
      }
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().sendToDevice(registrationToken, payload)
    .then(function(response) {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });
});

// Sets an initial port.
const PORT = process.env.PORT || 8080;

// Listener.
expressApp.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});

module.exports = expressApp;
