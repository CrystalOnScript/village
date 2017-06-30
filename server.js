process.env.DEBUG = 'actions-on-google:*';
const ApiAiApp = require('actions-on-google').ApiAiApp;
const express = require("express");

// API.AI actions
const UNRECOGNIZED_DEEP_LINK = 'deeplink.unknown';
const ASK_HELP = 'ask.help';

// API.AI parameter names
const CATEGORY_ARGUMENT = 'category';

// Include Server Dependencies
const expressApp = express();
const bodyParser = require("body-parser");

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.text());
expressApp.use(bodyParser.json({ type: "application/vnd.api+json" }));

expressApp.use(express.static("./public"));

// Main "/" Route. Redirects user to rendered React application.
expressApp.get("*", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

exports.villageApp = (request, response) => {
  const app = new App({ request, response });
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  const actionMap = new Map();
  actonMap.set(WELCOME_INTENT)
  actionMap.set(UNKNOWN_INTENT);
  actionMap.set(ASK_HELP);

    // Fulfill action business logic
  function responseHandler (app) {
    // Complete your fulfillment logic and send a response
    app.ask('Hello, World!');
  }

  app.handleRequest(actionMap, responseHandler);
};

expressApp.post('/', (request, response) => {
  const app = new ApiAiApp({request: request, response: response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(response.body));
  const WELCOME_INTENT = 'input.welcome';
  const UNKNOWN_INTENT = 'input.unknown';
  const ASK_INTENT = 'input.ask';


  const welcomeIntent = (app) => {
    console.log('welcomeIntent');
  };

  const unknownIntent = (app) => {
    console.log('unknownIntent: ' + app.getRawInput());
  };

  const askIntent = (app) => {
    console.log('askIntent');
  };

  const actionMap = new Map();
  actionMap.set(WELCOME_INTENT, welcomeIntent);
  actionMap.set(UNKNOWN_INTENT, unknownIntent);
  actionMap.set(ASK_INTENT, askIntent);

});

// Sets an initial port.
const PORT = process.env.PORT || 8080;
// Listener.
expressApp.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});

module.exports = expressApp;