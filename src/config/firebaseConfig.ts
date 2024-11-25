import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";

const firebaseConfig: { 
  apiKey: string; 
  authDomain: string; 
  projectId: string; 
  storageBucket: string; 
  messagingSenderId: string; 
  appId: string; 
} = {
  apiKey: "AIzaSyBya7WtfS4nfA2vSBt1ZXPuE6D51RbSD-E",
  authDomain: "fooddeliveryapp-d843e.firebaseapp.com",
  projectId: "fooddeliveryapp-d843e",
  storageBucket: "fooddeliveryapp-d843e.appspot.com",
  messagingSenderId: "115776318133",
  appId: "1:115776318133:web:93171a40fdebc3fa90acfc"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db: Firestore = getFirestore(app);

const auth: Auth = getAuth(app);

export { db, auth };
