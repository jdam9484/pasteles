// src/firebase/config.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAfb5pCmLEbfST_78M5hBJbXofzp2zFDYU",
  authDomain: "pasteleria-f868c.firebaseapp.com",
  projectId: "pasteleria-f868c",
  storageBucket: "pasteleria-f868c.firebasestorage.app",
  messagingSenderId: "287443071922",
  appId: "1:287443071922:web:c92910b83cf275c244eaab",
};

// Evita inicializar dos veces (útil en React/Vite con HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Exporta lo que vas a usar en tu app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
