import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const SideDrawer = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    const menuItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        { name: 'Pedidos', icon: 'receipt_long', path: '/operator' },
        { name: 'Reportes', icon: 'bar_chart', path: '/reports' },
        { name: 'Gestión de Roles', icon: 'admin_panel_settings', path: '/roles' },
        { name: 'Configuración', icon: 'settings', path: '/settings' },
        { name: 'Cerrar Sesión', icon: 'logout', path: '/login' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-72 h-full bg-white dark:bg-[#161e2a] border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
                <div className="flex items-center gap-3 mb-10">
                    <Logo />
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tighter uppercase leading-none text-slate-900 dark:text-white">VILLALBA</span>
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-blue-600 leading-none mt-0.5">Systems</span>
                    </div>
                </div>
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => { navigate(item.path); onClose(); }}
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-sm font-bold uppercase tracking-wide">{item.name}</span>
                        </button>
                    ))}
                </nav>
                <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="size-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideDrawer;
