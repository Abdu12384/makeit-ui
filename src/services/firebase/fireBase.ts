// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2-HXgzymu28dkqtnsqry4AvRg3WqE0XE",
  authDomain: "makeit-5331f.firebaseapp.com",
  projectId: "makeit-5331f",
  storageBucket: "makeit-5331f.firebasestorage.app",
  messagingSenderId: "627259193257",
  appId: "1:627259193257:web:1db8741d4c672389d6f6b8",
  measurementId: "G-K1KG4JSTCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, analytics, messaging };
