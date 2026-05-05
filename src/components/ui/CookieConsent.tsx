'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('zyro_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('zyro_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('zyro_cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in fade-in slide-in-from-bottom-full duration-700">
            <div className="bg-white/95 backdrop-blur-md border-t border-neutral-200 px-6 py-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 hidden sm:flex">
                            <Cookie className="w-5 h-5 text-indigo-600" />
                        </div>
                        <p className="text-sm text-neutral-600 font-medium leading-relaxed max-w-2xl text-center lg:text-left">
                            Utilizamos cookies para mejorar tu experiencia. Al navegar, aceptas nuestra <Link href="/cookies" className="text-indigo-600 hover:underline font-bold">Política de Cookies</Link>. Puedes configurar tus preferencias o rechazarlas.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
                        <button 
                            onClick={handleAccept}
                            className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all active:scale-95 text-xs uppercase tracking-widest"
                        >
                            Aceptar
                        </button>
                        <button 
                            onClick={handleDecline}
                            className="px-8 py-3 bg-neutral-100 text-neutral-700 font-black rounded-xl hover:bg-neutral-200 transition-all active:scale-95 text-xs uppercase tracking-widest"
                        >
                            Rechazar
                        </button>
                        <Link 
                            href="/cookies"
                            className="px-8 py-3 border border-neutral-200 text-neutral-500 font-black rounded-xl hover:bg-neutral-50 transition-all active:scale-95 text-xs uppercase tracking-widest"
                        >
                            Configurar
                        </Link>
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors ml-2 hidden lg:block"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
