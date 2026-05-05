'use client';

import { useState } from 'react';
import { Booking } from '@/types';
import { apiFetch } from '@/services/api';

interface ReviewModalProps {
    booking: Booking;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReviewModal({ booking, onClose, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await apiFetch('/utils/feedback', {
                method: 'POST',
                body: JSON.stringify({
                    bookingId: booking.id,
                    rating,
                    comment
                })
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al enviar la reseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Deja tu reseña</h3>
                            <p className="text-neutral-500 text-sm mt-1">¿Qué te pareció el servicio en <span className="font-bold text-indigo-600">{booking.services?.[0]?.service?.business?.name}</span>?</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-neutral-400 hover:text-neutral-600 p-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`w-12 h-12 flex items-center justify-center transition-all ${
                                        rating >= star ? 'text-amber-400 scale-110' : 'text-neutral-200'
                                    }`}
                                >
                                    <svg className="w-10 h-10 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2">Tu comentario (opcional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-32"
                                placeholder="Comparte tu experiencia..."
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-4 rounded-2xl font-bold text-neutral-600 hover:bg-neutral-50 border border-neutral-200 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                            >
                                {loading ? 'Enviando...' : 'Publicar reseña'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
