import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    auth,
    db
} from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,
    updateProfile
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc
} from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Get additional user data from Firestore (like role)
                const docRef = doc(db, "users", firebaseUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        emailVerified: firebaseUser.emailVerified,
                        ...docSnap.data()
                    });
                } else {
                    // Fallback if firestore doc doesn't exist yet
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        emailVerified: firebaseUser.emailVerified,
                        name: firebaseUser.displayName || 'Usuario',
                        role: 'Operario'
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // --- REGISTER ---
    const register = async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // 1. Send verification email
            await sendEmailVerification(firebaseUser);

            // 2. Set profile name in Firebase Auth
            await updateProfile(firebaseUser, { displayName: name });

            // 3. Create user profile in Firestore
            await setDoc(doc(db, "users", firebaseUser.uid), {
                name: name,
                email: email,
                role: 'Operario', // Default role for new users
                createdAt: new Date().toISOString()
            });

            return { success: true, message: "Cuenta creada. Por favor verifica tu email para acceder." };
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };

    // --- LOGIN ---
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Check if email is verified
            if (!firebaseUser.emailVerified) {
                // You might want to re-send verification here or just alert them
                throw new Error("Por favor, verifica tu correo electrónico antes de ingresar.");
            }

            return { success: true };
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    };

    // --- LOGOUT ---
    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
