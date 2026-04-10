import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getSectors, addSector as fsAddSector, deleteSector as fsDeleteSector } from '../services/settingsService';
import { useNotifications } from './NotificationContext';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const defaultSectors = [
        "Mecanizado", "Pulido", "Grabado", "Lavado de cajas", 
        "Oficina técnica", "Dirección técnica", "Depósito", 
        "Comercio", "Dirección", "Reparación Cajas", 
        "Logística", "Reacondicionado"
    ];

    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotifications();

    useEffect(() => {
        const q = query(collection(db, "sectors"), orderBy("name", "asc"));
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (snapshot.empty) {
                // Return default list while initializing in background
                setSectors(defaultSectors.map((s, idx) => ({ id: 'def-'+idx, name: s })));
                setLoading(false);

                // Try to initialize Firestore with defaults
                console.log("Initializing sectors with defaults...");
                try {
                    for (const sector of defaultSectors) {
                        await fsAddSector(sector);
                    }
                } catch (e) {
                    console.warn("Could not write defaults to Firestore (check permissions):", e);
                }
            } else {
                const sectorsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSectors(sectorsData);
                setLoading(false);
            }
        }, (error) => {
            console.error("Error fetching sectors:", error);
            // Fallback to defaults on error
            setSectors(defaultSectors.map((s, idx) => ({ id: 'err-'+idx, name: s })));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addSector = async (name) => {
        try {
            if (sectors.some(s => s.name.toLowerCase() === name.toLowerCase())) {
                showNotification("El sector ya existe", "rose");
                return;
            }
            await fsAddSector(name);
            showNotification(`Sector ${name} agregado`, "emerald");
        } catch (error) {
            console.error("Error adding sector:", error);
            showNotification("Error al agregar sector", "rose");
        }
    };

    const deleteSector = async (id, name) => {
        try {
            await fsDeleteSector(id);
            showNotification(`Sector ${name} eliminado`, "blue");
        } catch (error) {
            console.error("Error deleting sector:", error);
            showNotification("Error al eliminar sector", "rose");
        }
    };

    return (
        <SettingsContext.Provider value={{ sectors, addSector, deleteSector, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
