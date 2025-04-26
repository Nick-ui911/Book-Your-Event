// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB4yXiZb62DZbVFM8W8UqRKSBPLHEfcNh8",
  authDomain: "bookevent-d1d71.firebaseapp.com",
  projectId: "bookevent-d1d71",
  storageBucket: "bookevent-d1d71.firebasestorage.app",
  messagingSenderId: "83710566614",
  appId: "1:83710566614:web:8b8e08ca6e1ca2bf41a977",
  measurementId: "G-2VVJ7JKL2E"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();