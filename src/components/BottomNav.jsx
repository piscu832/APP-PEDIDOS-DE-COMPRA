import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNav = ({ active }) => {
    const navigate = useNavigate();

    const navItems = [
        { name: 'Panel', icon: 'dashboard', path: '/dashboard', id: 'dashboard' },
        { name: 'Pedidos', icon: 'receipt_long', path: '/operator', id: 'operator' },
        { name: 'Config', icon: 'settings', path: '/settings', id: 'settings' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-6 pt-3 pb-8 flex justify-around items-center z-50">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center gap-1 transition-colors ${active === item.id ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className="text-[9px] font-bold uppercase">{item.name}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
