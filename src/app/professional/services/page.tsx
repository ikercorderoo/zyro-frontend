'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/api';
import { Service } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProfessionalServices() {
    const { user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
    const [saving, setSaving] = useState(false);
    const [modalStep, setModalStep] = useState(1); // 1: Basic Info, 2: Addons

    useEffect(() => {
        const init = async () => {
            const id = await fetchBusiness();
            await fetchServices(id);
        };
        init();
    }, []);

    const fetchBusiness = async () => {
        try {
            const data = await apiFetch('/businesses/my');
            if (data && data.length > 0) {
                setBusinessId(data[0].id);
                return data[0].id as string;
            }
            return null;
        } catch (err) {
            console.error('Error fetching business:', err);
            return null;
        }
    };

    const fetchServices = async (ownerBusinessId?: string | null) => {
        try {
            const targetBusinessId = ownerBusinessId ?? businessId;
            if (!targetBusinessId) {
                setServices([]);
                return;
            }
            const data = await apiFetch(`/services?businessId=${targetBusinessId}`);
            setServices(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingService?.id) {
                await apiFetch(`/services/${editingService.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(editingService),
                });
            } else {
                if (!businessId) {
                    throw new Error('Debes configurar tu negocio en Ajustes primero');
                }
                await apiFetch('/services', {
                    method: 'POST',
                    body: JSON.stringify({ ...editingService, businessId }),
                });
            }
            setEditingService(null);
            fetchServices();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro? No podrás borrarlo si tiene citas activas.')) return;
        try {
            await apiFetch(`/services/${id}`, { method: 'DELETE' });
            fetchServices();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleAddAddon = async (serviceId: string | undefined, addonData: any) => {
        if (!serviceId) {
            // Local mode (creation)
            setEditingService(prev => ({
                ...prev!,
                addons: [...(prev?.addons || []), { ...addonData, id: Math.random().toString() }] // temp id for list
            }));
            return;
        }
        
        try {
            await apiFetch(`/services/${serviceId}/addons`, {
                method: 'POST',
                body: JSON.stringify(addonData),
            });
            fetchServices(); // Refresh to get updated addons
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteAddon = async (addonId: string) => {
        if (!editingService?.id) {
            // Local mode (creation)
            setEditingService(prev => ({
                ...prev!,
                addons: prev?.addons?.filter(a => a.id !== addonId)
            }));
            return;
        }

        if (!confirm('¿Borrar este complemento?')) return;
        try {
            await apiFetch(`/services/addons/${addonId}`, { method: 'DELETE' });
            fetchServices();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="space-y-8 mb-20">
            <header className="p-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/professional/dashboard"
                            className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 hover:bg-neutral-200 transition-all"
                            title="Volver"
                        >
                            ←
                        </Link>
                        <div className="flex-grow">
                            <h1 className="text-3xl font-black tracking-tight text-neutral-900">Servicios de tu negocio</h1>
                            <p className="text-neutral-600 mt-1">Crea un catálogo claro para convertir visitas en reservas.</p>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                setEditingService({ name: '', duration: 30, price: 0, addons: [] });
                                setModalStep(1);
                            }}
                            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-sm uppercase tracking-wide"
                        >
                            <span className="text-xl leading-none">+</span>
                            Crear nuevo servicio
                        </button>
                    </div>
                </div>
            </header>

            {services.length === 0 && (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700 mb-2">Paso 3 de onboarding</p>
                    <h2 className="text-xl font-black text-neutral-900">Publica al menos 1 servicio para activar tu perfil completo</h2>
                    <p className="text-neutral-700 mt-1">Recomendación: empieza con 3 servicios base para que el cliente tenga opciones.</p>
                    <div className="mt-4 grid md:grid-cols-3 gap-3">
                        {[
                            'Corte clásico · 30 min · 15EUR',
                            'Corte + barba · 45 min · 22EUR',
                            'Arreglo de barba · 20 min · 12EUR'
                        ].map((tip) => (
                            <div key={tip} className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700">
                                {tip}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {loading ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-500">
                    Cargando servicios...
                </div>
            ) : services.length === 0 ? (
                <section className="rounded-3xl border border-neutral-200 bg-white p-8 md:p-10 shadow-sm">
                    <div className="max-w-2xl">
                        <h3 className="text-2xl font-black text-neutral-900">Todavía no tienes servicios creados</h3>
                        <p className="text-neutral-600 mt-2">
                            Añade tu primer servicio para aparecer en recomendaciones y permitir que tus clientes reserven online.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={() => {
                                    setEditingService({ name: '', duration: 30, price: 0, addons: [] });
                                    setModalStep(1);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] text-sm uppercase tracking-wide"
                            >
                                Crear primer servicio
                            </button>
                            <Link
                                href="/professional/settings"
                                className="bg-white border-2 border-neutral-200 text-neutral-800 font-black px-8 py-4 rounded-2xl hover:bg-neutral-50 hover:border-neutral-300 transition-all text-sm uppercase tracking-wide"
                            >
                                Revisar configuración
                            </Link>
                        </div>
                    </div>
                </section>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-gradient-to-b from-white to-indigo-50/40 p-6 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 shadow-lg shadow-indigo-100/70 hover:shadow-xl hover:shadow-indigo-200/70 transition-all">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-xl font-black text-neutral-900 leading-tight">{service.name}</h3>
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                                    {service.duration} min
                                </span>
                            </div>
                            <p className="text-neutral-600 text-sm mt-2 min-h-[40px]">{service.description || 'Sin descripción todavía.'}</p>
                            <div className="mt-5 flex items-center justify-between">
                                <span className="text-2xl text-indigo-700 font-black">{service.price}EUR</span>
                                <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Precio final</span>
                            </div>
                            <div className="mt-6 flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditingService(service);
                                        setModalStep(1);
                                    }}
                                    className="flex-1 bg-[#161718] hover:bg-[#232527] text-white font-bold py-2.5 rounded-lg text-sm transition-all"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 rounded-lg text-sm transition-all border border-red-100"
                                >
                                    Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editingService && (
                <div className="fixed inset-0 bg-black/35 backdrop-blur-[2px] flex items-center justify-center p-4 z-[60]">
                    <form onSubmit={handleSave} className="bg-white rounded-3xl p-7 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in duration-300 space-y-4 relative">
                        <h2 className="text-2xl font-black text-neutral-900 mb-2">
                            {editingService.id ? (modalStep === 1 ? 'Datos del Servicio' : 'Complementos') : (modalStep === 1 ? 'Nuevo Servicio' : 'Añadir Complementos')}
                        </h2>
                        
                        {/* Progress Stepper */}
                        <div className="flex gap-2 mb-6">
                            <div className={`h-1.5 flex-1 rounded-full ${modalStep >= 1 ? 'bg-indigo-600' : 'bg-neutral-100'}`} />
                            <div className={`h-1.5 flex-1 rounded-full ${modalStep >= 2 ? 'bg-indigo-600' : 'bg-neutral-100'}`} />
                        </div>

                        <button 
                            type="button"
                            onClick={() => setEditingService(null)} 
                            className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 p-2"
                        >
                            ✕
                        </button>

                        {modalStep === 1 ? (
                            <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                                <p className="text-sm text-neutral-500 mb-4">Define lo básico: nombre, precio y cuánto tiempo te toma.</p>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Nombre</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                        value={editingService.name}
                                        onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Descripción</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all h-24"
                                        value={editingService.description || ''}
                                        onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Precio (EUR)</label>
                                        <input
                                            type="number" required
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                            value={editingService.price}
                                            onChange={e => setEditingService({ ...editingService, price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Duración (min)</label>
                                        <input
                                            type="number" required
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                            value={editingService.duration}
                                            onChange={e => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setEditingService(null)} className="flex-1 bg-neutral-100 font-bold py-3 rounded-xl">
                                        Cancelar
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setModalStep(2)}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all"
                                    >
                                        Siguiente: Complementos →
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <p className="text-sm text-neutral-500 mb-4">¿Quieres ofrecer algo más? (ej: Limpieza facial, Lavado, etc.)</p>
                                
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                    {editingService.addons?.length === 0 ? (
                                        <div className="text-center py-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                                            <p className="text-xs text-neutral-400 italic">No has añadido extras todavía.</p>
                                        </div>
                                    ) : (
                                        editingService.addons?.map((addon) => (
                                            <div key={addon.id} className="flex items-center justify-between p-3 bg-indigo-50/30 rounded-xl border border-indigo-100">
                                                <div>
                                                    <p className="font-bold text-sm text-neutral-900">{addon.name}</p>
                                                    <p className="text-xs text-neutral-500">+{addon.price}€ · +{addon.duration} min</p>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleDeleteAddon(addon.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <input 
                                            id="new-addon-name"
                                            placeholder="Nombre del extra"
                                            className="col-span-2 px-3 py-2 rounded-lg border border-neutral-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                        <input 
                                            id="new-addon-price"
                                            type="number"
                                            placeholder="Precio (€)"
                                            className="px-3 py-2 rounded-lg border border-neutral-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                        <input 
                                            id="new-addon-duration"
                                            type="number"
                                            placeholder="Minutos"
                                            className="px-3 py-2 rounded-lg border border-neutral-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const ni = document.getElementById('new-addon-name') as HTMLInputElement;
                                            const pi = document.getElementById('new-addon-price') as HTMLInputElement;
                                            const di = document.getElementById('new-addon-duration') as HTMLInputElement;
                                            if (!ni.value || !pi.value || !di.value) return alert('Datos incompletos');
                                            handleAddAddon(editingService.id, { name: ni.value, price: Number(pi.value), duration: Number(di.value) });
                                            ni.value = ''; pi.value = ''; di.value = '';
                                        }}
                                        className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-2 rounded-lg text-xs transition-colors"
                                    >
                                        + Añadir este complemento
                                    </button>
                                </div>

                                <div className="flex gap-3 pt-6">
                                    <button type="button" onClick={() => setModalStep(1)} className="flex-1 bg-neutral-100 font-bold py-3 rounded-xl transition-all">
                                        ← Volver
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={saving} 
                                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl shadow-xl shadow-indigo-200 transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Guardando...' : editingService.id ? 'Guardar Cambios' : 'Finalizar y Crear Servicio'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}
