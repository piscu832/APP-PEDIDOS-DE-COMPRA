import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SideDrawer from '../components/SideDrawer';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const stats = [
        { label: 'Activos', value: '482', change: '+5.2%', color: 'border-blue-600' },
        { label: 'Pendientes', value: '018', change: 'REVISAR', color: 'border-amber-500' }
    ];

    const orders = [
        { id: "9011", item: "Kit de Prótesis Rodilla K2", entity: "Dr. Juan Martínez", detail: "Hosp. Regional Sur" },
        { id: "9012", item: "Tornillería Tit. Grado 5", entity: "Ing. Ana Silva", detail: "Clínica Los Olivos" },
        { id: "9013", item: "Embalaje Estándar BX-500", entity: "Carlos Ruiz", detail: "Almacén Central" }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#fdfdfd] dark:bg-[#0a0f16]">
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0a0f16]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMenuOpen(true)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">menu</span>
                    </button>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold tracking-tighter text-slate-950 dark:text-white flex items-center gap-1">
                            VILLALBA <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-1">ADMINISTRACIÓN CENTRAL</span>
                    </div>
                </div>
                <button onClick={() => document.documentElement.classList.toggle('dark')} className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined">contrast</span>
                </button>
            </header>

            <main className="relative px-4 py-6 max-w-7xl mx-auto w-full pb-32">
                <div className="mb-6 flex gap-2">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input className="w-full pl-10 pr-4 h-11 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm" placeholder="Filtrar pedidos..." type="text" />
                    </div>
                    <button className="size-11 flex items-center justify-center bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>

                <div className="mb-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-slate-900 dark:bg-blue-600 text-white px-2 py-0.5 rounded uppercase">Root_Privileges</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded border border-emerald-100 dark:border-emerald-500/20">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Data_Sync_OK</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">Gestión de Pedidos</h1>
                    <p className="text-sm text-slate-500 font-medium">Control total de logística y reportes operativos.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-[#161e2a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 shadow-sm" style={{ borderLeftColor: stat.color }}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                                <span className="font-mono text-[10px] text-emerald-600 font-bold">{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-mono text-[11px] font-bold text-slate-400">#ORD-{order.id}</p>
                                        <span className="font-mono text-[9px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-1.5 py-0.5 rounded uppercase border border-amber-100 dark:border-amber-500/20">Pendiente</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{order.item}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{order.entity} • <span className="italic">{order.detail}</span></p>
                                </div>
                                <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                            <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-3 gap-2 text-center">
                                <button className="py-2 bg-blue-600/10 border border-blue-600/20 rounded-lg text-blue-600 font-mono text-[10px] font-bold uppercase tracking-wider">Fecha</button>
                                <button className="py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold uppercase tracking-wider">Editar</button>
                                <button className="py-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider">Borrar</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => navigate('/new-order')}
                    className="fixed bottom-24 right-6 size-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </main>

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
