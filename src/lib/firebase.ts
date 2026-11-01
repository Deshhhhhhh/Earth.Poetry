import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjrF-tJ8xcZjhZ1T7QnqQ9fskeyNjaEQ4",
  authDomain: "top-state-c6ppv.firebaseapp.com",
  projectId: "top-state-c6ppv",
  storageBucket: "top-state-c6ppv.firebasestorage.app",
  messagingSenderId: "873976988368",
  appId: "1:873976988368:web:3f3525772398cfcb18d4d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
const db = getFirestore(app, "ai-studio-e26741ef-797a-4b07-91a7-92b5b39be162");

export { db, collection, addDoc, serverTimestamp };
