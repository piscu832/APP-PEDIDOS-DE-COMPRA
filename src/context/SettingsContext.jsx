import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getSectors, addSector as fsAddSector, deleteSector as fsDeleteSector } from '../services/settingsService';
import { useNotifications } from './NotificationContext';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotifications();

    const defaultSectors = [
        "Mecanizado", "Pulido", "Grabado", "Lavado de cajas", 
        "Oficina técnica", "Dirección técnica", "Depósito", 
        "Comercio", "Dirección", "Reparación Cajas", 
        "Logística", "Reacondicionado"
    ];

    useEffect(() => {
        const q = query(collection(db, "sectors"), orderBy("name", "asc"));
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (snapshot.empty) {
                // Initialize with defaults if empty
                console.log("Initializing sectors with defaults...");
                for (const sector of defaultSectors) {
                    await fsAddSector(sector);
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
