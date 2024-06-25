import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-app-382ae.firebaseapp.com",
  projectId: "react-chat-app-382ae",
  storageBucket: "react-chat-app-382ae.appspot.com",
  messagingSenderId: "569539392821",
  appId: "1:569539392821:web:a2918960cda7895a5c487c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
