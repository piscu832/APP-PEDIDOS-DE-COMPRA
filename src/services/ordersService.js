// src/services/ordersService.js
// Funciones para leer y escribir pedidos en Firestore

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "orders";

// --- Leer todos los pedidos ---
export const getOrders = async () => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// --- Crear un pedido nuevo ---
export const createOrder = async (orderData) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...orderData,
        createdAt: serverTimestamp(),
        deliveryDate: orderData.deliveryDate || "",
        status: "Pendiente",
    });
    return docRef.id;
};

// --- Actualizar un pedido ---
export const updateOrder = async (id, fields) => {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, fields);
};

// --- Eliminar un pedido ---
export const deleteOrder = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
};
