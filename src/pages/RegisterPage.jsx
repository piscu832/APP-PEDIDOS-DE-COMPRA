import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0a0f16]">
            <header className="flex items-center bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <Logo />
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tighter uppercase text-slate-900 dark:text-white">VILLALBA</span>
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-blue-600 mt-0.5">Systems</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[480px] mx-auto px-6 py-10 flex flex-col justify-center">
                <div className="mb-10">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Registro</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium tracking-wide">ALTA DE NUEVOS USUARIOS EN SISTEMA</p>
                </div>

                <div className="mb-10 rounded-2xl overflow-hidden relative aspect-[21/7] border border-slate-200 dark:border-slate-800 bg-[#161e2a] flex items-center justify-center">
                    <div className="absolute inset-0 technical-dots opacity-20"></div>
                    <div className="relative flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocolo Identidad V.4</span>
                    </div>
                </div>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); navigate('/login'); }}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Nombre Completo</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">person</span>
                            <input className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold focus:ring-blue-600 outline-none" placeholder="Nombre y Apellidos" type="text" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Email Corporativo</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">mail</span>
                            <input className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold focus:ring-blue-600 outline-none" placeholder="usuario@villalba.com" type="email" required />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl font-black tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-sm uppercase">
                            CREAR CUENTA
                            <span className="material-symbols-outlined text-lg">how_to_reg</span>
                        </button>
                    </div>

                    <div className="text-center">
                        <button type="button" onClick={() => navigate('/login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                            Ya tengo cuenta
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default RegisterPage;
