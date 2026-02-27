import React, { useState, useMemo } from 'react';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import SideDrawer from '../components/SideDrawer';

const ReportsPage = () => {
    const { orders, loading } = useOrders();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Filtering logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderNum?.toString().includes(searchTerm) ||
                order.operatorName?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter;

            // Basic date filtering (createdAt is a localized string, might need ISO conversion if we want robust range)
            // For now, we'll assume the string comparison if dates are in YYYY-MM-DD or similar
            // But OrdersContext converts it to string DD/MM/YYYY. Let's handle it.

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    // Statistics
    const stats = {
        total: filteredOrders.length,
        entregados: filteredOrders.filter(o => o.status === 'Entregado').length,
        pendientes: filteredOrders.filter(o => !o.deliveryDate).length,
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ["ID Orden", "Producto", "Estado", "Prioridad", "Cantidad", "Unidad", "Solicitante", "Fecha Creacion", "Fecha Entrega", "Proveedor"];
        const rows = filteredOrders.map(o => [
            `#ORD-${o.orderNum}`,
            o.item,
            o.status,
            o.priority,
            o.quantity,
            o.unit,
            o.operatorName,
            o.createdAt,
            o.deliveryDate || 'N/A',
            o.supplier || 'N/A'
        ]);

        const csvContent = [headers, ...rows]
            .map(e => e.map(cell => `"${cell}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `reporte_pedidos_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Copy for Sheets (TSV)
    const copyToSheets = () => {
        const rows = filteredOrders.map(o => [
            `#ORD-${o.orderNum}`,
            o.item,
            o.status,
            o.priority,
            o.quantity,
            o.unit,
            o.operatorName,
            o.createdAt,
            o.deliveryDate || 'N/A',
            o.supplier || 'N/A'
        ]);

        const tsv = rows.map(r => r.join("\t")).join("\n");
        navigator.clipboard.writeText(tsv);
        alert("Datos copiados. Pégalos directamente en Google Sheets.");
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f16] flex items-center justify-center text-blue-600 font-black">CARGANDO REPORTE...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f16] pb-32">
            <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />

            <header className="px-6 pt-12 pb-8 bg-white dark:bg-[#161e2a] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setIsMenuOpen(true)} className="size-11 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-2xl">
                        <span className="material-symbols-outlined text-slate-600 dark:text-white">menu</span>
                    </button>
                    <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                        Reporte de<br /><span className="text-blue-600">Pedidos Realizados</span>
                    </h1>
                    <div className="size-11 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                        <span className="material-symbols-outlined text-blue-600">bar_chart</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-3xl border border-slate-100 dark:border-white/5 text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 text-center">
                        <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">LISTOS</p>
                        <p className="text-xl font-black text-emerald-600">{stats.entregados}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-3xl border border-blue-100 dark:border-blue-500/20 text-center">
                        <p className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest mb-1">PTE.</p>
                        <p className="text-xl font-black text-blue-600">{stats.pendientes}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Buscar en el reporte..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex-1 h-12 px-4 bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-inner"
                        >
                            <option value="Todos">Todos los Estados</option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="Activo">Activos</option>
                            <option value="Entregado">Entregados</option>
                            <option value="Finalizado">Finalizados</option>
                        </select>
                        <button
                            onClick={exportToCSV}
                            className="px-5 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                            title="Exportar a CSV"
                        >
                            <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registros Encontrados ({filteredOrders.length})</h2>
                    <button
                        onClick={copyToSheets}
                        className="text-[9px] font-black text-blue-600 uppercase tracking-widest underline decoration-2 underline-offset-4"
                    >
                        Copiar para Google Sheets
                    </button>
                </div>

                <div className="space-y-3">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-[#161e2a] p-5 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">#ORD-{order.orderNum}</p>
                                    <h3 className="text-slate-900 dark:text-white font-bold text-base leading-tight mt-1">{order.item}</h3>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{order.operatorName}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5 ${order.status === 'Entregado' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                    <span className="text-[10px] font-bold">{order.createdAt}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CANTIDAD</p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{order.quantity} {order.unit}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredOrders.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-white/5">search_off</span>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No hay pedidos que coincidan</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav active="reports" />
        </div>
    );
};

export default ReportsPage;
