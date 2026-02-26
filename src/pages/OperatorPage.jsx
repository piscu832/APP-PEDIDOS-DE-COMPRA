import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SideDrawer from '../components/SideDrawer';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';

const OperatorPage = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const orders = [
        { id: "ORD-4841", date: "17/10/2024", item: "Embalaje Estándar", qty: "200 CJAS", code: "BX-ST-500", priority: "Baja", color: "emerald", priorityLevel: 1 },
        { id: "ORD-4835", date: "16/10/2024", item: "Tornillería Tit. Grado 5", qty: "1200 PCS", code: "SC-TI-005", priority: "Media", color: "amber", priorityLevel: 2 },
        { id: "ORD-4829", date: "15/10/2024", item: "Kit de Prótesis Rodilla K2", qty: "50 UDS", code: "PR-KD-202", priority: "Alta", color: "rose", priorityLevel: 3 },
    ].sort((a, b) => b.priorityLevel - a.priorityLevel);

    const getPriorityStyles = (color) => {
        const variants = {
            emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            rose: "bg-rose-500/10 text-rose-500 border-rose-500/20"
        };
        return variants[color] || variants.emerald;
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-x-hidden">
            <div className="fixed top-0 left-0 w-full h-full dot-grid opacity-20 pointer-events-none z-0"></div>

            <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center px-6 py-4 justify-between">
                    <button onClick={() => setIsMenuOpen(true)} className="material-symbols-outlined text-slate-500 dark:text-white/70">menu</button>
                    <div className="flex flex-col items-center gap-1">
                        <Logo size="sm" />
                    </div>
                    <span className="relative">
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-600"></span>
                        <span className="material-symbols-outlined text-slate-500 dark:text-white/70">notifications</span>
                    </span>
                </div>
            </header>

            <main className="flex-1 flex flex-col pt-6 px-5 space-y-4 max-w-lg mx-auto w-full z-10 pb-40">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input className="w-full pl-10 pr-4 h-11 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Buscar pedido..." type="text" />
                    </div>
                    <button className="size-11 flex items-center justify-center bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400">
                        <span className="material-symbols-outlined">filter_alt</span>
                    </button>
                </div>

                {orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[28px] p-6 relative border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:scale-[1.01]">
                        <div className="flex justify-between items-start mb-5">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-white/40">
                                    <span className="material-symbols-outlined text-[14px]">inventory_2</span> PRODUCTO
                                </div>
                                <h3 className="text-slate-900 dark:text-white text-xl font-mono font-extrabold tracking-tight">
                                    {order.id} <span className="text-slate-200 dark:text-white/20 mx-1">|</span> <span className="text-blue-600">{order.date}</span>
                                </h3>
                                <p className="text-slate-600 dark:text-white/70 text-sm font-medium">{order.item}</p>
                            </div>
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest min-w-[75px] text-center border ${getPriorityStyles(order.color)}`}>
                                {order.priority}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-slate-100 dark:border-white/5">
                            <div>
                                <p className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] font-bold mb-1">CANTIDAD</p>
                                <p className="text-slate-900 dark:text-white font-mono text-lg font-bold">{order.qty}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] font-bold mb-1">CÓDIGO</p>
                                <p className="text-slate-900 dark:text-white font-mono text-lg font-bold">{order.code}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />
            <BottomNav active="operator" />
        </div>
    );
};

export default OperatorPage;
