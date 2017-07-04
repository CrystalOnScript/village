process.env.DEBUG = 'actions-on-google:*';
//const ApiAiApp = require('actions-on-google').ApiAiApp;
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

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
  console.log("Messaging token: " + req.body.messagetoken);
});

// Sets an initial port.
const PORT = process.env.PORT || 8080;

// Listener.
expressApp.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});

module.exports = expressApp;