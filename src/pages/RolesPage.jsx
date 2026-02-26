import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SideDrawer from '../components/SideDrawer';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

// --- Reusable Role Toggle ---
const RoleToggle = ({ isAdmin, onChange }) => (
    <button
        onClick={onChange}
        type="button"
        role="switch"
        aria-checked={isAdmin}
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            ${isAdmin ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300
            ${isAdmin ? 'translate-x-7' : 'translate-x-1'}`}
        />
    </button>
);

const RolesPage = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Fetch real users from Firestore
    React.useEffect(() => {
        const q = query(collection(db, "users"), orderBy("name", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                isAdmin: doc.data().role === 'Administrador'
            }));
            setUsers(usersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleRole = async (targetUser) => {
        // Prevent user from changing their own role (extra safety)
        if (targetUser.id === user?.uid) {
            return alert("No puedes cambiar tu propio rango desde aquí");
        }

        const newRole = targetUser.role === 'Administrador' ? 'Operario' : 'Administrador';
        try {
            const userRef = doc(db, "users", targetUser.id);
            await updateDoc(userRef, { role: newRole });
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Error al actualizar el rol");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0a0f16]">
            <header className="flex items-center bg-white/80 dark:bg-[#0a0f16]/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 flex-1">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
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
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 h-11 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 outline-none text-sm transition-all text-slate-900 dark:text-white"
                            placeholder="Buscar usuario..."
                            type="text"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargando Usuarios...</p>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map(u => (
                            <div key={u.id} className="bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all">
                                {/* Avatar + name */}
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full flex items-center justify-center border transition-colors duration-300
                                        ${u.isAdmin
                                            ? 'bg-blue-600/10 text-blue-600 border-blue-600/20'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'}`}
                                    >
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</span>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{u.email}</span>
                                    </div>
                                </div>

                                {/* Role badge + toggle */}
                                <div className="flex flex-col items-end gap-2 min-w-[80px]">
                                    <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300
                                        ${u.isAdmin ? 'text-blue-600' : 'text-slate-400'}`}
                                    >
                                        {u.role}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Op</span>
                                        <RoleToggle isAdmin={u.isAdmin} onChange={() => toggleRole(u)} />
                                        <span className="text-[8px] font-bold uppercase tracking-wider text-blue-600">Adm</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400 text-sm font-medium">
                            No se encontraron usuarios.
                        </div>
                    )}
                </div>

                {/* Info box */}
                <div className="mt-8 bg-slate-100 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg shrink-0">info</span>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Deslizá hacia la <strong className="text-slate-700 dark:text-slate-300">derecha</strong> para asignar nivel <span className="text-blue-600 font-bold italic">Administrador</span>,
                            o hacia la <strong className="text-slate-700 dark:text-slate-300">izquierda</strong> para <span className="text-slate-500 font-bold">Operario</span>. El cambio es instantáneo.
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
