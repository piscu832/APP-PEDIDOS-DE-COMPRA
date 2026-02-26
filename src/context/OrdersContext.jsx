import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getOrders,
    createOrder as fsCreateOrder,
    updateOrder as fsUpdateOrder,
    deleteOrder as fsDeleteOrder
} from '../services/ordersService';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to Firestore updates in real-time
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert Firestore Timestamp to readable date if it exists
                createdAt: doc.data().createdAt?.toDate
                    ? doc.data().createdAt.toDate().toLocaleDateString('es-AR')
                    : doc.data().createdAt || "Reciente"
            }));
            setOrders(ordersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateOrder = async (id, fields) => {
        try {
            await fsUpdateOrder(id, fields);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const deleteOrder = async (id) => {
        try {
            await fsDeleteOrder(id);
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const addOrder = async (orderData) => {
        try {
            await fsCreateOrder(orderData);
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    return (
        <OrdersContext.Provider value={{ orders, updateOrder, deleteOrder, addOrder, loading }}>
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = () => useContext(OrdersContext);
