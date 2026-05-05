'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Business } from '@/types';
import AddressAutocomplete from '@/components/forms/AddressAutocomplete';
import ImageUpload from '@/components/forms/ImageUpload';

const getDefaultSchedules = () => ([
    { dayOfWeek: 'mon', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'tue', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'wed', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'thu', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'fri', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'sat', startTime: '09:00', endTime: '14:00', isAvailable: false },
    { dayOfWeek: 'sun', startTime: '09:00', endTime: '14:00', isAvailable: false },
]);

export default function ProfessionalSettings() {
    const router = useRouter();
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
        description: '',
        address: '',
        minLeadTime: 0,
        maxBookingWindow: 30,
        cancellationWindow: 24,
        bufferTime: 0,
        slotInterval: 30,
        imageUrl: '',
        schedules: getDefaultSchedules()
    });

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const data = await apiFetch('/businesses/my');
                if (data && data.length > 0) {
                    const currentBusiness = data[0];
                    setBusiness(currentBusiness);
                    let schedules = getDefaultSchedules();
                    try {
                        const staffList = await apiFetch(`/staff/business/${currentBusiness.id}`);
                        if (Array.isArray(staffList) && staffList.length > 0 && Array.isArray(staffList[0].schedules) && staffList[0].schedules.length > 0) {
                            schedules = staffList[0].schedules;
                        }
                    } catch (staffErr) {
                        console.error('Error fetching staff schedules:', staffErr);
                    }
                    setFormData({
                        ...currentBusiness,
                        schedules
                    });
                    setHasUnsavedChanges(false);
                } else {
                    setBusiness(null);
                    setFormData({
                        name: '',
                        description: '',
                        address: '',
                        minLeadTime: 0,
                        maxBookingWindow: 30,
                        cancellationWindow: 24,
                        bufferTime: 0,
                        slotInterval: 30,
                        imageUrl: '',
                        schedules: getDefaultSchedules()
                    });
                    setHasUnsavedChanges(false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, []);

    const ensureMainStaff = async (businessId: string) => {
        const staffList = await apiFetch(`/staff/business/${businessId}`);
        if (Array.isArray(staffList) && staffList.length > 0) {
            return staffList[0];
        }
        return await apiFetch(`/staff/business/${businessId}`, {
            method: 'POST',
            body: JSON.stringify({ name: 'Agenda principal', role: 'Titular' })
        });
    };

    const saveStaffSchedules = async (businessId: string, schedules: any[]) => {
        const staff = await ensureMainStaff(businessId);
        await apiFetch(`/staff/${staff.id}/schedule`, {
            method: 'PUT',
            body: JSON.stringify({ schedules })
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: formData.name || 'Mi Local',
                description: formData.description || '',
                slotInterval: formData.slotInterval || 30,
                minLeadTime: formData.minLeadTime || 0,
                maxBookingWindow: formData.maxBookingWindow || 365,
                cancellationWindow: formData.cancellationWindow || 0,
                bufferTime: formData.bufferTime || 0,
                address: formData.address || '',
                latitude: formData.latitude,
                longitude: formData.longitude,
                imageUrl: formData.imageUrl
            };

            // Clean schedules: remove DB fields that might cause issues with createMany
            const cleanedSchedules = (formData.schedules || getDefaultSchedules()).map(({ id, staffId, createdAt, updatedAt, ...rest }: any) => rest);

            if (business?.id) {
                await apiFetch(`/businesses/${business.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                });
                await saveStaffSchedules(business.id, cleanedSchedules);
                setHasUnsavedChanges(false);
            } else {
                const businessToCreate = {
                    ...payload,
                    schedules: formData.schedules || getDefaultSchedules()
                };

                const newBusiness = await apiFetch('/businesses', {
                    method: 'POST',
                    body: JSON.stringify(businessToCreate),
                });
                await saveStaffSchedules(newBusiness.id, cleanedSchedules);
                setBusiness(newBusiness);
                setFormData((prev: any) => ({ ...prev, id: newBusiness.id }));
                setHasUnsavedChanges(false);
            }

            if (isFinalizing) {
                router.push('/professional/dashboard');
            } else {
                // Re-fetch to get latest business data (with staff/schedules)
                const data = await apiFetch('/businesses/my');
                if (data && data.length > 0) {
                    setBusiness(data[0]);
                    setHasUnsavedChanges(false);
                }
                alert('Configuración guardada correctamente');
            }
        } catch (err: any) {
            console.error(err);
            const uiMessage =
                err?.message ||
                err?.data?.message ||
                (Array.isArray(err?.data?.errors) && err.data.errors[0]?.message) ||
                'No se pudo guardar. Revisa los campos e inténtalo de nuevo.';
            alert(`Error al guardar: ${uiMessage}`);
        } finally {
            setSaving(false);
            setIsFinalizing(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-slate-500">Cargando configuración...</div>;

    const renderForm = () => {
        const currentData = formData;
        const isNew = !business?.id;
        // Calculate dynamic progress
        const hasPolicies = business && [
            business?.minLeadTime,
            business?.maxBookingWindow,
            business?.cancellationWindow,
            business?.bufferTime,
            business?.slotInterval
        ].every((value) => value !== null && value !== undefined);

        const hasSchedules = business && 
            Array.isArray(business?.staff) && 
            business.staff.length > 0 && 
            Array.isArray(business.staff[0].schedules) && 
            business.staff[0].schedules.length > 0;

        const hasServices = Array.isArray(business?.services) && business.services.length > 0;

        const hasProfileComplete = business?.name && business?.address && business?.imageUrl;
        const canSaveProfile = formData.name && formData.address && formData.imageUrl;
        const steps = [!!hasProfileComplete, !!(hasPolicies && hasSchedules), hasServices].filter(Boolean).length;
        const currentStep = steps < 3 ? steps + 1 : 3;

        const dayNames: { [key: string]: string } = {
            mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves',
            fri: 'Viernes', sat: 'Sábado', sun: 'Domingo'
        };

        const handleScheduleChange = (index: number, field: string, value: any) => {
            const newSchedules = [...(currentData.schedules || [])];
            newSchedules[index] = { ...newSchedules[index], [field]: value };
            setFormData({ ...currentData, schedules: newSchedules });
            setHasUnsavedChanges(true);
        };

        return (
            <form onSubmit={handleUpdate} className="space-y-8">
                <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-6 md:p-7">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Onboarding profesional</p>
                            <h2 className="text-2xl font-black text-neutral-900 mt-1">
                                {steps === 3 ? 'Configuración completa' : `Paso ${currentStep} de 3: ${steps === 0 ? 'Perfil del negocio' : (steps === 1 ? 'Horarios y políticas' : 'Crear servicios')}`}
                            </h2>
                            <p className="text-neutral-600 mt-2">
                                {steps === 3 ? 'Tu negocio está listo para recibir reservas.' : 'Completa los pasos para activar tu perfil en el marketplace.'}
                            </p>
                        </div>
                        <div className="min-w-[220px]">
                            <div className="h-2.5 rounded-full bg-indigo-100 overflow-hidden">
                                <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(steps / 3) * 100}%` }} />
                            </div>
                            <p className="text-xs text-neutral-600 mt-2 font-semibold">{steps}/3 completado</p>
                        </div>
                    </div>
                </div>

                {/* Datos Básicos */}
                <section className="space-y-6 border-t border-neutral-200 pt-8">
                    <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                        Perfil del negocio
                    </h2>
                    <p className="text-sm text-neutral-600">
                        Usa un nombre claro y una descripción breve: esto es lo primero que verá el cliente al encontrarte.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Nombre del local</label>
                            <input
                                type="text"
                                required
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                                value={currentData.name}
                                placeholder="Ej: Barbería Zyro"
                                onChange={e => {
                                    setFormData({ ...currentData, name: e.target.value });
                                    setHasUnsavedChanges(true);
                                }}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <ImageUpload
                                label="Imagen principal del local"
                                value={currentData.imageUrl}
                                required
                                onChange={(url) => {
                                    setFormData({ ...currentData, imageUrl: url });
                                    setHasUnsavedChanges(true);
                                }}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Dirección del local</label>
                            <AddressAutocomplete
                                value={currentData.address}
                                required
                                onChange={(addr, lat, lng) => {
                                    setFormData({ ...currentData, address: addr, latitude: lat, longitude: lng });
                                    setHasUnsavedChanges(true);
                                }}
                                placeholder="Ej: Calle Gran Vía, 1, Madrid"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Descripción (opcional)</label>
                            <textarea
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900 h-32 placeholder:text-neutral-400"
                                value={currentData.description || ''}
                                onChange={e => {
                                    setFormData({ ...currentData, description: e.target.value });
                                    setHasUnsavedChanges(true);
                                }}
                                placeholder="Cuéntale a tus clientes qué ofreces..."
                            ></textarea>
                        </div>
                    </div>
                </section>

                {!isNew && (
                    <section className="space-y-6 border-t border-neutral-200 pt-8">
                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                            Reglas de reserva
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-800 mb-1 ml-1">Lead Time Mínimo (min)</label>
                                <p className="text-[10px] uppercase font-black text-neutral-500 mb-3 ml-1 tracking-wider italic">Antelación mínima para reservar</p>
                                <input
                                    type="number"
                                    className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900"
                                    value={currentData.minLeadTime}
                                    onChange={e => {
                                        setFormData({ ...currentData, minLeadTime: Number(e.target.value) });
                                        setHasUnsavedChanges(true);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-800 mb-1 ml-1">Ventana de Reserva (días)</label>
                                <p className="text-[10px] uppercase font-black text-neutral-500 mb-3 ml-1 tracking-wider italic">Límite a futuro para reservar</p>
                                <input
                                    type="number"
                                    className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900"
                                    value={currentData.maxBookingWindow}
                                    onChange={e => {
                                        setFormData({ ...currentData, maxBookingWindow: Number(e.target.value) });
                                        setHasUnsavedChanges(true);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-800 mb-1 ml-1">Cancelación (horas)</label>
                                <p className="text-[10px] uppercase font-black text-neutral-500 mb-3 ml-1 tracking-wider italic">Antelación mínima para cancelar</p>
                                <input
                                    type="number"
                                    className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900"
                                    value={currentData.cancellationWindow}
                                    onChange={e => {
                                        setFormData({ ...currentData, cancellationWindow: Number(e.target.value) });
                                        setHasUnsavedChanges(true);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-800 mb-1 ml-1">Buffer Time (min)</label>
                                <p className="text-[10px] uppercase font-black text-neutral-500 mb-3 ml-1 tracking-wider italic">Descanso automático entre citas</p>
                                <input
                                    type="number"
                                    className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900"
                                    value={currentData.bufferTime}
                                    onChange={e => {
                                        setFormData({ ...currentData, bufferTime: Number(e.target.value) });
                                        setHasUnsavedChanges(true);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-800 mb-1 ml-1">Intervalo de Citas (min)</label>
                                <p className="text-[10px] uppercase font-black text-neutral-500 mb-3 ml-1 tracking-wider italic">Bloques de tiempo (ej: cada 30 min)</p>
                                <select
                                    className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900 appearance-none"
                                    value={currentData.slotInterval || 30}
                                    onChange={e => {
                                        setFormData({ ...currentData, slotInterval: Number(e.target.value) });
                                        setHasUnsavedChanges(true);
                                    }}
                                >
                                    <option value={15}>15 minutos</option>
                                    <option value={30}>30 minutos</option>
                                    <option value={45}>45 minutos</option>
                                    <option value={60}>1 hora</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving || !hasUnsavedChanges}
                                className={`font-bold py-3 px-6 rounded-xl shadow-lg transition-all ${
                                    hasUnsavedChanges
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                }`}
                            >
                                {saving ? 'Guardando configuración...' : hasUnsavedChanges ? 'Guardar configuración' : 'Configuración guardada'}
                            </button>
                        </div>
                    </section>
                )}

                {!isNew && (
                    <section className="space-y-8 border-t border-neutral-200 pt-8">
                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                            Horario de trabajo
                        </h2>

                        <div className="space-y-4">
                            {currentData.schedules?.map((sch, idx) => (
                                <div key={sch.dayOfWeek} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200 group hover:border-indigo-400/60 transition-all">
                                    <div className="w-24 font-bold text-neutral-800">
                                        {dayNames[sch.dayOfWeek]}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-neutral-900 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={sch.startTime}
                                            disabled={!sch.isAvailable}
                                            onChange={(e) => handleScheduleChange(idx, 'startTime', e.target.value)}
                                        />
                                        <span className="text-neutral-500">a</span>
                                        <input
                                            type="time"
                                            className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-neutral-900 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={sch.endTime}
                                            disabled={!sch.isAvailable}
                                            onChange={(e) => handleScheduleChange(idx, 'endTime', e.target.value)}
                                        />
                                    </div>

                                    <div className="ml-auto flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${sch.isAvailable ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-500/10'}`}>
                                            {sch.isAvailable ? 'Abierto' : 'Cerrado'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleScheduleChange(idx, 'isAvailable', !sch.isAvailable)}
                                            className={`w-12 h-6 rounded-full relative transition-all ${sch.isAvailable ? 'bg-indigo-600' : 'bg-neutral-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${sch.isAvailable ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-sm text-neutral-600">
                        {isNew ? 'Al guardar, se activará el siguiente paso: reglas y horarios.' : 'Guarda cambios para actualizar tu disponibilidad en tiempo real.'}
                    </p>
                    <div className="flex w-full md:w-auto gap-3">
                    {isNew && (
                        <button
                            type="submit"
                            disabled={saving || !canSaveProfile}
                            className="w-full md:w-auto min-w-[260px] bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:grayscale active:scale-[0.98] text-sm uppercase tracking-wide"
                        >
                            {saving ? 'Creando perfil...' : 'Guardar y continuar'}
                        </button>
                    )}
                    {!isNew && (
                        <button
                            type="submit"
                            onClick={() => setIsFinalizing(true)}
                            disabled={saving}
                            className="w-full md:w-auto min-w-[260px] text-center bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-6 rounded-2xl shadow-lg transition-all text-sm uppercase tracking-wide disabled:opacity-50"
                        >
                            {saving && isFinalizing ? 'Guardando y finalizando...' : 'Finalizar configuración'}
                        </button>
                    )}
                    </div>
                </div>
            </form>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 mb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Configuración del negocio</h1>
                    <p className="text-neutral-600 mt-1">
                        {business?.id ? 'Gestiona la información pública y tus políticas de reserva.' : 'Primero debes crear el perfil de tu local para empezar a recibir reservas.'}
                    </p>
                </div>
                <Link
                    href="/professional/dashboard"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50 shadow-sm transition-all text-sm font-bold w-fit"
                >
                    <span>←</span> Volver al Dashboard
                </Link>
            </header>

            {renderForm()}
        </div>
    );
}
