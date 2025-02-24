"use strict";

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
/* global importScripts */

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");
var firebaseConfig = {
  apiKey: "AIzaSyCwFYUjj46OhyLj-3_h9TpdknGe0aCZjx0",
  projectId: "bantahchat",
  messagingSenderId: "1016928888312",
  appId: "1:1016928888312:web:f3004053e44e3c2047e20d"
};

try {
  if (!firebase) {
    throw new Error('Firebase SDK not found');
  }

  firebase.initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

var messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  var notificationTitle = payload.notification.title;
  var notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image
  };
  registration.showNotification(notificationTitle, notificationOptions);
});