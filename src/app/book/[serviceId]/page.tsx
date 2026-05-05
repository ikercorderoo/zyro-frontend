'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/services/api';
import { Service } from '@/types';
import Navbar from '@/components/layout/Navbar';
import {
    Calendar as CalendarIcon,
    Clock,
    ArrowLeft,
    CheckCircle2,
    User,
    CreditCard
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export default function BookingFlowPage() {
    const { serviceId } = useParams();
    const router = useRouter();
    const [service, setService] = useState<Service | null>(null);
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
    const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await apiFetch(`/services/${serviceId}`);
                setService(data);
            } catch (error) {
                showToast('Servicio no encontrado', 'error');
                router.push('/');
            }
        };
        fetchService();
    }, [serviceId, router]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (!service || !serviceId || !selectedDate) return;
            try {
                setLoading(true);
                const addonQuery = selectedAddonIds.length > 0 ? `&addonIds=${selectedAddonIds.join(',')}` : '';
                const data = await apiFetch(`/bookings/available-slots?serviceId=${serviceId}&date=${selectedDate}${addonQuery}`);
                setSlots(Array.isArray(data) ? data : data.slots || []);
                setSelectedStaffId(Array.isArray(data) ? null : data.staffId || null);
            } catch (error) {
                showToast('Error al cargar horarios', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [service, serviceId, selectedDate, selectedAddonIds]);

    const handleBooking = async () => {
        if (!selectedSlot) return;
        setBookingLoading(true);
        try {
            // Construct local date using components to be safe across browsers
            const [year, month, day] = selectedDate.split('-').map(Number);
            const [hour, minute] = selectedSlot.split(':').map(Number);
            const localDateTime = new Date(year, month - 1, day, hour, minute);
            
            await apiFetch('/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    serviceId,
                    staffId: selectedStaffId,
                    serviceIds: serviceId ? [String(serviceId)] : undefined,
                    addonIds: selectedAddonIds,
                    startTime: localDateTime.toISOString(),
                })
            });
            showToast('¡Reserva confirmada con éxito!', 'success');
            setStep(3);
        } catch (error: any) {
            showToast(error.message || 'Error al reservar', 'error');
        } finally {
            setBookingLoading(false);
        }
    };

    if (!service) return null;

    return (
        <div className="min-h-screen bg-white font-sans pb-20">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-32">
                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-12">
                    <button onClick={() => router.back()} className="text-neutral-500 hover:text-indigo-600 transition-all flex items-center gap-2 font-bold">
                        <ArrowLeft className="w-5 h-5" /> Volver
                    </button>
                    <div className="flex items-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= s ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-400 border border-neutral-200'}`}>
                                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                                </div>
                                {s < 3 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-indigo-600' : 'bg-neutral-200'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 1: Date & Time */}
                {step === 1 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-neutral-900 tracking-tight">Elige el <span className="text-indigo-600 italic font-serif">momento</span> perfecto.</h2>
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="text-neutral-500 font-medium">
                                    {service.name} • {service.price}€ • {service.duration} min
                                </p>
                                {selectedAddonIds.length > 0 && (
                                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-in zoom-in">
                                        <span className="text-[10px] uppercase font-black text-emerald-600 tracking-wider">Total estimado:</span>
                                        <span className="text-sm font-black text-neutral-900">
                                            {Number(service.price) + selectedAddonIds.reduce((acc, id) => {
                                                const addon = service.addons?.find(a => a.id === id);
                                                return acc + (addon ? Number(addon.price) : 0);
                                            }, 0)}€
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {service.addons && service.addons.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-neutral-200 space-y-4">
                                    <h4 className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Complementos Sugeridos</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {service.addons.map(addon => {
                                            const isSelected = selectedAddonIds.includes(addon.id);
                                            return (
                                                <button
                                                    key={addon.id}
                                                    onClick={() => {
                                                        setSelectedAddonIds(prev => 
                                                            prev.includes(addon.id) ? prev.filter(id => id !== addon.id) : [...prev, addon.id]
                                                        );
                                                        setSelectedSlot(null); // Reset slot since duration changed
                                                    }}
                                                    className={`relative px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold flex flex-col items-start ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-neutral-200 text-neutral-600 hover:border-indigo-300'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{addon.name}</span>
                                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white animate-in zoom-in" />}
                                                    </div>
                                                    <span className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'opacity-60'}`}>+{addon.price}€ · +{addon.duration} min</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Date Picker */}
                            <div className="space-y-6">
                                <h4 className="text-neutral-900 font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                                    <CalendarIcon className="w-4 h-4 text-indigo-600" /> Fecha del servicio
                                </h4>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full bg-white border border-neutral-200 p-4 rounded-2xl text-neutral-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold shadow-sm"
                                />
                            </div>

                            {/* Slots Grid */}
                            <div className="space-y-6">
                                <h4 className="text-neutral-900 font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                                    <Clock className="w-4 h-4 text-indigo-600" /> Horarios disponibles
                                </h4>
                                {loading ? (
                                    <div className="flex gap-2 animate-pulse">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-20 bg-neutral-100 rounded-xl" />)}
                                    </div>
                                ) : slots.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {slots.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-3 rounded-xl border font-bold transition-all ${selectedSlot === slot ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white border-neutral-200 text-neutral-600 hover:border-indigo-300'}`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-red-500 text-sm font-medium">No hay citas disponibles para este día.</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-neutral-200 flex justify-end">
                            <button
                                disabled={!selectedSlot}
                                onClick={() => setStep(2)}
                                className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-indigo-200"
                            >
                                Siguiente paso
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Confirm Details */}
                {step === 2 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-4 text-center">
                            <h2 className="text-4xl font-black text-neutral-900 tracking-tight">Confirma tu <span className="text-indigo-600 italic font-serif">reserva</span>.</h2>
                            <p className="text-neutral-500 font-medium">Revisa los detalles antes de finalizar.</p>
                        </div>

                        <div className="max-w-md mx-auto p-10 rounded-[2.5rem] bg-white border border-neutral-100 space-y-8 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center py-4 border-b border-neutral-100">
                                    <span className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Servicio</span>
                                    <span className="text-neutral-900 font-black">{service.name}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-neutral-100">
                                    <span className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Fecha</span>
                                    <span className="text-neutral-900 font-black">{selectedDate}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-neutral-100">
                                    <span className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Hora</span>
                                    <span className="text-neutral-900 font-black">{selectedSlot}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-neutral-100">
                                    <span className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Total</span>
                                    <span className="text-indigo-600 text-2xl font-black">
                                        {Number(service.price) + selectedAddonIds.reduce((acc, id) => {
                                            const addon = service.addons?.find(a => a.id === id);
                                            return acc + (addon ? Number(addon.price) : 0);
                                        }, 0)}€
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={bookingLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl text-xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {bookingLoading ? 'Confirmando...' : 'Confirmar Reserva'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center space-y-8 py-20 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-6 border border-emerald-100">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h2 className="text-5xl font-black text-neutral-900 tracking-tight">¡Todo listo!</h2>
                        <p className="text-neutral-500 text-xl font-medium max-w-md mx-auto leading-relaxed">
                            Tu reserva en <span className="text-neutral-900 font-bold">{service.business.name}</span> ha sido confirmada. Hemos enviado los detalles a tu email.
                        </p>
                        <button
                            onClick={() => router.push('/client/dashboard')}
                            className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-200"
                        >
                            Ir a mis reservas
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
