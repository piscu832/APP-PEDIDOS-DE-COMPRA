import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { useOrders } from '../context/OrdersContext';
import { useSettings } from '../context/SettingsContext';
import { uploadImage } from '../services/uploadService';

const NewOrderPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addOrder } = useOrders();
    const { sectors } = useSettings();
    
    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const [formData, setFormData] = useState({
        item: '',
        quantity: '',
        unit: 'UDS',   // Unidad de medida
        priority: 'Media',
        supplier: '',   // Proveedor recomendado
        description: '', // Nueva descripción
        sector: user?.sector || '', // Default to user sector if available
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleConfirm = async () => {
        if (!formData.item || !formData.quantity || !formData.sector) {
            return alert("Completa los campos obligatorios (Incluyendo Sector)");
        }

        setIsUploading(true);
        let imageUrl = "";

        try {
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            const newOrder = {
                item: formData.item,
                entity: user?.name || "Usuario Desconocido",
                operatorName: user?.name, // For consistency in reports
                supplier: formData.supplier || "No especificado",
                description: formData.description || "",
                quantity: formData.quantity,
                unit: formData.unit,
                code: "NEW-" + Math.floor(Math.random() * 999),
                priority: formData.priority,
                deliveryDate: "",
                status: "Pendiente",
                sector: formData.sector,
                imageUrl: imageUrl, // Guardamos la URL de la imagen
            };

            await addOrder(newOrder);
            navigate(user?.role === 'Administrador' ? '/dashboard' : '/operator');
        } catch (error) {
            alert("Error al guardar el pedido o subir la imagen.");
        } finally {
            setIsUploading(false);
        }
    };

    const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

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
                <div className="space-y-5">

                    <div className="grid grid-cols-2 gap-4">
                        {/* Solicitante — auto-filled, read-only */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Solicitante</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                                <input
                                    className="w-full pl-12 pr-4 h-14 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed truncate"
                                    value={user?.name || "Cargando..."}
                                    readOnly
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Sector */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Sector</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">factory</span>
                                <select
                                    className="w-full pl-10 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 outline-none appearance-none"
                                    value={formData.sector}
                                    onChange={set('sector')}
                                >
                                    <option value="" disabled>Seleccionar...</option>
                                    {sectors.map(s => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Producto / Insumo */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Producto / Insumo</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">inventory_2</span>
                            <input
                                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 outline-none transition-all"
                                placeholder="Nombre del material"
                                type="text"
                                value={formData.item}
                                onChange={set('item')}
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Descripción</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">description</span>
                            <textarea
                                className="w-full pl-12 pr-4 py-4 min-h-[120px] bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 outline-none transition-all resize-none"
                                placeholder="Descripción detallada del material o especificaciones..."
                                value={formData.description}
                                onChange={set('description')}
                            />
                        </div>
                    </div>

                    {/* Adjuntar Imagen */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Imagen (Opcional)</label>
                        <div 
                            className={`relative flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-xl transition-all ${
                                dragActive 
                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161e2a]"
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6">
                                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">add_a_photo</span>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center">Arrastra una imagen o haz clic para subir</span>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                    />
                                </label>
                            ) : (
                                <div className="relative w-full p-4 flex flex-col items-center">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="max-h-40 rounded-lg object-contain shadow-md"
                                    />
                                    <button 
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="absolute top-2 right-2 size-8 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-full px-4">{imageFile?.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Proveedor recomendado */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Proveedor Recomendado</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">storefront</span>
                            <input
                                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 outline-none transition-all"
                                placeholder="Nombre del proveedor"
                                type="text"
                                value={formData.supplier}
                                onChange={set('supplier')}
                            />
                        </div>
                    </div>

                    {/* Cantidad + Unidad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Cantidad</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl">tag</span>
                                <input
                                    className="w-full pl-10 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-base font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 outline-none"
                                    placeholder="0"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={set('quantity')}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Unidad</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">straighten</span>
                                <select
                                    className="w-full pl-10 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-base font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 outline-none appearance-none"
                                    value={formData.unit}
                                    onChange={set('unit')}
                                >
                                    <option value="UDS">Unidades (UDS)</option>
                                    <option value="MTS">Metros (MTS)</option>
                                    <option value="KG">Kilogramos (KG)</option>
                                    <option value="LTS">Litros (LTS)</option>
                                    <option value="BLT">Bultos (BLT)</option>
                                    <option value="PQTE">Paquetes (PQTE)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Prioridad */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Prioridad</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">flag</span>
                            <select
                                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#161e2a] border border-slate-200 dark:border-slate-800 rounded-xl text-base font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 outline-none appearance-none"
                                value={formData.priority}
                                onChange={set('priority')}
                            >
                                <option>Baja</option>
                                <option>Media</option>
                                <option>Alta</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={handleConfirm}
                            disabled={isUploading}
                            className={`w-full ${isUploading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white h-14 rounded-xl font-black tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-sm uppercase`}
                        >
                            {isUploading ? 'SUBIENDO...' : 'CONFIRMAR PEDIDO'}
                            <span className="material-symbols-outlined text-lg">{isUploading ? 'sync' : 'check_circle'}</span>
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-transparent text-slate-500 h-12 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
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
