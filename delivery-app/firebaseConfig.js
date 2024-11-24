import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBva7rWts4nfA2vSBiI2XPuE6D51RbSD-E",
  authDomain: "fooddeliveryapp-d843e.firebaseapp.com",
  projectId: "fooddeliveryapp-d843e",
  storageBucket: "fooddeliveryapp-d843e.appspot.com",
  messagingSenderId: "115776318133",
  appId: "1:115776318133:web:93171a40fdebc3fa90acfc",
};

// Check if Firebase app is already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
