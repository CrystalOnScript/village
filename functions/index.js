'use strict';

//const firebase = require("firebase");

const functions = require('firebase-functions');

const admin = require("firebase-admin");

/*
const config = {
  apiKey: "AIzaSyD-np5USZAOXmA51TB8EmNcPPYCnffOmjI",
  authDomain: "villageapp-6bbe4.firebaseapp.com",
  databaseURL: "https://villageapp-6bbe4.firebaseio.com",
  projectId: "villageapp-6bbe4",
  storageBucket: "villageapp-6bbe4.appspot.com",
  messagingSenderId: "955973472886"
};
firebase.initializeApp(config);
*/

//const serviceAccount = require("./villageSDK.json");

//const credential = admin.credential.cert(serviceAccount);

admin.initializeApp(functions.config().firebase);

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;

const MILK = 'milk';

const tokenArray = [];

function writeNewAction(tokenArray, msg) {

  admin.database().ref("testvillage/").once("value", function(snapshot){
    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val().token;
      tokenArray.push(item);
    })

    console.log("We have an array of tokens: " + tokenArray);

      const possibleResponses = tokenArray.length;
      const title = msg;

      admin.database()
        .ref("/actions")
        .push({
          actionTitle: title,
          responseTotal: possibleResponses,
          yesResponses: 0,
          noResponses: 0,
          closedNotification: 0,
          otherResponses: 0
      })
      .then((snap) => {
        const key = snap.key;

        console.log("We have tokens to send to payload: " + tokenArray);
        console.log("We have a key to send to payload: " + key);

        sendPayload(tokenArray, key); 
      })  
  });
}

  //var newActionKey = firebase.database().ref().child('actions').push().key;

  //var updates = {};
  //updates['/actions/' + newActionKey] = actionData;

  //return firebase.database().ref().update(updates);

function sendPayload(tokenArray, key) {

  console.log("We have an action key to pass as data to payload: " + key);

  const keyString = key.toString();
  
  const payload = {
    "data": {
      "actionID": keyString,
      "jsondata": "{\"body\":\"Meggin needs help\", \"title\":\"Can you help her make the code work?\",\"actions\": [{\"action\":\"yes\", \"title\":\"Yes\"},{\"action\":\"no\",\"title\":\"No\"}]}"
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
  console.log("Village App request body: " + JSON.stringify(req.body));

  const assistant = new Assistant({request: req, response: res});

  let actionMap = new Map();
  actionMap.set(MILK, milkHandler);
  assistant.handleRequest(actionMap);

  function milkHandler (assistant) {
    const msg = "Contacting village now to get milk. Check back in 5 mins.";
    writeNewAction(tokenArray, msg);
    //sendNotification(tokenArray);
    assistant.tell(msg);
  }
  // Todo: we may want to close of the function with a res.end();
  // Need to be careful though of any asynchronous processing.
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

  // Todo: we may want to close off the function with a res.end().
  // Need to be careful though of any asynchronous processing.
});