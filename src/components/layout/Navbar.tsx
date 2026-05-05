'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    if (!user) return null;

    const dashboardPath = user.role === 'CLIENT' ? '/client/dashboard'
        : user.role === 'PROFESSIONAL' ? '/professional/dashboard'
            : '/admin/dashboard';

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter italic">
                            ZYRO<sup className="text-[10px] ml-0.5 not-italic font-serif">TM</sup>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="hidden sm:flex items-center gap-3 text-sm font-bold text-neutral-900 bg-white hover:bg-neutral-50 px-4 py-2.5 rounded-2xl border border-neutral-200 shadow-sm transition-all active:scale-95"
                        >
                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-lg">
                                {user.role}
                            </span>
                            <span className="text-neutral-900">{user.name}</span>
                        </button>

                        {menuOpen && (
                            <div className="absolute top-16 right-0 min-w-56 rounded-2xl border border-neutral-100 bg-white shadow-2xl shadow-neutral-200/50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                <Link
                                    href="/"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-5 py-4 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors border-b border-neutral-50"
                                >
                                    Ir al inicio
                                </Link>
                                <Link
                                    href={dashboardPath}
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-5 py-4 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors border-b border-neutral-50"
                                >
                                    Ir a mi Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        logout();
                                    }}
                                    className="w-full text-left px-5 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
