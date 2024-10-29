// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6dJrJ6lOXnmF58Fup4dkZirL4k4VnjpQ",
  authDomain: "didaskai.firebaseapp.com",
  projectId: "didaskai",
  storageBucket: "didaskai.appspot.com",
  messagingSenderId: "651016684632",
  appId: "1:651016684632:web:d757b0a3a2d8d1db09f62d",
  measurementId: "G-BGG3MPTMZ1"
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);

export default firebase_app