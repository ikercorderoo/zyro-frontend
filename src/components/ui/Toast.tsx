'use client';

import { useEffect, useState } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error';
}

let toastListener: (toast: Toast) => void = () => { };

export function showToast(message: string, type: 'success' | 'error' = 'success') {
    toastListener({ id: Math.random().toString(), message, type });
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        toastListener = (newToast) => {
            setToasts(prev => [...prev, newToast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newToast.id));
            }, 4000);
        };
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`px-6 py-4 rounded-2xl shadow-2xl pointer-events-auto animate-in slide-in-from-right-full duration-300 border backdrop-blur-xl ${toast.type === 'success'
                            ? 'bg-emerald-500/90 text-white border-emerald-400'
                            : 'bg-red-500/90 text-white border-red-400'
                        }`}
                >
                    <p className="font-bold flex items-center gap-2">
                        {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                    </p>
                </div>
            ))}
        </div>
    );
}
