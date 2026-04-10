import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SideDrawer from '../components/SideDrawer';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';
import { getActivityLogs } from '../services/activityService';

const ActivityLogsPage = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Date refs for custom triggers
    const fromRef = React.useRef(null);
    const toRef = React.useRef(null);

    // Filter states
    const [filterText, setFilterText] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const openPicker = (ref) => {
        if (ref.current) {
            try { ref.current.showPicker(); }
            catch { ref.current.click(); }
        }
    };

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logsData = await getActivityLogs();
                setLogs(logsData);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getActionColor = (action) => {
        if (action.includes('Eliminación')) return 'rose';
        if (action.includes('Creación')) return 'emerald';
        if (action.includes('Modificación')) return 'blue';
        if (action.includes('Rango')) return 'amber';
        return 'slate';
    };

    const filteredLogs = logs.filter(log => {
        const matchesText = log.details.toLowerCase().includes(filterText.toLowerCase()) || 
                           log.userName.toLowerCase().includes(filterText.toLowerCase()) ||
                           log.action.toLowerCase().includes(filterText.toLowerCase());
        
        const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : null;
        let matchesDate = true;

        if (logDate) {
            if (dateFrom) {
                const from = new Date(dateFrom);
                from.setHours(0, 0, 0, 0);
                if (logDate < from) matchesDate = false;
            }
            if (dateTo) {
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999);
                if (logDate > to) matchesDate = false;
            }
        }

        return matchesText && matchesDate;
    });

    const exportToCSV = () => {
        if (filteredLogs.length === 0) return alert("No hay datos para exportar con los filtros actuales.");

        const headers = ["Fecha", "Accion", "Detalle", "Usuario", "ID Usuario"];
        const rows = filteredLogs.map(log => [
            log.displayTime,
            log.action,
            `"${log.details.replace(/"/g, '""')}"`,
            log.userName,
            log.userId
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Reporte_Movimientos_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0a0f16]">
            <header className="flex items-center bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 flex-1">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">menu</span>
                    </button>
                    <Logo />
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tighter uppercase text-slate-900 dark:text-white">VILLALBA</span>
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-amber-600 mt-0.5">Auditoría</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[700px] mx-auto px-4 py-8 pb-40">
                <div className="mb-8 px-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Registro de Movimientos</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm italic font-medium">Historial de acciones críticas realizadas en el sistema.</p>
                    </div>
                    <button 
                        onClick={exportToCSV}
                        className="h-11 px-6 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Exportar CSV
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Buscar por detalle o usuario</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input 
                                    type="text"
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                    placeholder="Ej: Pedido #ORD-0001 o Juan Perez..."
                                    className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all font-sans"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Desde</label>
                            <div className="relative group">
                                <input 
                                    ref={fromRef}
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full h-11 pl-4 pr-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all color-scheme-light dark:color-scheme-dark"
                                />
                                <button 
                                    onClick={() => openPicker(fromRef)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Hasta</label>
                            <div className="relative group">
                                <input 
                                    ref={toRef}
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full h-11 pl-4 pr-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all color-scheme-light dark:color-scheme-dark"
                                />
                                <button 
                                    onClick={() => openPicker(toRef)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="size-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargando registros...</p>
                        </div>
                    ) : filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => {
                            const color = getActionColor(log.action);
                            return (
                                <div key={log.id} className="relative bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md group overflow-hidden">
                                    {/* Action Stripe */}
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${
                                        color === 'rose' ? 'bg-rose-500' : 
                                        color === 'emerald' ? 'bg-emerald-500' : 
                                        color === 'blue' ? 'bg-blue-600' : 
                                        color === 'amber' ? 'bg-amber-500' : 'bg-slate-400'
                                    }`}></div>

                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full
                                                ${color === 'rose' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' : 
                                                  color === 'emerald' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 
                                                  color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' : 
                                                  color === 'amber' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' : 
                                                  'bg-slate-50 text-slate-500 dark:bg-slate-500/10'}`}
                                            >
                                                {log.action}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{log.displayTime}</span>
                                        </div>

                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                                            {log.details}
                                        </p>

                                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/50">
                                            <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200 dark:border-slate-700">
                                                {log.userName.charAt(0)}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                Por: <span className="text-slate-900 dark:text-slate-300 ml-1">{log.userName}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 px-8 bg-slate-100/50 dark:bg-[#161e2a]/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-4 block">history</span>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No hay movimientos registrados</p>
                        </div>
                    )}
                </div>
            </main>

            <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />
            <BottomNav active="dashboard" />
        </div>
    );
};

export default ActivityLogsPage;
