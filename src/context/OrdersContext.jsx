import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getOrders,
    createOrder as fsCreateOrder,
    updateOrder as fsUpdateOrder,
    deleteOrder as fsDeleteOrder
} from '../services/ordersService';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useNotifications } from './NotificationContext';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotifications();

    // Subscribe to Firestore updates in real-time
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id, // Ensure Firestore ID is the main 'id'
                    orderNum: data.orderNum || data.id || "0000", // Fallback for the visible number
                    createdAt: data.createdAt?.toDate
                        ? data.createdAt.toDate().toLocaleDateString('es-AR')
                        : data.createdAt || "Reciente"
                };
            });
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
            const order = orders.find(o => o.id === id);
            await fsUpdateOrder(id, fields);

            if (fields.deliveryDate && !order.deliveryDate) {
                showNotification(`Nueva fecha establecida para #ORD-${order.orderNum}`, 'blue');
            } else if (['Entregado', 'Finalizado', 'Otro Motivo'].includes(fields.status)) {
                showNotification(`Pedido #ORD-${order.orderNum} finalizado`, 'emerald');
            } else {
                showNotification(`Pedido #ORD-${order.orderNum} modificado`, 'blue');
            }
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const deleteOrder = async (id) => {
        try {
            const orderIndex = orders.findIndex(o => o.id === id);
            if (orderIndex === -1) return;
            const orderNum = orders[orderIndex].orderNum;

            await fsDeleteOrder(id);
            showNotification(`Pedido #ORD-${orderNum} eliminado correctamente`, 'rose');
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const getNextOrderDetails = () => {
        // Find the highest globalId in existing orders
        const maxId = orders.reduce((max, o) => Math.max(max, o.globalId || 0), 0);
        const nextId = maxId + 1;

        // Numbering Logic: 0001 to 9999, then 1-0000, 1-0001...
        const cycle = Math.floor(nextId / 10000);
        const remainder = nextId % 10000;

        const orderNum = cycle === 0
            ? remainder.toString().padStart(4, '0')
            : `${cycle}-${remainder.toString().padStart(4, '0')}`;

        return { globalId: nextId, orderNum };
    };

    const addOrder = async (orderData) => {
        try {
            const { globalId, orderNum } = getNextOrderDetails();
            await fsCreateOrder({
                ...orderData,
                globalId,
                orderNum
            });
            showNotification(`Pedido #ORD-${orderNum} creado correctamente`, 'emerald');
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
