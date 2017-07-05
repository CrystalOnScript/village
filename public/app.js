var config = {
  apiKey: "AIzaSyC6UWBWM3mswRaLQFj-oDxSPmRTnbHWvjg",
  authDomain: "yourvillage-bbea7.firebaseapp.com",
  databaseURL: "https://yourvillage-bbea7.firebaseio.com",
  projectId: "yourvillage-bbea7",
  storageBucket: "yourvillage-bbea7.appspot.com",
  messagingSenderId: "103953800507"
};
firebase.initializeApp(config);
// const admin = require("firebase-admin");
  // [START get_messaging_object]
  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();

  messaging.requestPermission()
  .then(function(){
    console.log("Permission Granted");
    return messaging.getToken(function(){
      console.log("called me", token)
    });
  })
  .then(function(token){
    console.log("token", token);

  })
  .catch(function(err){
    console.log("No Permission")
  });

  messaging.onMessage(function(payload){
    console.log('onMessage: ', payload);
  });
