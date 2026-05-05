'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/services/api';
import Link from 'next/link';
import { showToast } from '@/components/ui/Toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            login(data.user, data.token);
            showToast('¡Bienvenido de nuevo!');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
            showToast('Error al iniciar sesión', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-8 left-8 p-3 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-indigo-600 transition-all shadow-lg z-20"
                title="Volver al inicio"
            >
                ←
            </Link>
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-neutral-100 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black tracking-tighter italic">
                        <span className="text-indigo-600">ZYRO</span>
                        <sup className="text-indigo-600 font-serif not-italic text-sm ml-0.5">TM</sup>
                    </h1>
                    <p className="text-neutral-500 mt-2 font-medium">Inicia sesión en tu cuenta</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-white border border-neutral-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 ml-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-white border border-neutral-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-900/20 transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                        {loading ? 'Entrando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="mt-10 text-center text-neutral-500 text-sm">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div >
    );
}
