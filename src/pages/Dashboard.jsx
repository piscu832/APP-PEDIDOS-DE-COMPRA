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
        supplier: order.supplier || '',
        deliveryDate: order.deliveryDate || '',
        status: order.status || 'Pendiente',
        reason: order.reason || '',
    });

    const dateRef = useRef(null);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const openDatePicker = () => {
        if (dateRef.current) {
            try { dateRef.current.showPicker(); }
            catch { dateRef.current.click(); }
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-[#161e2a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <p className="font-mono text-[10px] font-bold text-slate-400 uppercase">Editando pedido</p>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">#ORD-{order.orderNum}</h2>
                    </div>
                    <button onClick={onClose} className="size-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Producto / Insumo</label>
                        <input name="item" value={form.item} onChange={handleChange} className="w-full px-4 h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Estado</label>
                            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none">
                                <option value="Pendiente">Pendiente</option>
                                <option value="Entregado">Entregado</option>
                                <option value="Finalizado">Finalizado</option>
                                <option value="Otro Motivo">Otro Motivo...</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-1">Fecha Entrega</label>
                            <div className="relative">
                                <input ref={dateRef} name="deliveryDate" type="date" value={form.deliveryDate} min={todayISO()} onChange={handleChange} className="w-full pl-4 pr-10 h-12 bg-slate-50 dark:bg-slate-900 border border-blue-500/30 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40" />
                                <button type="button" onClick={openDatePicker} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"><span className="material-symbols-outlined text-lg">calendar_month</span></button>
                            </div>
                        </div>
                    </div>

                    {form.status === 'Otro Motivo' && (
                        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 ml-1">Detalle del motivo</label>
                            <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Explique la razón del cierre del pedido..." className="w-full p-4 bg-rose-50/30 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/40 min-h-[80px]" />
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6 flex gap-3">
                    <button onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm uppercase tracking-wider">Cancelar</button>
                    <button onClick={() => onSave(form)} className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">Guardar Cambios</button>
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
    const [activeTab, setActiveTab] = useState('Pendientes');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const isAdmin = user?.role === 'Administrador';

    // Helper: Determine order category based on status and delivery date
    const isFinished = (o) => ['Entregado', 'Finalizado', 'Otro Motivo'].includes(o.status);

    // Categorization logic:
    // Pendientes: Not finished and NO delivery date
    // Activos: Not finished but HAS delivery date
    // Historial: Finished
    const pendientes = orders.filter(o => !isFinished(o) && !o.deliveryDate);
    const activos = orders.filter(o => !isFinished(o) && o.deliveryDate);
    const historial = orders.filter(o => isFinished(o));

    const tabs = [
        { id: 'Pendientes', count: pendientes.length },
        { id: 'Activos', count: activos.length },
        { id: 'Historial', count: historial.length }
    ];

    const getTabList = () => {
        if (activeTab === 'Pendientes') return pendientes;
        if (activeTab === 'Activos') return activos;
        return historial;
    };

    const filteredVisibleOrders = getTabList().filter(o =>
        o.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.orderNum && o.orderNum.toString().includes(searchQuery))
    );

    const handleSave = (updatedFields) => {
        updateOrder(editingOrder.id, updatedFields);
        setEditingOrder(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este pedido?")) {
            deleteOrder(id);
        }
    };

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
                </div>
                <button onClick={toggleTheme} className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined">contrast</span>
                </button>
            </header>

            <main className="relative px-4 py-6 max-w-7xl mx-auto w-full pb-32">
                {/* Search & Navigation Section */}
                <div className="mb-6 flex flex-col gap-4">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Gestión de Pedidos</h1>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Buscar material, solicitante o #..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl gap-1 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all duration-300 relative
                                ${activeTab === tab.id
                                    ? 'bg-white dark:bg-[#161e2a] shadow-md scale-[1.02]'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            <span className={`font-mono text-[9px] font-black uppercase tracking-widest
                                ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                                {tab.id}
                            </span>
                            <span className={`text-xl font-black leading-none mt-1
                                ${activeTab === tab.id ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>
                                {tab.count.toString().padStart(2, '0')}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredVisibleOrders.length > 0 ? (
                        filteredVisibleOrders.map((order) => (
                            <div key={order.id} className="bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                                <div className="p-4 border-b border-slate-50 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-mono text-[10px] font-black text-blue-600">#ORD-{order.orderNum}</p>
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                                {order.createdAt}
                                            </span>
                                            {isFinished(order) && (
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider
                                                    ${order.status === 'Entregado' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200/50' :
                                                        'bg-slate-100 dark:bg-slate-700 text-slate-500 border-slate-200'}`}
                                                >
                                                    {order.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1">{order.item}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-3">{order.entity} <span className="text-slate-300 mx-1">•</span> {order.supplier || "Sin proveedor"}</p>

                                    {order.status === 'Otro Motivo' && order.reason && (
                                        <div className="mb-3 p-3 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-xl">
                                            <p className="text-xs text-slate-600 dark:text-slate-400 italic font-medium">{order.reason}</p>
                                        </div>
                                    )}

                                    {order.deliveryDate && !isFinished(order) && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-full">
                                            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest">Entrega: {formatDate(order.deliveryDate)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className={`px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 grid gap-2 text-center ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
                                    {isAdmin && (
                                        <>
                                            <button onClick={() => setEditingOrder(order)} className="py-2.5 bg-blue-600/10 border border-blue-600/20 rounded-xl text-blue-600 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-blue-600 hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                                Fecha
                                            </button>
                                            <button onClick={() => setEditingOrder(order)} className="py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:border-blue-600 transition-all">
                                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                                Editar
                                            </button>
                                        </>
                                    )}
                                    <button onClick={() => handleDelete(order.id)} className="py-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-rose-600 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-rose-600 hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400/50">
                            <span className="material-symbols-outlined text-7xl mb-4 opacity-20">inventory_2</span>
                            <p className="text-sm font-black uppercase tracking-widest">No hay pedidos aquí</p>
                        </div>
                    )}
                </div>

                <button onClick={() => navigate('/new-order')} className="fixed bottom-24 right-6 size-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </main>

            {editingOrder && <EditOrderModal order={editingOrder} onSave={handleSave} onClose={() => setEditingOrder(null)} />}
            <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />

            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-6 pt-3 pb-8 flex justify-around items-center z-50">
                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-blue-600"><span className="material-symbols-outlined">dashboard</span><span className="text-[9px] font-bold uppercase">Panel</span></button>
                <button onClick={() => navigate('/operator')} className="flex flex-col items-center gap-1 text-slate-400"><span className="material-symbols-outlined">receipt_long</span><span className="text-[9px] font-bold uppercase">Pedidos</span></button>
                <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-1 text-slate-400"><span className="material-symbols-outlined">settings</span><span className="text-[9px] font-bold uppercase">Config</span></button>
            </nav>
        </div>
    );
};

export default Dashboard;
