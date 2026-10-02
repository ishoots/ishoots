import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiyJOdYEfDeXDVEwWjmM1zZ-XPRwEVxlE",
  authDomain: "i-shoots.firebaseapp.com",
  databaseURL: "https://i-shoots-default-rtdb.firebaseio.com/",
  projectId: "i-shoots",
  storageBucket: "i-shoots.firebasestorage.app",
  messagingSenderId: "736152765136",
  appId: "1:736152765136:web:0036ebd9d60e9188d294d5"
};

// Initialize Firebase (singleton pattern for SSR and Fast Refresh support)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
export const database = rtdb; // Alias for convenience

export { app, firebaseConfig };
export default app;
