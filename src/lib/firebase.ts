import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD9JdLkx9PfyiRrX2WuGv3E0qWd2P5hwAM",
  authDomain: "archiver-8b6b7.firebaseapp.com",
  projectId: "archiver-8b6b7",
  storageBucket: "archiver-8b6b7.firebasestorage.app",
  messagingSenderId: "949937047298",
  appId: "1:949937047298:web:0a1dd7dc3df76fb841641b",
  measurementId: "G-30P1XXJD8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);