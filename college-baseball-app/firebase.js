// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUFQlyqFJv80h2PvyA5O5sKHbIXRjgRf8",
  authDomain: "college-baseball-stats.firebaseapp.com",
  projectId: "college-baseball-stats",
  storageBucket: "college-baseball-stats.appspot.com",
  messagingSenderId: "513193418557",
  appId: "1:513193418557:web:86b41c50807fa3bda56f54",
  measurementId: "G-8EZ64LEV5Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const functions = getFunctions(app);

export { firestore, functions };