// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdWuHmvTiOZTGrD9pqpworx4rTQ9bsH1I",
  authDomain: "react-notes-9ab28.firebaseapp.com",
  projectId: "react-notes-9ab28",
  storageBucket: "react-notes-9ab28.firebasestorage.app",
  messagingSenderId: "753966426699",
  appId: "1:753966426699:web:6130484d563addfe823bce",
  measurementId: "G-DQ4E6PF8V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Export supaya bisa dipakai di file lain
export const auth = getAuth(app);
export const db = getFirestore(app);