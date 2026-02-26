import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SideDrawer from '../components/SideDrawer';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';

const RolesPage = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const users = [
        { name: "Dr. Juan Martínez", email: "j.martinez@villalba.com", role: "Administrador", active: true },
        { name: "Ing. Ana Silva", email: "a.silva@villalba.com", role: "Operario", active: false },
        { name: "Carlos Ruiz", email: "c.ruiz@villalba.com", role: "Operario", active: false },
        { name: "Elena Méndez", email: "e.mendez@villalba.com", role: "Administrador", active: true },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0a0f16]">
            <header className="flex items-center bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => setIsMenuOpen(true)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">menu</span>
                    </button>
                    <Logo />
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tighter uppercase text-slate-900 dark:text-white">VILLALBA</span>
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-blue-600 mt-0.5">Admin Panel</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[480px] mx-auto px-4 py-6 pb-40">
                <div className="mb-6 px-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestión de Roles</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Control de privilegios y niveles de acceso.</p>
                </div>

                <div className="px-2 mb-6">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input className="w-full pl-10 pr-4 h-11 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 outline-none text-sm transition-all" placeholder="Buscar usuario..." type="text" />
                    </div>
                </div>

                <div className="space-y-3">
                    {users.map((u, i) => (
                        <div key={i} className="bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`size-10 rounded-full flex items-center justify-center border ${u.active ? 'bg-blue-600/10 text-blue-600 border-blue-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'}`}>
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{u.email}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${u.active ? 'text-blue-600' : 'text-slate-400'}`}>{u.role}</span>
                                <div className="relative inline-block w-10 align-middle select-none">
                                    <input checked={u.active} readOnly className={`absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 right-0 ${u.active ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-slate-600'}`} type="checkbox" />
                                    <label className={`block overflow-hidden h-5 rounded-full cursor-pointer transition-all duration-300 ${u.active ? 'bg-blue-600/20' : 'bg-slate-300 dark:bg-slate-700'}`}></label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-slate-100 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">info</span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            El cambio de rol es instantáneo. Los <span className="text-blue-600 font-bold italic">Administradores</span> tienen acceso total a la configuración del sistema.
                        </p>
                    </div>
                </div>
            </main>

            <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />
            <BottomNav active="dashboard" />
        </div>
    );
};

export default RolesPage;
