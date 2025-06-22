// public/firebase-messaging-sw.js
// Use the compat version for service worker
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD2-HXgzymu28dkqtnsqry4AvRg3WqE0XE",
  authDomain: "makeit-5331f.firebaseapp.com",
  projectId: "makeit-5331f",
  storageBucket: "makeit-5331f.firebasestorage.app",
  messagingSenderId: "627259193257",
  appId: "1:627259193257:web:1db8741d4c672389d6f6b8",
  measurementId: "G-K1KG4JSTCJ"
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log("🌙 Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/turf_x.png", 
  });
});