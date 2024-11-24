import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBya7WtfS4nfA2vSBt1ZXPuE6D51RbSD-E",
  authDomain: "fooddeliveryapp-d843e.firebaseapp.com",
  projectId: "fooddeliveryapp-d843e",
  storageBucket: "fooddeliveryapp-d843e.appspot.com",
  messagingSenderId: "115776318133",
  appId: "1:115776318133:web:93171a40fdebc3fa90acfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };
