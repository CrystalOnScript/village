'use strict';

const functions = require('firebase-functions');

const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;

const MILK = 'milk';

const UPDATE = 'update';

const tokenArray = [];

function writeNewAction(tokenArray, msg, needyUser) {

  console.log("We are in write new action method with needy user: " + needyUser);

  admin.database().ref("testvillage/").once("value", function(snapshot){
    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val().token;
      tokenArray.push(item);
    })

    console.log("We have an array of tokens: " + tokenArray);

      const possibleResponses = tokenArray.length;
      const title = msg;

      const needyUserID = needyUser;

      admin.database()
        .ref("/user-actions/" + needyUserID + "/actions")
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
        let newChatKey = admin.database().ref().child("chats").push().key;
        console.log("this is newChatKey", newChatKey)
        console.log("We have tokens to send to payload: " + tokenArray);
        console.log("We have a needy user ID and an action key to send to payload: " + needyUser + ", " + key);

        sendPayload(tokenArray, key, needyUser);
      })
  });
}

function sendPayload(tokenArray, key, needyUser) {

  console.log("We have a needy user ID and action key to pass as data to payload: " + needyUser + ", " + key);

  const keyString = key.toString();

  const needyUserString = needyUser.toString();

  const payload = {
    "data": {
      "actionID": keyString,
      "needyUserID": needyUserString,
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

  console.log("Can I get at user ID, please, please, please? " + req.body.originalRequest.data.user.userId);

  const needyUser = req.body.originalRequest.data.user.userId;
  const assistant = new Assistant({request: req, response: res});

  let actionMap = new Map();
  actionMap.set(MILK, milkHandler);
  actionMap.set(UPDATE, updateHandler);
  assistant.handleRequest(actionMap);

  function milkHandler (assistant) {
    const msg = "Contacting village now to get milk. Check back in 5 mins.";
    writeNewAction(tokenArray, msg, needyUser);
    assistant.tell(msg);
  }

  function updateHandler (assistant) {
    const msg = "Let's check on our responses now.";
    // Todo: write function to check responses passing in action key.
    // Todo: need to see how we can get the action key from the write new action function.
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
