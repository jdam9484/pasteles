// src/firebase/config.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfb5pCmLEbfST_78M5hBJbXofzp2zFDYU",
  authDomain: "pasteleria-f868c.firebaseapp.com",
  projectId: "pasteleria-f868c",
  storageBucket: "pasteleria-f868c.firebasestorage.app",
  messagingSenderId: "287443071922",
  appId: "1:287443071922:web:c92910b83cf275c244eaab",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
