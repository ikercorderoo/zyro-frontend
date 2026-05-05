'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/services/api';
import Link from 'next/link';
import { showToast } from '@/components/ui/Toast';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CLIENT' as 'CLIENT' | 'PROFESSIONAL',
        cif: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            setSuccess(true);
            showToast('Cuenta creada. ¡Revisa tu email!');
        } catch (err: any) {
            if (err.errors && Array.isArray(err.errors)) {
                const messages = err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
                setError(messages);
                showToast(messages, 'error');
            } else {
                setError(err.message || 'Error al registrarse');
                showToast(err.message || 'Error en el registro', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div
                className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/barberia_hero.png')" }}
            >
                <div className="absolute inset-0 bg-black/65" />
                <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/60 relative z-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-neutral-900 tracking-tight">¡Casi listo!</h2>
                    <p className="text-neutral-600 font-medium">
                        Hemos enviado un **código de seguridad de 6 dígitos** a <span className="text-indigo-600 font-bold">{formData.email}</span>.
                    </p>
                    <p className="text-neutral-500 text-sm">
                        Por favor, revisa tu bandeja de entrada e introduce el código para activar tu cuenta.
                    </p>
                    <Link 
                        href="/verify-email" 
                        className="block w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                    >
                        Introducir código
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/barberia_hero.png')" }}
        >
            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-indigo-950/40" />

            <Link
                href="/"
                className="absolute top-8 left-8 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl z-20"
                title="Volver al inicio"
            >
                ←
            </Link>

            <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/60 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter italic mb-2">
                        <span className="text-indigo-600">ZYRO</span>
                        <sup className="text-indigo-600 font-serif not-italic text-sm ml-0.5">TM</sup>
                    </h1>
                    <p className="text-neutral-600">Empieza a reservar en segundos</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 ml-1">Nombre completo</label>
                        <input
                            type="text"
                            required
                            className="w-full px-5 py-3.5 rounded-2xl bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                            placeholder="Juan Pérez"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-5 py-3.5 rounded-2xl bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 ml-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-5 py-3.5 rounded-2xl bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2 ml-1">¿Qué tipo de usuario eres?</label>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'CLIENT', cif: '' })}
                                className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all ${formData.role === 'CLIENT'
                                        ? 'border-indigo-600 bg-indigo-100 text-indigo-800 shadow-md ring-2 ring-indigo-200'
                                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-indigo-300 hover:bg-indigo-50/60'
                                    }`}
                            >
                                <span className="block font-semibold">Cliente</span>
                                <span className="block text-sm opacity-80">Quiero reservar servicios</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'PROFESSIONAL' })}
                                className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all ${formData.role === 'PROFESSIONAL'
                                        ? 'border-indigo-600 bg-indigo-100 text-indigo-800 shadow-md ring-2 ring-indigo-200'
                                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-indigo-300 hover:bg-indigo-50/60'
                                    }`}
                            >
                                <span className="block font-semibold">Profesional</span>
                                <span className="block text-sm opacity-80">Tengo un negocio</span>
                            </button>
                        </div>
                    </div>

                    {formData.role === 'PROFESSIONAL' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-sm font-semibold text-neutral-700 mb-2 ml-1">CIF de la empresa</label>
                            <input
                                type="text"
                                required
                                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                                placeholder="B12345678"
                                value={formData.cif}
                                onChange={(e) => setFormData({ ...formData, cif: e.target.value })}
                            />
                            <p className="text-[10px] text-neutral-500 mt-2 ml-1">Necesario para verificar tu actividad profesional</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-700/30 transition-all disabled:opacity-50 mt-2 active:scale-[0.98]"
                    >
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>

                <p className="mt-8 text-center text-neutral-600 text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
