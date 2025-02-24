"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messaging = void 0;

var _app = require("firebase/app");

var _messaging = require("firebase/messaging");

var firebaseConfig = {
  apiKey: "AIzaSyD8bk57MfPgPmzRQU6fA2x89AZ4ldQlS80",
  authDomain: "backbook-370316.firebaseapp.com",
  projectId: "backbook-370316",
  storageBucket: "backbook-370316.appspot.com",
  messagingSenderId: "398150721140",
  appId: "1:398150721140:web:d93f0193496929a5037b21"
};
var app = (0, _app.initializeApp)(firebaseConfig);
var messaging = (0, _messaging.getMessaging)(app);
exports.messaging = messaging;