import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getOrders,
    createOrder as fsCreateOrder,
    updateOrder as fsUpdateOrder,
    deleteOrder as fsDeleteOrder,
    getNextGlobalId
} from '../services/ordersService';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { logActivity } from '../services/activityService';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotifications();
    const { user } = useAuth();

    // Subscribe to Firestore updates in real-time
    useEffect(() => {
        if (!user) {
            setOrders([]);
            setLoading(false);
            return;
        }

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
    }, [user]);

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

            // Log activity
            if (user) {
                logActivity(user.uid, user.name, user.sector || 'S/S', 'Modificación de Pedido', `Editó el pedido #ORD-${order.orderNum}`);
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

            // Log activity
            if (user) {
                logActivity(user.uid, user.name, user.sector || 'S/S', 'Eliminación de Pedido', `Eliminó el pedido #ORD-${orderNum}`);
            }
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const addOrder = async (orderData) => {
        try {
            // Get a guaranteed sequential ID from the atomic counter
            const nextId = await getNextGlobalId();
            
            // Format logic: 0001 to 9999, then 1-0000, 1-0001...
            const cycle = Math.floor(nextId / 10000);
            const remainder = nextId % 10000;

            const orderNum = cycle === 0
                ? remainder.toString().padStart(4, '0')
                : `${cycle}-${remainder.toString().padStart(4, '0')}`;

            await fsCreateOrder({
                ...orderData,
                globalId: nextId,
                orderNum
            });
            showNotification(`Pedido #ORD-${orderNum} creado correctamente`, 'emerald');

            // Log activity
            if (user) {
                logActivity(user.uid, user.name, user.sector || 'S/S', 'Creación de Pedido', `Creó el pedido #ORD-${orderNum}`);
            }
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
