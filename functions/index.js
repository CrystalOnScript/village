'use strict';

const functions = require('firebase-functions');

const google = require('googleapis');

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

  function sendUserReponseUpdate(assistant, needyUser) {

    const userResponses = [];

    console.log("We are in the send user response update and hopefully needy user: " + needyUser);

    admin.database().ref("/user-actions/" + needyUser + "/actions").once("value", function(snapshot){
      snapshot.forEach(function(childSnapshot) {
        var actionResponse = {};
        actionResponse.actionTitle = childSnapshot.val().actionTitle;
        actionResponse.responseTotal = childSnapshot.val().responseTotal;
        actionResponse.yesResponses = childSnapshot.val().yesResponses;
        userResponses.push(actionResponse);
      })
      console.log("How's the response array looking? " + userResponses[0].actionTitle);
      const responseTitle = userResponses[0].actionTitle;
      const responseCount = userResponses[0].responseTotal;
      const responseYesCount = userResponses[0].yesResponses;

      assistant.ask(assistant.buildRichResponse()
        .addSimpleResponse("Alright, here's an update on your first action.")
        .addBasicCard(assistant.buildBasicCard("Number of people who could respond: " + responseCount + ". Number of people who've said yes: " + responseYesCount)
          .setTitle("Your request: " + responseTitle)
          .addButton('Go To Chat')
        )
      )
      //assistant.tell("Do you want to hear responses for " + action);
    });
}

  const assistant = new Assistant({request: req, response: res});

  let actionMap = new Map();
  actionMap.set(MILK, milkHandler);
  actionMap.set(UPDATE, updateHandler);
  assistant.handleRequest(actionMap);

  function milkHandler (assistant) {
    const msg = "Contacting village now to get milk. Check back in 5 mins.";
    authHandler(assistant);
    writeNewAction(tokenArray, msg, needyUser);
    assistant.tell(msg);
  }

  function updateHandler (assistant) {
    sendUserReponseUpdate(assistant, needyUser);
  }

  function authHandler (assistant) {
    console.log("We are in the auth handler function.");

    const authToken = assistant.getUser().accessToken;

    console.log("We have an auth token: " + authToken);

    const OAuth2 = google.auth.OAuth2;
    const plus = google.plus('v1');


    // Todo: create a new json file that stores OAuth json.
    // Then require the file but never push to src.
    // Hard-coding now as it works (of course I removed my stuff though).
    const YOUR_CLIENT_ID = "Your client ID here.";

    const YOUR_CLIENT_SECRET = "Your client secret here.";

    const YOUR_REDIRECT_URL = "Your redirect here";

    const oauth2Client = new OAuth2(
      YOUR_CLIENT_ID,
      YOUR_CLIENT_SECRET,
      YOUR_REDIRECT_URL
    );

    oauth2Client.setCredentials({
      access_token: authToken
    })

    plus.people.get({
      userId: 'me',
      auth: oauth2Client
    }, function (err, response) {

      if (err) {
        console.log("Sad face we aren't getting user stuff: " + err);
      } else {
        console.log("Please be assistant user email: " + response.emails[0].value);

        const needyUserEmail = response.emails[0].value;
      }
    })
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
