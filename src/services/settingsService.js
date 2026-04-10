import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

const SECTORS_COLLECTION = "sectors";

export const getSectors = async () => {
    const q = query(collection(db, SECTORS_COLLECTION), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addSector = async (name) => {
    const docRef = await addDoc(collection(db, SECTORS_COLLECTION), {
        name,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const deleteSector = async (id) => {
    await deleteDoc(doc(db, SECTORS_COLLECTION, id));
};
