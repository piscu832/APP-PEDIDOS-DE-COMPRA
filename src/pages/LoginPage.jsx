import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            let msg = err.message || 'Error al iniciar sesión';

            if (msg.includes('verificar tu correo')) {
                setError(
                    <div className="flex flex-col gap-2">
                        <span>{msg}</span>
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    const { sendEmailVerification } = await import('firebase/auth');
                                    const { auth } = await import('../firebase');
                                    if (auth.currentUser) {
                                        await sendEmailVerification(auth.currentUser);
                                        alert("Email de verificación reenviado. Revisa tu casilla.");
                                    }
                                } catch (e) { alert("Error al reenviar. Espera unos minutos."); }
                            }}
                            className="text-blue-600 underline font-black"
                        >
                            REENVIAR EMAIL DE VERIFICACIÓN
                        </button>
                    </div>
                );
            } else if (msg.includes('auth/user-not-found')) {
                setError('Usuario no encontrado');
            } else if (msg.includes('auth/wrong-password')) {
                setError('Contraseña incorrecta');
            } else {
                setError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0f16] p-8">
            <header className="mb-12 flex flex-col items-center">
                <div className="bg-white dark:bg-[#161e2a] p-6 rounded-[32px] shadow-2xl shadow-blue-600/10 border border-slate-100 dark:border-slate-800 transition-all">
                    <Logo size="lg" />
                </div>
                <h2 className="mt-8 text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-center leading-none">
                    Acceso<br /><span className="text-blue-600">Pedidos Internos</span>
                </h2>
            </header>

            <main className="max-w-[400px] mx-auto w-full">
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-rose-600 text-[10px] font-black uppercase tracking-wider text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Email</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                            <input
                                required
                                name="email"
                                autoComplete="username email"
                                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="usuario@villalba.com"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Contraseña</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                            <input
                                required
                                name="password"
                                autoComplete="current-password"
                                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="••••••••"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black tracking-widest text-sm uppercase shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? 'VERIFICANDO...' : (
                            <>
                                INGRESAR AL PANEL
                                <span className="material-symbols-outlined text-lg">login</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 flex flex-col gap-4">
                    <Link to="/register" className="text-center text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors">
                        ¿No tienes cuenta? <span className="text-blue-600">Regístrate</span>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
