// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add your Firebase project configuration here
const firebaseConfig = {
  "projectId": "resumerank-ai-1fsl9",
  "appId": "1:513233036083:web:5d7a208489fd27c264d446",
  "storageBucket": "resumerank-ai-1fsl9.firebasestorage.app",
  "apiKey": "AIzaSyDuXKLjjy1EFi5sexwrTebGhTmAoXB9IdQ",
  "authDomain": "resumerank-ai-1fsl9.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "513233036083"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
