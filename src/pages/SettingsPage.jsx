import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';
import { useSettings } from '../context/SettingsContext';
import { useNotifications } from '../context/NotificationContext';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { toggleTheme } = useTheme();
    const { sectors, addSector, deleteSector } = useSettings();
    const [newSector, setNewSector] = useState('');
    const [showSectorAdmin, setShowSectorAdmin] = useState(false);

    const {
        enabled: notificationsEnabled,
        setEnabled: setNotificationsEnabled,
        soundEnabled,
        setSoundEnabled,
        testSound
    } = useNotifications();

    const handleAddSector = (e) => {
        e.preventDefault();
        if (!newSector.trim()) return;
        addSector(newSector.trim());
        setNewSector('');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0a0f16]">
            {/* Same header... */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Logo size="sm" />
                        <h1 className="text-xl font-bold tracking-tight uppercase text-slate-900 dark:text-white">Configuración</h1>
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
                        <button
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-600/50 transition-all shadow-sm"
                        >
                            <div className="text-left flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
                                    <span className="material-symbols-outlined text-lg">notifications</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white tracking-tight">Alertas de Sistema</p>
                                    <p className="text-xs text-slate-500 font-medium">Notificar cambios de pedidos</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex items-center px-1
                                ${notificationsEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                <div className={`size-4 bg-white rounded-full shadow-sm transition-transform duration-300
                                    ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </button>

                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-600/50 transition-all shadow-sm"
                        >
                            <div className="text-left flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-600">
                                    <span className="material-symbols-outlined text-lg">volume_up</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white tracking-tight">Sonido de Notificación</p>
                                    <p className="text-xs text-slate-500 font-medium">Reproducir audio al alertar</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex items-center px-1
                                ${soundEnabled ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                <div className={`size-4 bg-white rounded-full shadow-sm transition-transform duration-300
                                    ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </button>

                        <button
                            onClick={testSound}
                            disabled={!soundEnabled}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined text-lg">play_circle</span>
                            Probar Sonido
                        </button>
                    </div>
                </section>

                {user?.role === 'Administrador' && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                            <span className="material-symbols-outlined text-blue-600">admin_panel_settings</span> Administración
                        </h2>
                        <div className="space-y-4">
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

                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
                                <button
                                    onClick={() => setShowSectorAdmin(!showSectorAdmin)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                                            <span className="material-symbols-outlined">factory</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-slate-900 dark:text-white">Gestión de Sectores</p>
                                            <p className="text-xs text-slate-500">Añadir o quitar sectores del sistema</p>
                                        </div>
                                    </div>
                                    <span className={`material-symbols-outlined text-slate-400 transition-transform ${showSectorAdmin ? 'rotate-90' : ''}`}>chevron_right</span>
                                </button>

                                {showSectorAdmin && (
                                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                                        <form onSubmit={handleAddSector} className="flex gap-2 mb-4">
                                            <input
                                                type="text"
                                                value={newSector}
                                                onChange={(e) => setNewSector(e.target.value)}
                                                placeholder="Nuevo sector..."
                                                className="flex-1 bg-white dark:bg-[#0a0f16] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
                                            >
                                                Agregar
                                            </button>
                                        </form>

                                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                            {sectors.map((s) => (
                                                <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.name}</span>
                                                    <button
                                                        onClick={() => deleteSector(s.id, s.name)}
                                                        className="text-slate-400 hover:text-rose-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            ))}
                                            {sectors.length === 0 && (
                                                <p className="text-center text-xs text-slate-500 py-4">No hay sectores configurados</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

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
