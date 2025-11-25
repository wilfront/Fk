// src/lib/firebaseAdmin.js (AJUSTADO)

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

// 🚨 MUDANÇA CRÍTICA: Use exportação nomeada
export const AdminApp = admin; // Você pode exportá-lo com um nome claro