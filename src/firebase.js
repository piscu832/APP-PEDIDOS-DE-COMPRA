// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAANWLnx_-uBspIpgDtjHTX2KkXjQGZEwQ",
    authDomain: "app-pedidos-de-compra.firebaseapp.com",
    projectId: "app-pedidos-de-compra",
    storageBucket: "app-pedidos-de-compra.firebasestorage.app",
    messagingSenderId: "495895458027",
    appId: "1:495895458027:web:96de70a5d373eccea9ceae",
    measurementId: "G-RG1TVWTCDM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
