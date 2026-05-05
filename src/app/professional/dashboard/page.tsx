'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from '@/services/api';
import { Booking } from '@/types';
import Link from 'next/link';
import { CalendarCheck, CalendarClock, CircleDollarSign, Star, Sparkles } from 'lucide-react';

export default function ProfessionalDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [hasBusinessProfile, setHasBusinessProfile] = useState(false);
    const [hasPoliciesAndSchedules, setHasPoliciesAndSchedules] = useState(false);
    const [hasServicesSet, setHasServicesSet] = useState(false);
    const [onboardingProgress, setOnboardingProgress] = useState(0);
    const [business, setBusiness] = useState<any>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const businesses = await apiFetch('/businesses/my');
                const business = Array.isArray(businesses) && businesses.length > 0 ? businesses[0] : null;
                const hasProfile = !!business?.id;
                const hasPolicies = hasProfile && [
                    business?.minLeadTime,
                    business?.maxBookingWindow,
                    business?.cancellationWindow,
                    business?.bufferTime,
                    business?.slotInterval
                ].every((value) => typeof value === 'number');

                const hasSchedules = hasProfile && 
                    Array.isArray(business?.staff) && 
                    business.staff.length > 0 && 
                    Array.isArray(business.staff[0].schedules) && 
                    business.staff[0].schedules.length > 0;

                let hasServices = Array.isArray(business?.services) && business.services.length > 0;
                if (!hasServices && business?.id) {
                    const services = await apiFetch(`/services?businessId=${business.id}`);
                    hasServices = Array.isArray(services) && services.length > 0;
                }

                // Check specifically for what might be missing in policies
                const missingPolicies = !business ? [] : [
                    'minLeadTime', 'maxBookingWindow', 'cancellationWindow', 'bufferTime', 'slotInterval'
                ].filter(k => business[k] === null || business[k] === undefined);
                
                const hasPoliciesSet = hasProfile && missingPolicies.length === 0;
                const policiesAndSchedulesDone = hasPoliciesSet && hasSchedules;

                const completedSteps = [hasProfile, policiesAndSchedulesDone, hasServices].filter(Boolean).length;

                setBusiness(business);
                setHasBusinessProfile(hasProfile);
                setHasPoliciesAndSchedules(policiesAndSchedulesDone);
                setHasServicesSet(hasServices);
                setOnboardingProgress(completedSteps);
                setLoadingProfile(false);

                if (!hasProfile) {
                    setBookings([]);
                    return;
                }

                const data = await apiFetch('/bookings/business');
                setBookings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingProfile(false);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const todayBookings = bookings.filter(b => {
        const d = new Date(b.startTime);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    });
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
    const estimatedRevenue = confirmedBookings.reduce((acc, curr) => {
        const servicesTotal = curr.services?.reduce((sAcc, sCurr) => sAcc + Number(sCurr.price), 0) || 0;
        return acc + servicesTotal;
    }, 0);
    const nextBookings = [...bookings]
        .filter(b => new Date(b.startTime) >= new Date())
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 4);
    
    const onboardingActive = !loadingProfile && onboardingProgress < 3;
    const steps = [!!business?.id, !!(hasPoliciesAndSchedules), hasServicesSet].filter(Boolean).length;
    const currentStep = steps < 3 ? steps + 1 : 3;

    const onboardingCta = steps === 0 
        ? { label: 'Comenzar perfil', href: '/professional/settings?onboarding=1' }
        : steps === 1 
            ? { label: 'Configurar horarios', href: '/professional/settings?onboarding=1' }
            : { label: 'Añadir servicios', href: '/professional/services' };

    const handleCancel = async (id: string) => {
        const reason = window.prompt('Indique el motivo de la cancelación para el cliente:');
        if (reason === null) return; // User cancelled prompt

        try {
            await apiFetch(`/bookings/${id}`, {
                method: 'DELETE',
                body: JSON.stringify({ reason })
            });
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellationId, setCancellationId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    const handleCancelClick = (id: string) => {
        setCancellationId(id);
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        if (!cancellationId) return;

        try {
            await apiFetch(`/bookings/${cancellationId}`, {
                method: 'DELETE',
                body: JSON.stringify({ reason: cancelReason })
            });
            setBookings(prev => prev.map(b => b.id === cancellationId ? { ...b, status: 'CANCELLED' } : b));
            setShowCancelModal(false);
            setCancelReason('');
            setCancellationId(null);
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="space-y-8 relative">
            {/* Custom Cancellation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowCancelModal(false)} />
                    <div className="relative z-[110] w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300">
                        <h3 className="text-2xl font-black text-neutral-900 mb-2">Cancelar Reserva</h3>
                        <p className="text-neutral-500 mb-6 font-medium">Por favor, indica el motivo de la cancelación. El cliente recibirá una notificación.</p>
                        
                        <textarea
                            autoFocus
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Ej: El profesional no podrá asistir por motivos personales..."
                            className="w-full h-32 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-900 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium resize-none cursor-text"
                        />

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-6 py-4 rounded-xl bg-neutral-100 text-neutral-600 font-bold hover:bg-neutral-200 transition-all"
                            >
                                Volver
                            </button>
                            <button
                                onClick={confirmCancel}
                                disabled={!cancelReason.trim()}
                                className="flex-2 px-8 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                            >
                                Confirmar Cancelación
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {onboardingActive && (
                <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-6 md:p-7 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Onboarding profesional</p>
                            <h2 className="text-2xl font-black text-neutral-900 mt-1">
                                {steps === 3 ? 'Configuración completa' : `Paso ${currentStep} de 3: ${steps === 0 ? 'Perfil' : (steps === 1 ? 'Horarios y políticas' : 'Crear servicios')}`}
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
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <div className={`rounded-2xl border p-4 ${hasBusinessProfile ? 'border-emerald-300 bg-emerald-50' : 'border-neutral-200 bg-white'}`}>
                            <p className={`text-xs font-black uppercase tracking-wider ${hasBusinessProfile ? 'text-emerald-700' : 'text-amber-600'}`}>Paso 1</p>
                            <p className="font-semibold text-neutral-900 mt-1">Datos del negocio</p>
                        </div>
                        <div className={`rounded-2xl border p-4 ${hasPoliciesAndSchedules ? 'border-emerald-300 bg-emerald-50' : 'border-neutral-200 bg-white opacity-80'}`}>
                            <p className={`text-xs font-black uppercase tracking-wider ${hasPoliciesAndSchedules ? 'text-emerald-700' : 'text-neutral-500'}`}>Paso 2</p>
                            <p className="font-semibold text-neutral-700 mt-1">Horarios y politicas</p>
                            {!hasPoliciesAndSchedules && hasBusinessProfile && (
                                <p className="text-[10px] text-amber-600 mt-1 font-bold">
                                    Falta: {!hasPoliciesAndSchedules ? (hasBusinessProfile && !hasPoliciesAndSchedules && Array.isArray(business?.staff) && business.staff.length > 0 && Array.isArray(business.staff[0].schedules) && business.staff[0].schedules.length > 0 ? 'Revisar políticas' : 'Configurar horarios') : ''}
                                </p>
                            )}
                        </div>
                        <div className={`rounded-2xl border p-4 ${hasServicesSet ? 'border-emerald-300 bg-emerald-50' : 'border-neutral-200 bg-white opacity-80'}`}>
                            <p className={`text-xs font-black uppercase tracking-wider ${hasServicesSet ? 'text-emerald-700' : 'text-neutral-500'}`}>Paso 3</p>
                            <p className="font-semibold text-neutral-700 mt-1">Crear servicios</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Link href={onboardingCta.href} className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                            {onboardingCta.label}
                        </Link>
                    </div>
                </section>
            )}

            <section className="rounded-3xl border border-neutral-100 bg-white p-7 md:p-8 text-neutral-900 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-2">Panel Profesional</p>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900">Hola, {user?.name || 'Profesional'}</h1>
                        <p className="text-neutral-500 mt-2 font-medium">Gestiona tus reservas y haz crecer tu negocio desde un solo lugar.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/" className="px-5 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 font-bold hover:bg-neutral-200 transition-colors">
                            Ir al inicio
                        </Link>
                        <Link href={onboardingActive ? "/professional/settings?onboarding=1" : "/professional/services"} className="px-5 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 font-bold hover:bg-neutral-200 transition-colors">
                            Gestionar servicios
                        </Link>
                        <Link href="/professional/settings" className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-md transition-colors">
                            Configurar negocio
                        </Link>
                    </div>
                </div>
            </section>

            <section className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${onboardingActive ? 'opacity-60' : ''}`}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Citas hoy</p>
                    <p className="text-3xl font-black text-neutral-900">{todayBookings.length}</p>
                    <div className="mt-3 flex items-center gap-2 text-indigo-600 text-sm font-semibold"><CalendarCheck className="w-4 h-4" /> Agenda diaria</div>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Reservas confirmadas</p>
                    <p className="text-3xl font-black text-neutral-900">{confirmedBookings.length}</p>
                    <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm font-semibold"><CalendarClock className="w-4 h-4" /> Próximas citas</div>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Ingresos estimados</p>
                    <p className="text-3xl font-black text-neutral-900">{estimatedRevenue}EUR</p>
                    <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm font-semibold"><CircleDollarSign className="w-4 h-4" /> Basado en confirmadas</div>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Valoración</p>
                    <p className="text-3xl font-black text-neutral-900">{business?.rating ?? '--'}</p>
                    <div className="mt-3 flex items-center gap-2 text-amber-500 text-sm font-semibold"><Star className="w-4 h-4 fill-current" /> Opiniones de clientes</div>
                </div>
            </section>

            <section className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${onboardingActive ? 'opacity-60 pointer-events-none select-none' : ''}`}>
                <div className="lg:col-span-2 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-black text-neutral-900 mb-4">Agenda de hoy</h2>
                    {loading ? (
                        <p className="py-12 text-center text-neutral-500">Cargando agenda...</p>
                    ) : todayBookings.length === 0 ? (
                        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-8 text-center">
                            <p className="text-neutral-700 font-semibold">Hoy no tienes citas programadas.</p>
                            <p className="text-sm text-neutral-500 mt-2">Aprovecha para mejorar tu perfil y activar más servicios.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {todayBookings.map((b) => (
                                <div key={b.id} className="rounded-2xl border border-neutral-200 p-4 flex items-center justify-between group hover:border-indigo-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center font-black text-indigo-600">
                                            {new Date(b.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900">
                                                {b.services?.[0]?.service?.name || 'Servicio'}
                                            </p>
                                            <p className="text-sm text-neutral-500 flex items-center gap-2">
                                                Cliente: <span className="font-bold text-neutral-700">{b.user?.name || 'Anónimo'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {b.status !== 'CANCELLED' && (
                                            <button 
                                                onClick={() => handleCancelClick(b.id)}
                                                className="px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100 flex items-center gap-2"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                                Cancelar
                                            </button>
                                        )}
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${b.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {b.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            Próximas reservas
                        </h3>
                        {nextBookings.length === 0 ? (
                            <p className="text-sm text-neutral-500">Aun no hay reservas futuras.</p>
                        ) : (
                            <ul className="space-y-4">
                                {nextBookings.map((b) => (
                                    <li key={b.id} className="flex flex-col gap-1">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-black text-neutral-400 uppercase">
                                                {new Date(b.startTime).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${b.status === 'CANCELLED' ? 'text-red-400' : 'text-indigo-400'}`}>
                                                {b.status}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-neutral-800">{b.services?.[0]?.service?.name || 'Servicio'}</p>
                                        <p className="text-[10px] text-neutral-500">Cliente: {b.user?.name || 'Anónimo'}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
