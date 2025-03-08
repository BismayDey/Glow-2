import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAi1zYKoCpve3zeW3eOALu-KE6DHuvr9H4",
  authDomain: "glow-9c654.firebaseapp.com",
  projectId: "glow-9c654",
  storageBucket: "glow-9c654.firebasestorage.app",
  messagingSenderId: "83250429978",
  appId: "1:83250429978:web:d501f679f086f95a5491a3",
  measurementId: "G-VDP6CST87K"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);