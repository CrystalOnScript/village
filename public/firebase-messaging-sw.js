// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD-np5USZAOXmA51TB8EmNcPPYCnffOmjI",
  authDomain: "villageapp-6bbe4.firebaseapp.com",
  databaseURL: "https://villageapp-6bbe4.firebaseio.com",
  projectId: "villageapp-6bbe4",
  storageBucket: "villageapp-6bbe4.appspot.com",
  messagingSenderId: "955973472886"
};
firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message title: ', payload.notificationTitle);

  console.log('[firebase-messaging-sw.js] Received background message body object: ', JSON.parse(payload.notificationOptions);
  // Customize notification here

  return self.registration.showNotification(payload.notificationTitle, JSON.parse(payload.notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const myPromise = new Promise(function(resolve, reject) {

      console.log("User clicked action on notification.");

    // Once finished, call resolve() or  reject().
    resolve();
  });

  event.waitUntil(myPromise);

  // Do something as the result of the notification click
});

self.addEventListener('notificationclose', function(event) {
  // Do something as the result of the notification close

  console.log("User closed notification");

});
