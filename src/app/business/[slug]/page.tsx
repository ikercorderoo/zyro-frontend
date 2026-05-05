'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/services/api';
import { getFullImageUrl } from '@/utils/url';
import { Business, Service } from '@/types';
import Navbar from '@/components/layout/Navbar';
import {
    Clock,
    MapPin,
    ChevronRight,
    Calendar,
    Star,
    Info,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export default function BusinessProfilePage() {
    const { slug } = useParams();
    const router = useRouter();
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const data = await apiFetch(`/marketplace/business/${slug}`);
                setBusiness(data);
            } catch (error) {
                showToast('No se pudo cargar el negocio', 'error');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, [slug, router]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!business) return null;

    return (
        <div className="min-h-screen bg-white font-sans pb-20">
            <Navbar />

            {/* Hero Profile Section */}
            <div className="relative h-[45vh] overflow-hidden bg-neutral-100">
                {(business.bannerUrl || business.imageUrl) ? (
                    <div className="absolute inset-0">
                        <img 
                            src={getFullImageUrl(business.bannerUrl || business.imageUrl)} 
                            alt="" 
                            className="w-full h-full object-cover opacity-80" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                        <div className="absolute inset-0 bg-black/5" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white" />
                )}
                
                <div className="max-w-7xl mx-auto px-6 relative z-20 h-full flex flex-col justify-end pb-12">
                    <button
                        onClick={() => router.back()}
                        className="absolute top-8 left-6 p-3 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-all active:scale-95 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20">
                                    {business.category?.name || 'Profesional'}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tight leading-[0.9]">
                                {business.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-neutral-800 font-bold">
                                <div className="flex items-center gap-2 drop-shadow-sm">
                                    <MapPin className="w-5 h-5 text-indigo-600" />
                                    <span>{business.address || 'Ubicación no especificada'}</span>
                                </div>
                                <div className="flex items-center gap-2 drop-shadow-sm">
                                    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm text-amber-600 px-2.5 py-1 rounded-xl shadow-sm border border-neutral-100">
                                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                        <span className="font-black text-neutral-900">
                                            {business.rating ? business.rating.toFixed(1) : '--'}
                                        </span>
                                    </div>
                                    <span className="text-neutral-600 text-sm font-black">
                                        ({business.reviewsCount || 0} reseñas)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Link 
                                href={business.services?.length === 1 ? `/book/${business.services[0].id}` : "#services"}
                                className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black transition-all hover:bg-indigo-500 active:scale-95 shadow-2xl shadow-indigo-600/40 cursor-pointer flex items-center gap-2 group"
                            >
                                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Reservar ahora
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Services List */}
                <div className="lg:col-span-2 space-y-16">
                    <div id="services" className="space-y-8 scroll-mt-12">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Servicios</h2>
                            <div className="h-px flex-1 bg-neutral-100 mt-2" />
                        </div>
                        <div className="space-y-4">
                            {business.services?.map((service: Service) => (
                                <Link
                                    key={service.id}
                                    href={`/book/${service.id}`}
                                    className="p-6 rounded-[2.5rem] bg-white border border-neutral-100 hover:border-indigo-600/30 hover:shadow-2xl hover:shadow-neutral-200 transition-all duration-500 group flex items-center justify-between cursor-pointer"
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-neutral-900 group-hover:text-indigo-600 transition-colors">
                                            {service.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-neutral-500 font-bold">
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {service.duration} min</span>
                                            <span className="w-1.5 h-1.5 bg-neutral-200 rounded-full" />
                                            <span className="text-indigo-600 font-black text-lg">{service.price}€</span>
                                        </div>
                                        <p className="text-neutral-400 text-sm max-w-md font-medium leading-relaxed">
                                            {service.description || 'Consulta con el profesional para más detalles sobre este servicio.'}
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 rounded-3xl bg-neutral-50 text-neutral-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 flex items-center justify-center">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* About section */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Sobre nosotros</h2>
                        <p className="text-neutral-500 text-lg leading-relaxed font-medium">
                            {business.description || 'La mejor experiencia de corte y cuidado personal en la ciudad. Ven a disfrutar de un servicio exclusivo.'}
                        </p>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="p-10 rounded-[3rem] bg-white border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                        <h4 className="text-neutral-900 font-black mb-8 flex items-center gap-3 text-lg">
                            <Clock className="w-6 h-6 text-indigo-600" /> Horarios
                        </h4>
                        <div className="space-y-6 font-bold">
                            {business.schedules?.length ? business.schedules.map((s) => (
                                <div key={s.id} className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-400 uppercase tracking-widest text-[10px] font-black">{s.dayOfWeek}</span>
                                    <span className={s.isAvailable ? 'text-neutral-900' : 'text-red-400 opacity-60'}>
                                        {s.isAvailable ? `${s.startTime} - ${s.endTime}` : 'Cerrado'}
                                    </span>
                                </div>
                            )) : (
                                ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                                    <div key={day} className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-400 uppercase tracking-widest text-[10px] font-black">{day}</span>
                                        <span className="text-neutral-900">09:00 - 20:00</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-indigo-50 border border-indigo-100">
                        <h4 className="text-indigo-900 font-black mb-4 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-indigo-600" /> Garantía Zyro
                        </h4>
                        <p className="text-indigo-900/60 text-sm leading-relaxed font-bold">
                            Tu reserva está garantizada y protegida por nuestra política de calidad líder en el mercado.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
