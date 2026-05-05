import { Booking } from "@/types";
import Link from 'next/link';

interface BookingCardProps {
    booking: Booking;
    onCancel?: (id: string) => void;
    onReschedule?: (booking: Booking) => void;
    onReview?: (booking: Booking) => void;
}

export default function BookingCard({ booking, onCancel, onReschedule, onReview }: BookingCardProps) {
    const date = new Date(booking.startTime);
    const isPast = date < new Date();
    const businessSlug = booking.services?.[0]?.service?.business?.slug;

    const statusColors = {
        CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
        CANCELLED: 'bg-slate-50 text-slate-500 border-slate-100',
    };

    return (
        <div className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${isPast ? 'opacity-90' : 'hover:border-indigo-100'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusColors[booking.status]}`}>
                            {booking.status === 'CONFIRMED' ? 'Confirmada' : booking.status === 'CANCELLED' ? 'Cancelada' : 'Pendiente'}
                        </span>
                        {booking.feedback && (
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100">
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {booking.feedback.rating}
                            </span>
                        )}
                    </div>
                    <h4 className="text-xl font-black text-neutral-900 mt-2 tracking-tight">
                        {booking.services?.[0]?.service?.name || 'Servicio sin nombre'}
                    </h4>
                    <p className="text-indigo-600 text-sm font-black uppercase tracking-widest mt-1">
                        {booking.services?.[0]?.service?.business?.name || 'Negocio no disponible'}
                    </p>
                </div>
                <div className="text-right ml-4">
                    <p className="text-sm font-black text-neutral-900 capitalize">{date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="text-sm font-medium text-neutral-500">{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                {!isPast && booking.status !== 'CANCELLED' ? (
                    <>
                        <button
                            onClick={() => onReschedule?.(booking)}
                            className="flex-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 py-2.5 rounded-xl transition-colors border border-transparent hover:border-indigo-100"
                        >
                            Reprogramar
                        </button>
                        <button
                            onClick={() => onCancel?.(booking.id)}
                            className="flex-1 text-xs font-bold text-red-500 hover:bg-red-50 py-2.5 rounded-xl transition-colors border border-transparent hover:border-red-100"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex gap-2">
                            {isPast && booking.status !== 'CANCELLED' && !booking.feedback && (
                                <button
                                    onClick={() => onReview?.(booking)}
                                    className="flex-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                                >
                                    Dejar reseña
                                </button>
                            )}
                            {businessSlug && (
                                <Link
                                    href={`/business/${businessSlug}`}
                                    className="flex-1 text-center text-xs font-bold text-indigo-600 hover:bg-indigo-50 py-2.5 rounded-xl transition-all border border-indigo-100"
                                >
                                    Reservar de nuevo
                                </Link>
                            )}
                        </div>
                        {booking.feedback ? (
                            <div className="w-full text-center py-2 text-xs font-bold text-neutral-400 bg-neutral-50 rounded-xl border border-neutral-100">
                                Reseña enviada
                            </div>
                        ) : booking.status === 'CANCELLED' ? (
                            <div className="w-full text-center py-2 text-xs font-bold text-neutral-400 bg-neutral-50 rounded-xl">
                                Cita cancelada
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
