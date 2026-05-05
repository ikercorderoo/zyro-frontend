'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from '@/services/api';
import { Booking } from '@/types';
import BookingCard from '@/components/ui/BookingCard';
import ReviewModal from '@/components/ui/ReviewModal';
import Link from 'next/link';

export default function ClientDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await apiFetch('/bookings/my');
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm('¿Seguro que quieres cancelar esta reserva?')) return;
        try {
            await apiFetch(`/bookings/${id}`, { method: 'DELETE' });
            fetchBookings();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const now = new Date();
    const nextBookings = bookings
        .filter(b => new Date(b.startTime) > now && b.status !== 'CANCELLED')
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const pastBookings = bookings
        .filter(b => new Date(b.startTime) <= now || b.status === 'CANCELLED')
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Hola, {user?.name} 👋</h1>
                    <p className="text-neutral-500 mt-2 text-lg">Gestiona tus citas y reserva nuevos servicios.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                        href="/"
                        className="w-full md:w-auto text-center bg-white hover:bg-neutral-50 text-neutral-600 font-bold px-6 py-4 rounded-2xl border border-neutral-200 transition-all shadow-sm"
                    >
                        Ir al inicio
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Próximas Citas</p>
                    <p className="text-4xl font-black text-neutral-900">{nextBookings.length}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Historial Total</p>
                    <p className="text-4xl font-black text-neutral-900">{bookings.length}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Estatus</p>
                    <p className="text-2xl font-black text-indigo-600 mt-1">Cliente VIP</p>
                </div>
            </div>

            <div className="space-y-16">
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Tus próximas reservas</h2>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-neutral-100 animate-pulse h-48 rounded-3xl"></div>
                            ))}
                        </div>
                    ) : nextBookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {nextBookings.map(booking => (
                                <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-neutral-50 rounded-[2.5rem] border border-neutral-200 p-16 text-center border-dashed">
                            <p className="text-neutral-500 mb-8 text-lg font-medium">No tienes ninguna reserva activa.</p>
                            <Link href="/client/services" className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm">
                                Explorar servicios disponibles
                            </Link>
                        </div>
                    )}
                </section>

                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-1.5 bg-neutral-300 rounded-full"></div>
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Historial de citas</h2>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-neutral-100 animate-pulse h-48 rounded-3xl"></div>
                            ))}
                        </div>
                    ) : pastBookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastBookings.map(booking => (
                                <BookingCard 
                                    key={booking.id} 
                                    booking={booking} 
                                    onReview={(b) => setSelectedBookingForReview(b)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-400 font-medium italic text-center py-8">No hay historial de citas disponible.</p>
                    )}
                </section>
            </div>

            {selectedBookingForReview && (
                <ReviewModal 
                    booking={selectedBookingForReview}
                    onClose={() => setSelectedBookingForReview(null)}
                    onSuccess={() => {
                        fetchBookings();
                        alert('¡Gracias por tu reseña!');
                    }}
                />
            )}
        </div>
    );
}
