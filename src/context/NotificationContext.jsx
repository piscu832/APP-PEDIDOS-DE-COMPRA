import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [enabled, setEnabled] = useState(() => {
        const saved = localStorage.getItem('notifications_enabled');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('notifications_enabled', JSON.stringify(enabled));
    }, [enabled]);

    const showNotification = (message, type = 'blue') => {
        if (!enabled) return;

        const id = Math.random().toString(36).substr(2, 9);
        setNotifications(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification, enabled, setEnabled }}>
            {children}

            {/* Notification Portal */}
            <div className="fixed top-4 right-4 z-[999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            className={`min-w-[280px] p-4 rounded-2xl shadow-2xl border-l-4 flex items-center gap-3 pointer-events-auto bg-white dark:bg-[#161e2a] border-slate-200 dark:border-slate-800
                                ${n.type === 'blue' ? 'border-l-blue-600' :
                                    n.type === 'amber' ? 'border-l-amber-500' :
                                        n.type === 'rose' ? 'border-l-rose-500' : 'border-l-emerald-500'}`}
                        >
                            <div className={`size-8 rounded-full flex items-center justify-center
                                ${n.type === 'blue' ? 'bg-blue-600/10 text-blue-600' :
                                    n.type === 'amber' ? 'bg-amber-500/10 text-amber-500' :
                                        n.type === 'rose' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                <span className="material-symbols-outlined text-lg">
                                    {n.type === 'blue' ? 'info' :
                                        n.type === 'amber' ? 'priority_high' :
                                            n.type === 'rose' ? 'delete_forever' : 'check_circle'}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{n.message}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
