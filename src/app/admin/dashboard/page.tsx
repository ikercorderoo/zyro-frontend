'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/api';
import { User } from '@/types';
import Link from 'next/link';

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await apiFetch('/users'); // Assuming this endpoint exists for Admins
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="space-y-8 mb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-all"
                        title="Volver"
                    >
                        ←
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Panel de Administración 🛠️</h1>
                        <p className="text-slate-400 mt-1">Supervisión global de usuarios y actividad del sistema.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-600/90 text-white p-6 rounded-3xl shadow-xl shadow-indigo-950/20 backdrop-blur-xl border border-white/10">
                    <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-2">Total Usuarios</p>
                    <p className="text-4xl font-black">{users.length}</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 shadow-xl backdrop-blur-xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Locales Activos</p>
                    <p className="text-4xl font-black text-white">12</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 shadow-xl backdrop-blur-xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Citas (Mes)</p>
                    <p className="text-4xl font-black text-white">458</p>
                </div>
            </div>

            <div className="bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h2 className="font-bold text-slate-300 text-sm italic">Gestión de Usuarios</h2>
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">Real-time</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500">Consultando base de datos...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Usuario</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Rol</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                u.role === 'PROFESSIONAL' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors underline">Banear</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
