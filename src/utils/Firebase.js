// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "task-manager-2b2d4.firebaseapp.com",
  projectId: "task-manager-2b2d4",
  storageBucket: "task-manager-2b2d4.firebasestorage.app",
  messagingSenderId: "1087912192264",
  appId: "1:1087912192264:web:903e46cc5414dc090364bd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);