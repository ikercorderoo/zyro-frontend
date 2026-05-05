'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/api';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export default function VerifyEmailPage() {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // Mover al siguiente input si hay valor
        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            showToast('Por favor, introduce los 6 dígitos', 'error');
            return;
        }

        setStatus('loading');
        try {
            const data = await apiFetch(`/auth/verify/${fullCode}`);
            setStatus('success');
            setMessage(data.message || '¡Cuenta verificada con éxito!');
            showToast('¡Verificación completada!', 'success');
            
            setTimeout(() => {
                router.push('/login');
            }, 2500);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'El código es incorrecto o ha expirado.');
            showToast(err.message || 'Error de verificación', 'error');
        }
    };

    // Auto-verify when 6th digit is entered
    useEffect(() => {
        if (code.every(digit => digit !== '') && status === 'idle') {
            handleVerify();
        }
    }, [code]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50" />

            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center relative z-10 border border-neutral-100">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-inner">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">Verifica tu identidad</h1>
                    <p className="text-neutral-500 font-medium text-sm px-4">
                        Hemos enviado un código de 6 dígitos a tu correo electrónico.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="space-y-6 animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-neutral-900">¡Todo listo!</h2>
                            <p className="text-neutral-600">{message}</p>
                        </div>
                        <p className="text-neutral-400 text-xs animate-pulse">Redirigiendo al login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-8">
                        <div className="flex justify-between gap-2 md:gap-3">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => (inputs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(index, e.target.value)}
                                    onKeyDown={e => handleKeyDown(index, e)}
                                    className={`w-12 h-16 md:w-14 md:h-20 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all
                                        ${status === 'error' ? 'border-red-200 bg-red-50 text-red-600' : 
                                          digit ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-4 ring-indigo-50' : 
                                          'border-neutral-200 bg-white text-neutral-900 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`}
                                />
                            ))}
                        </div>

                        {status === 'error' && (
                            <div className="flex items-center justify-center gap-2 text-red-600 text-sm font-bold bg-red-50 p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                                <XCircle className="w-4 h-4" />
                                <span>{message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading' || code.some(d => !d)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Verificar cuenta
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="pt-4 border-t border-neutral-100 text-sm text-neutral-500">
                            ¿No has recibido el código?{' '}
                            <button 
                                type="button"
                                className="text-indigo-600 font-bold hover:underline"
                                onClick={() => showToast('Código reenviado (simulado)')}
                            >
                                Reenviar código
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8">
                    <Link href="/register" className="text-neutral-400 hover:text-neutral-600 text-xs font-medium transition-colors">
                        ← Volver al registro
                    </Link>
                </div>
            </div>
        </div>
    );
}
