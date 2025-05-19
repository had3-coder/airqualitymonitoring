// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBawdAvivw24kEJJcZ8pjOVKLnUCPlWxig",
  authDomain: "project-aqi-43620.firebaseapp.com",
  projectId: "project-aqi-43620",
  storageBucket: "project-aqi-43620.firebasestorage.app",
  messagingSenderId: "853048957452",
  appId: "1:853048957452:web:51b30fd41cab4658cdec29",
  measurementId: "G-MVKRVKVVB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);