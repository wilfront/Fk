// src/lib/firebase.js (VERSÃO CORRIGIDA)

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 🚨 NOVO: Importa o Firestore

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializa o App Principal (Garante que só é inicializado uma vez)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🚨 NOVO: Inicializa o Firestore
export const db = getFirestore(app); 

let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

// 🚨 ATUALIZAÇÃO: Mantém as exportações existentes
export { app, analytics }; 
// Note: O 'db' já está sendo exportado na linha acima: export const db = getFirestore(app);