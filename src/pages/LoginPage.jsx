import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prototype logic
        let userName = "Dr. Juan Martínez";
        let userRole = "Administrador";

        if (email.includes('silva')) { userName = "Ing. Ana Silva"; userRole = "Operario"; }
        else if (email.includes('ruiz')) { userName = "Carlos Ruiz"; userRole = "Operario"; }
        else if (email.includes('mendez')) { userName = "Elena Méndez"; userRole = "Administrador"; }

        login({ name: userName, role: userRole, email });
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0a0f16]">
            <header className="flex items-center bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 flex-1">
                    <Logo />
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tighter uppercase text-slate-900 dark:text-white">VILLALBA</span>
                        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-blue-600 mt-0.5">Systems</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[480px] mx-auto px-6 py-10 flex flex-col justify-center">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Acceso</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium tracking-wide">SISTEMA CENTRAL DE OPERACIONES</p>
                </div>

                <div className="mb-10 rounded-2xl overflow-hidden relative aspect-[21/9] border border-slate-200 dark:border-slate-800 bg-[#161e2a] flex items-center justify-center">
                    <div className="absolute inset-0 technical-dots opacity-20"></div>
                    <div className="relative flex flex-col items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse mb-2"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocolo Identidad V.4</span>
                    </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Email Corporativo</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">mail</span>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                                placeholder="usuario@villalba.com"
                                type="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Contraseña</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">lock</span>
                            <input
                                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                                placeholder="••••••••"
                                type="password"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl font-black tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-sm uppercase">
                            ENTRAR AL SISTEMA
                            <span className="material-symbols-outlined text-lg">login</span>
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800"></span></div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-[#f8fafc] dark:bg-[#0a0f16] px-2 text-slate-400">Modo Prototipo</span></div>
                        </div>

                        <button
                            type="button"
                            onClick={() => { login({ name: "Dr. Juan Martínez", role: "Administrador", email: "demo@villalba.com" }); navigate('/dashboard'); }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 rounded-xl font-black tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-sm uppercase"
                        >
                            ACCESO RÁPIDO DEMO
                            <span className="material-symbols-outlined text-lg">bolt</span>
                        </button>
                    </div>

                    <div className="text-center">
                        <button type="button" onClick={() => navigate('/register')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                            ¿No tienes cuenta? Solicitar acceso
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default LoginPage;
