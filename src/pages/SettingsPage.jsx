import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { toggleTheme } = useTheme();

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0a0f16]">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                        <h1 className="text-xl font-bold tracking-tight uppercase italic text-slate-900 dark:text-white">Villalba</h1>
                    </div>
                    <span className="material-symbols-outlined text-slate-500">settings</span>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-40">
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-blue-600">palette</span> Apariencia
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={toggleTheme} className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-600 transition-colors">
                            <span className="material-symbols-outlined text-3xl text-blue-600">contrast</span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">Alternar Tema</span>
                        </button>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-blue-600">notifications_active</span> Notificaciones
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Alertas de Sistema</p>
                                <p className="text-sm text-slate-500">Notificaciones críticas</p>
                            </div>
                            <div className="w-11 h-6 bg-blue-600 rounded-full relative">
                                <div className="absolute top-1 right-1 bg-white size-4 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-blue-600">admin_panel_settings</span> Administración
                    </h2>
                    <button
                        onClick={() => navigate('/roles')}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-600/50 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined">group_add</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-900 dark:text-white">Gestión de Roles</p>
                                <p className="text-xs text-slate-500">Control de acceso y usuarios</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600">chevron_right</span>
                    </button>
                </section>

                <section className="pt-4">
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold uppercase tracking-widest text-sm hover:bg-rose-500/20 transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Cerrar Sesión
                    </button>
                </section>
            </main>

            <BottomNav active="settings" />
        </div>
    );
};

export default SettingsPage;
