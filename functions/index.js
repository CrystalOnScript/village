'use strict';

const functions = require('firebase-functions');

const firebase = require("firebase");

const admin = require("firebase-admin");

const config = {
  apiKey: "AIzaSyCCE0oLJcgSsOh6O7JMShwbeNs1lpL3YFY",
  authDomain: "villageherald-9jl.firebaseapp.com",
  databaseURL: "https://villageherald-9jl.firebaseio.com",
  projectId: "villageherald-9jl",
  storageBucket: "villageherald-9jl.appspot.com",
  messagingSenderId: "973758092658"
};
firebase.initializeApp(config);

const database = firebase.database();

const serviceAccount = require("./villageSDK.json");

const credential = admin.credential.cert(serviceAccount);

admin.initializeApp(functions.config().firebase);

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;

const MILK = 'milk';

const tokenArray = [];

function sendNotification(tokenArray) {
    console.log("We are calling send notification!");
    admin.database().ref("testvillage/").once("value", function(snapshot){
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val().token;
        tokenArray.push(item);
      })
      console.log("We have an array of tokens: " + tokenArray);
      sendPayload(tokenArray)
    })
}

function sendPayload(tokenArray) {

  var payload = {
    notification: {
      title: "Meggin needs milk",
      body: "Can you get Meggin milk?"
    }
  };

  admin.messaging().sendToDevice(tokenArray, payload)
    .then(function(response) {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });
}

exports.villageApp = functions.https.onRequest((req, res) => {

  console.log("Village App request headers: " + JSON.stringify(req.headers));
  console.log("Village APP request body: " + JSON.stringify(req.body));

  const assistant = new Assistant({request: req, response: res});

  let actionMap = new Map();
  actionMap.set(MILK, milkHandler);
  assistant.handleRequest(actionMap);

  function milkHandler (assistant) {
    sendNotification(tokenArray);
    const msg = "Contacting village now to get milk. Check back in 5 mins.";
    assistant.tell(msg);
  }
});

exports.sendMessage = functions.https.onRequest((req, res) => {
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
