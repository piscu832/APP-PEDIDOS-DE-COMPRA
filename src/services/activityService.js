import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "activity_logs";

export const logActivity = async (userId, userName, sector, action, details) => {
    try {
        await addDoc(collection(db, COLLECTION), {
            userId,
            userName,
            sector,
            action,
            details,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};

export const getActivityLogs = async () => {
    const q = query(collection(db, COLLECTION), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        // Format timestamp for display immediately if possible
        displayTime: d.data().timestamp?.toDate 
            ? d.data().timestamp.toDate().toLocaleString('es-AR') 
            : 'Reciente'
    }));
};
