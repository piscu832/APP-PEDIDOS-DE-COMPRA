import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Logo from '../components/Logo';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { sectors } = useSettings();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        sector: '',
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!form.sector) {
            return setError('Debes seleccionar un sector');
        }

        if (form.password.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres');
        }

        if (form.password !== form.confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        setIsLoading(true);

        try {
            const res = await register(form.name, form.email, form.password, form.sector);
            setSuccessMessage(res.message);
        } catch (err) {
            let msg = err.message || 'Error al crear la cuenta';
            if (msg.includes('auth/weak-password')) {
                msg = 'La contraseña es demasiado débil (mínimo 6 caracteres)';
            } else if (msg.includes('auth/email-already-in-use')) {
                msg = 'Este correo ya está registrado';
            } else if (msg.includes('auth/invalid-email')) {
                msg = 'El formato del correo no es válido';
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0f16] p-8">
            <header className="mb-12 flex flex-col items-center">
                <Logo size="lg" />
                <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Crear Cuenta</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Registrate como Operario</p>
            </header>

            <main className="max-w-[400px] mx-auto w-full">
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-rose-600 text-xs font-bold uppercase tracking-wider text-center">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-600 text-xs font-bold uppercase tracking-wider text-center space-y-2">
                        <p>{successMessage}</p>
                        <Link to="/login" className="block text-blue-600 underline">Ir al Login</Link>
                    </div>
                )}

                {!successMessage && (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Nombre Completo</label>
                            <input
                                required
                                className="w-full px-5 h-14 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-base font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="Ej: Dr. Juan Perez"
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Sector / Área</label>
                            <div className="relative">
                                <select
                                    required
                                    className="w-full px-5 h-14 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-base font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                                    value={form.sector}
                                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                                >
                                    <option value="" disabled>Selecciona tu sector...</option>
                                    {sectors.map(s => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Email Corporativo</label>
                            <input
                                required
                                className="w-full px-5 h-14 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-base font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="usuario@villalba.com"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Contraseña</label>
                            <input
                                required
                                className="w-full px-5 h-14 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-base font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                                placeholder="••••••••"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest mt-1 ml-1">Mínimo 6 caracteres</span>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Confirmar Contraseña</label>
                            <input
                                required
                                className="w-full px-5 h-14 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-base font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                                placeholder="••••••••"
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full h-14 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black tracking-widest text-sm uppercase shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'CREANDO...' : 'UNIRSE AL EQUIPO'}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-xs font-medium">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 font-bold ml-1">Inicia Sesión</Link>
                </p>
            </main>
        </div>
    );
};

export default RegisterPage;
