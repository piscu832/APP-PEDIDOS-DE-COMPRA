// src/firebase.js
// -------------------------------------------------
//  INSTRUCCIONES PARA CONFIGURAR FIREBASE:
//
//  1. Ve a https://console.firebase.google.com/
//  2. Crea un nuevo proyecto (o usa uno existente).
//  3. Haz click en "Agregar app" → Web (icono </>).
//  4. Copia los valores de "firebaseConfig" que te dan
//     y reemplaza los campos AQUÍ ABAJO.
//  5. En la consola de Firebase:
//       - Habilita "Authentication" → Email/Contraseña
//       - Habilita "Firestore Database" → modo producción
// -------------------------------------------------

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
