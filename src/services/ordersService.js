// src/services/ordersService.js
// Funciones para leer y escribir pedidos en Firestore

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    query,
    orderBy,
    runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "orders";
const COUNTER_DOC = "metadata/orderCounter";

// --- Get next sequential ID (atomic) ---
export const getNextGlobalId = async () => {
    const counterRef = doc(db, "metadata", "orderCounter");
    let nextId = 1;

    await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists()) {
            transaction.set(counterRef, { lastId: 1 });
            nextId = 1;
        } else {
            nextId = counterDoc.data().lastId + 1;
            transaction.update(counterRef, { lastId: nextId });
        }
    });

    return nextId;
};

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
