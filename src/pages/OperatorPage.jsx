import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import SideDrawer from '../components/SideDrawer';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';

const OperatorPage = () => {
    const { user } = useAuth();
    const { orders, deleteOrder } = useOrders();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Filter shared orders to show only those belonging to the logged-in user
    const myOrders = orders.filter(o =>
        o.entity === user?.name &&
        (o.item.toLowerCase().includes(search.toLowerCase()) ||
            (o.orderNum && o.orderNum.toString().includes(search)) ||
            (o.id.includes(search)))
    );

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este pedido?")) {
            deleteOrder(id);
        }
    };

    const getPriorityStyles = (priority) => {
        const variants = {
            'Baja': "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            'Media': "bg-amber-500/10 text-amber-500 border-amber-500/20",
            'Alta': "bg-rose-500/10 text-rose-500 border-rose-500/20"
        };
        return variants[priority] || variants['Baja'];
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0a0f16] text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-x-hidden">
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0a0f16]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMenuOpen(true)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">menu</span>
                    </button>
                    <Logo size="sm" />
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold tracking-widest text-[10px] uppercase text-slate-500 dark:text-slate-400">MIS PEDIDOS</span>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter -mt-0.5">{myOrders.length} REGISTRADOS</span>
                </div>
                <div className="size-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500">receipt_long</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col pt-6 px-5 space-y-4 max-w-[480px] mx-auto w-full z-10 pb-40">
                {/* Search Bar */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 h-11 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Buscar en mis pedidos..."
                            type="text"
                        />
                    </div>
                </div>

                {/* Orders List */}
                {myOrders.length > 0 ? (
                    myOrders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-[#161e2a] rounded-[28px] p-6 relative border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.01]">
                            <div className="flex justify-between items-start mb-5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-white/40">
                                        <span className="material-symbols-outlined text-[14px]">id_card</span> #ORD-{order.orderNum}
                                    </div>
                                    <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight mb-0.5">
                                        {order.item}
                                    </h3>
                                    <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">{order.createdAt}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest min-w-[75px] text-center border ${getPriorityStyles(order.priority)}`}>
                                    {order.priority}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-slate-100 dark:border-white/5">
                                <div>
                                    <p className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] font-bold mb-1">CANTIDAD</p>
                                    <p className="text-slate-900 dark:text-white font-mono text-lg font-bold">{order.quantity} {order.unit}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] font-bold mb-1">CÓDIGO</p>
                                    <p className="text-slate-900 dark:text-white font-mono text-lg font-bold">{order.code}</p>
                                </div>
                            </div>

                            {order.deliveryDate && (
                                <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-blue-600/10 border border-blue-600/20 rounded-xl">
                                    <span className="material-symbols-outlined text-blue-600 text-sm">local_shipping</span>
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Entrega: {order.deliveryDate.split('-').reverse().join('/')}</span>
                                </div>
                            )}

                            {/* Actions and Supplier info */}
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] font-bold mb-1">PROVEEDOR</p>
                                    <p className="text-slate-700 dark:text-slate-200 text-xs font-semibold">{order.supplier || "No asignado"}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(order.id)}
                                    className="size-10 flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                    title="Eliminar pedido"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                        <span className="material-symbols-outlined text-4xl opacity-20">receipt_long</span>
                        <p className="text-sm font-medium">No tienes pedidos registrados.</p>
                    </div>
                )}
            </main>

            <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />
            <BottomNav active="operator" />
        </div>
    );
};

export default OperatorPage;
