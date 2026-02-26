import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const NewOrderPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        item: '',
        quantity: '',
        priority: 'Media'
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0a0f16]">
            <header className="flex items-center bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <Logo size="sm" />
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tighter uppercase text-slate-900 dark:text-white">NUEVO PEDIDO</span>
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-blue-600 mt-0.5">Carga de Datos</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[480px] mx-auto px-6 py-8">
                <div className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Usuario Solicitante</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">person</span>
                            <input
                                className="w-full pl-12 pr-4 h-14 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                value={user?.name || "Cargando..."}
                                readOnly
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Producto / Insumo</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">inventory_2</span>
                            <input
                                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold focus:ring-blue-600 focus:border-blue-600 outline-none"
                                placeholder="Nombre del material"
                                type="text"
                                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Cantidad</label>
                            <input
                                className="w-full px-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold focus:ring-blue-600 outline-none"
                                placeholder="0"
                                type="number"
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Prioridad</label>
                            <select
                                className="w-full px-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold focus:ring-blue-600 outline-none appearance-none"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option>Baja</option>
                                <option>Media</option>
                                <option>Alta</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl font-black tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-sm uppercase"
                        >
                            CONFIRMAR PEDIDO
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-transparent text-slate-500 h-12 rounded-xl font-bold text-xs uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NewOrderPage;
