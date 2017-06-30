// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

process.env.DEBUG = 'actions-on-google:*';
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const express = require('express');
const bodyParser = require('body-parser');

// Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');

const NO_INPUTS = ['I didn\'t hear that.', 'If you\'re still there, please repeat that.', 'See you next time.'];

const expressApp = express();
expressApp.set('port', (process.env.PORT || 8080));
expressApp.use(bodyParser.json({type: 'application/json'}));

expressApp.post('/', (request, response) => {
  console.log('handle post');
});
// [END YourAction]

exports.expressApp = functions.https.onRequest((req, res) => {
  console.log("we are in weird export function thingy");
  const app = new ActionsSdkApp({request: req, response: res});

  function mainIntent (app) {
    console.log('mainIntent');
    let inputPrompt = app.buildInputPrompt(false,
    'Herald here to help. Do you need some milk, medicine, or ice?');
    app.ask(inputPrompt);
  }

  function getArgument (app) {
    console.log('getArgument');
    if (app.getArgument() === 'I need milk') {
      app.tell("I'll reach out to the village to see if someone can get you milk. Reconnect wth me in 5 minutes.");
    } else {
      app.mappedInput = app.getArgument();
    }
  }

  function rawInput (app) {
    console.log('rawInput');
    if (app.getRawInput() === 'quit') {
      app.tell('Goodbye!');
    } else {
      app.mappedInput = app.getRawInput();
    }
  }

  const actionMap = new Map();
  actionMap.set(app.StandardIntents.MAIN, mainIntent);
  actionMap.set(app.StandardIntents.ASK_HELP, getArgument);
  actionMap.set(app.StandardIntents.TEXT, rawInput);

  app.handleRequest(actionMap);
});