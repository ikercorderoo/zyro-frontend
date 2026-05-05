'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/api';
import { Service } from '@/types';
import ServiceCard from '@/components/ui/ServiceCard';
import Link from 'next/link';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingService, setBookingService] = useState<Service | null>(null);
    const [bookingDate, setBookingDate] = useState('');
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await apiFetch('/services');
                setServices(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingService) return;

        setProcessing(true);
        setMessage('');

        try {
            await apiFetch('/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    serviceId: bookingService.id,
                    startTime: new Date(bookingDate).toISOString(),
                }),
            });
            setMessage('✅ Reserva realizada con éxito');
            setTimeout(() => setBookingService(null), 2000);
        } catch (err: any) {
            setMessage(`❌ Error: ${err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-slate-500">Cargando servicios...</div>;

    return (
        <div className="space-y-8 mb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/client/dashboard"
                        className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-all"
                        title="Volver"
                    >
                        ←
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Servicios Disponibles</h1>
                        <p className="text-slate-400 mt-1">Encuentra y reserva el servicio perfecto para ti.</p>
                    </div>
                </div>
            </header>

            {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} onBook={setBookingService} />
                ))}
            </div>

            {/* Booking Modal */}
            {bookingService && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                    <div className="bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-bold text-white mb-2">Reservar cita</h2>
                        <p className="text-slate-400 mb-6">{bookingService.name} en {bookingService.business.name}</p>

                        <form onSubmit={handleBook} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2 ml-1">Selecciona Fecha y Hora</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                />
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm font-bold text-center animate-in fade-in duration-300 ${message.includes('✅') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setBookingService(null)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !bookingDate}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-xl shadow-indigo-950 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Procesando...' : 'Confirmar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
