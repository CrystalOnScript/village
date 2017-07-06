process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;
const request = require('request');
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const firebase = require("firebase");
const admin = require("firebase-admin");

const MILK = 'milk';

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

expressApp.post("/api/sendMessage", function(req, res) {
  var registrationToken = req.body.token;

  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  var payload = {
      notification: {
        title: "Hi!",
        body: "You sent this notification to yourself!"
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

exports.villageApp = (req, res) => {
  const assistant = new Assistant({request: req, response: res});
  console.log("Village App request headers: " + JSON.stringify(req.headers));
  console.log("Village APP request body: " + JSON.stringify(req.body));

  function milkHandler (assistant) {
    const msg = "Contacting village now to get milk. Check back in 5 mins.";
    assistant.tell(msg);
  }

  const actionMap = new Map();
  actionMap.set(MILK, milkHandler);

  assistant.handleRequest(actionMap);
};
