import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SideDrawer from '../components/SideDrawer';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrdersContext';

// Today's date in YYYY-MM-DD, always up to date at render time
const todayISO = () => new Date().toISOString().split('T')[0];

// --- Edit Order Modal ---
const EditOrderModal = ({ order, onSave, onClose }) => {
    const [form, setForm] = useState({
        item: order.item,
        entity: order.entity,
        detail: order.detail,
        // default to today if not already set, so picker opens on current date
        deliveryDate: order.deliveryDate || todayISO(),
    });

    const dateRef = useRef(null);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const openDatePicker = () => {
        if (dateRef.current) {
            // showPicker() is supported in Chrome/Edge 99+, Firefox 101+
            try { dateRef.current.showPicker(); }
            catch { dateRef.current.click(); }   // fallback for older browsers
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white dark:bg-[#161e2a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <p className="font-mono text-[10px] font-bold text-slate-400 uppercase">Editando pedido</p>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">#ORD-{order.id}</h2>
                    </div>
                    <button onClick={onClose} className="size-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 py-5 space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Producto / Insumo</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">inventory_2</span>
                            <input
                                name="item"
                                value={form.item}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Solicitante</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                            <input
                                name="entity"
                                value={form.entity}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Proveedor Recomendado</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">storefront</span>
                            <input
                                name="detail"
                                value={form.detail}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                                placeholder="Nombre del proveedor"
                            />
                        </div>
                    </div>

                    {/* Delivery date — admin-only field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                            Fecha de Entrega Estimada
                        </label>
                        <div className="relative">
                            {/* Clickable calendar icon — triggers the hidden date picker */}
                            <button
                                type="button"
                                onClick={openDatePicker}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors z-10"
                                title="Abrir calendario"
                            >
                                <span className="material-symbols-outlined text-lg">event</span>
                            </button>
                            <input
                                ref={dateRef}
                                name="deliveryDate"
                                type="date"
                                value={form.deliveryDate}
                                min={todayISO()}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 h-12 bg-slate-50 dark:bg-slate-900 border border-blue-500/40 dark:border-blue-500/30 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined text-lg">save</span>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Dashboard ---
const Dashboard = () => {
    const { user } = useAuth();
    const { toggleTheme } = useTheme();
    const { orders, updateOrder, deleteOrder } = useOrders();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const navigate = useNavigate();

    const isAdmin = user?.role === 'Administrador';

    const stats = [
        { label: 'Activos', value: '482', change: '+5.2%', borderColor: '#2563eb' },
        { label: 'Pendientes', value: '018', change: 'REVISAR', borderColor: '#f59e0b' }
    ];

    const handleSave = (updatedFields) => {
        updateOrder(editingOrder.id, updatedFields);
        setEditingOrder(null);
    };

    const handleDelete = (id) => {
        deleteOrder(id);
    };

    // Format stored ISO date (YYYY-MM-DD) to display (DD/MM/YYYY)
    const formatDate = (iso) => {
        if (!iso) return null;
        const [y, m, d] = iso.split('-');
        return `${d}/${m}/${y}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fdfdfd] dark:bg-[#0a0f16]">
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0a0f16]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMenuOpen(true)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">menu</span>
                    </button>
                    <Logo size="md" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">ADMINISTRACIÓN CENTRAL</span>
                </div>
                <button onClick={toggleTheme} className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined">contrast</span>
                </button>
            </header>

            <main className="relative px-4 py-6 max-w-7xl mx-auto w-full pb-32">
                {/* Search bar */}
                <div className="mb-6 flex gap-2">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input className="w-full pl-10 pr-4 h-11 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white outline-none" placeholder="Filtrar pedidos..." type="text" />
                    </div>
                    <button className="size-11 flex items-center justify-center bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>

                {/* Title + badge */}
                <div className="mb-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-slate-900 dark:bg-blue-600 text-white px-2 py-0.5 rounded uppercase">Root_Privileges</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded border border-emerald-100 dark:border-emerald-500/20">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Data_Sync_OK</span>
                        </div>
                        {/* Role badge */}
                        {isAdmin && (
                            <span className="font-mono text-[10px] font-bold bg-blue-600/10 text-blue-600 border border-blue-600/20 px-2 py-0.5 rounded uppercase">Admin</span>
                        )}
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">Gestión de Pedidos</h1>
                    <p className="text-sm text-slate-500 font-medium">Control total de logística y reportes operativos.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-[#161e2a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 shadow-sm" style={{ borderLeftColor: stat.borderColor }}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                                <span className="font-mono text-[10px] text-emerald-600 font-bold">{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order cards */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    {/* Order ID + creation date + status */}
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <p className="font-mono text-[11px] font-bold text-slate-400">#ORD-{order.id}</p>
                                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                            <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                                            {order.createdAt}
                                        </span>
                                        <span className="font-mono text-[9px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-1.5 py-0.5 rounded uppercase border border-amber-100 dark:border-amber-500/20">Pendiente</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{order.item}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{order.entity} • <span className="italic">{order.detail}</span></p>

                                    {/* Delivery date badge — shown when set */}
                                    {order.deliveryDate && (
                                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full">
                                            <span className="material-symbols-outlined text-blue-600 text-[13px]">local_shipping</span>
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Entrega: {formatDate(order.deliveryDate)}</span>
                                        </div>
                                    )}
                                </div>

                                <button className="text-slate-400 hover:text-blue-600 transition-colors ml-2 shrink-0">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>

                            {/* Action buttons row */}
                            <div className={`px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 grid gap-2 text-center ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>

                                {/* --- FECHA ENTREGA: admin only --- */}
                                {isAdmin && (
                                    <button
                                        onClick={() => setEditingOrder(order)}
                                        className="py-2 bg-blue-600/10 border border-blue-600/20 rounded-lg text-blue-600 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-blue-600/20 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">event</span>
                                        Fecha
                                    </button>
                                )}

                                {/* --- EDITAR: admin only --- */}
                                {isAdmin && (
                                    <button
                                        onClick={() => setEditingOrder(order)}
                                        className="py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">edit</span>
                                        Editar
                                    </button>
                                )}

                                {/* --- BORRAR: both roles --- */}
                                <button
                                    onClick={() => handleDelete(order.id)}
                                    className="py-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                    Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAB */}
                <button
                    onClick={() => navigate('/new-order')}
                    className="fixed bottom-24 right-6 size-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </main>

            {/* Edit modal */}
            {editingOrder && (
                <EditOrderModal
                    order={editingOrder}
                    onSave={handleSave}
                    onClose={() => setEditingOrder(null)}
                />
            )}

            <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />

            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-6 pt-3 pb-8 flex justify-around items-center z-50">
                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-blue-600">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-[9px] font-bold uppercase">Panel</span>
                </button>
                <button onClick={() => navigate('/operator')} className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined">receipt_long</span>
                    <span className="text-[9px] font-bold uppercase">Pedidos</span>
                </button>
                <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-[9px] font-bold uppercase">Config</span>
                </button>
            </nav>
        </div>
    );
};

export default Dashboard;
