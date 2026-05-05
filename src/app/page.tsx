'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Zap,
  ShieldCheck,
  LayoutDashboard,
  Search,
  Scissors,
  UserRound,
  Hand,
  Sparkles,
  Activity,
  PenTool,
  Dumbbell,
  MoreHorizontal,
  ChevronRight,
  Star,
  MapPin,
  Loader2
} from 'lucide-react';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';
import { apiFetch } from '@/services/api';
import { getFullImageUrl } from '@/utils/url';



export default function Home() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoadingRecs(true);
      try {
        const queryParams = new URLSearchParams();
        if (zone) queryParams.append('zone', zone);
        const data = await apiFetch(`/marketplace/recommendations?${queryParams.toString()}`);
        setRecommendations(data);
      } catch {
        // Backend can be temporarily unavailable (e.g. DB down during development).
        // Keep UI usable with an empty recommendations state.
        setRecommendations([]);
      } finally {
        setLoadingRecs(false);
      }
    };
    
    // Slight debounce so it doesn't fire continuously while typing
    const timeout = setTimeout(fetchRecs, 500);
    return () => clearTimeout(timeout);
  }, [zone]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 520);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-500/10 selection:text-indigo-600">
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-neutral-100' : 'bg-transparent shadow-none backdrop-blur-0 hero-header'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <span className={`text-2xl font-black tracking-tighter italic hover:opacity-80 transition-opacity cursor-pointer ${isScrolled ? 'text-indigo-600' : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]'}`}>
            ZYRO<sup className="text-[10px] ml-0.5 font-bold">TM</sup>
          </span>
          <div className={`hidden lg:flex items-center gap-3 flex-1 max-w-xl mx-6 transition-all duration-300 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            <div className="h-11 bg-neutral-100/80 rounded-xl px-4 flex items-center gap-3 flex-1 border border-neutral-200">
              <Search className="w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Servicio"
                className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-500 outline-none font-semibold text-sm"
              />
            </div>
            <div className="h-11 bg-neutral-100/80 rounded-xl px-4 flex items-center gap-3 flex-1 border border-neutral-200">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="Ciudad"
                className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-500 outline-none font-semibold text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className={`hidden md:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${isScrolled ? 'bg-neutral-100 text-neutral-700' : 'bg-white/10 text-white'}`}>
                  <span className={isScrolled ? 'text-indigo-600' : 'text-indigo-300'}>{user.name}</span>
                </div>
                <Link
                  href={user.role === 'CLIENT' ? '/client/dashboard' : user.role === 'PROFESSIONAL' ? '/professional/dashboard' : '/admin/dashboard'}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${isScrolled ? 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50' : 'bg-white/10 border-white/20 text-white hover:bg-white/25'}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-indigo-600 text-white force-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-900/10 hover:bg-indigo-500 transition-all active:scale-95"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`text-xs font-black uppercase tracking-wider transition-colors ${isScrolled ? 'text-neutral-600 hover:text-indigo-600' : 'text-white hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]'}`}>
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white force-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 transition-all active:scale-95">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="">
        {/* Banner/Hero Section (Booksy style) */}
        <section
          className="hero-section relative px-6 bg-cover bg-center bg-no-repeat min-h-screen flex flex-col justify-center items-center z-20"
          style={{ backgroundImage: "url('/images/barberia_hero.png')" }}
        >
          {/* Overlay for text contrast */}
          <div className="absolute inset-0 bg-black/45 hero-overlay-dark" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center w-full">
            <h1 className="text-6xl md:text-[100px] font-black text-white tracking-tight leading-[0.85] mb-6 drop-shadow-2xl">
              Reserva tu <br />
              <span className="text-indigo-400 italic font-serif">estilo</span> único.
            </h1>
            <p className="text-white text-xl md:text-2xl font-bold mb-14 max-w-3xl mx-auto drop-shadow-md">
              Encuentra y reserva cita en los mejores locales de tu zona.
            </p>

            {/* Advanced Search Bar */}
            <div className="relative z-50 max-w-4xl mx-auto bg-white p-2 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-2 group transition-all">
              <div className="flex-1 w-full flex items-center px-6 py-4 gap-4 border-b md:border-b-0 md:border-r border-neutral-100">
                <Search className="w-5 h-5 text-indigo-600" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="¿Qué servicio buscas?"
                  className="bg-transparent w-full text-neutral-900 outline-none placeholder:text-neutral-400 font-bold text-lg"
                />
              </div>

              <div className="flex-1 w-full flex items-center px-6 py-4 gap-4">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <LocationAutocomplete 
                  value={zone} 
                  onChange={setZone} 
                  placeholder="¿Dónde?" 
                />
              </div>

              <button 
                onClick={(e) => {
                  const btn = e.currentTarget;
                  const originalContent = btn.innerHTML;
                  btn.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Buscando...</span>';
                  btn.disabled = true;
                  
                  setTimeout(() => {
                    const target = document.getElementById('locales-recomendados');
                    if (target) {
                      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                      const startPosition = window.pageYOffset;
                      const distance = targetPosition - startPosition;
                      const duration = 1200; // Duración en milisegundos (más lento = más elegante)
                      let start: number | null = null;

                      const animation = (currentTime: number) => {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const run = ease(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(animation);
                      };

                      // Función de suavizado (ease-in-out quadratic)
                      const ease = (t: number, b: number, c: number, d: number) => {
                        t /= d / 2;
                        if (t < 1) return (c / 2) * t * t + b;
                        t--;
                        return (-c / 2) * (t * (t - 2) - 1) + b;
                      };

                      requestAnimationFrame(animation);
                    }
                    
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                  }, 1000);
                }}
                className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white force-white px-10 py-5 rounded-[2rem] font-black transition-all active:scale-95 shadow-xl shadow-indigo-500/25 text-xs uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* Quick Benefits (Mini) */}
        <section className="hero-section relative z-10 bg-[#161718] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Zap className="w-5 h-5 text-indigo-400" />, title: "Reserva inmediata", desc: "Citas confirmadas en segundos" },
                { icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />, title: "Negocios TOP", desc: "Solo los mejores locales" },
                { icon: <Star className="w-5 h-5 text-indigo-400" />, title: "Opiniones reales", desc: "Clientes 100% verificados" }
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{b.title}</h4>
                    <p className="text-xs text-neutral-400">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Businesses Section */}
        <section id="locales-recomendados" className="bg-neutral-50/50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-2">Seleccionados para ti</p>
                <h2 className="text-4xl font-black text-neutral-900 tracking-tight">Establecimientos recomendados</h2>
              </div>
              {zone && (
                <p className="text-sm text-neutral-500 font-bold flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-200">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  Resultados en <span className="text-indigo-600">{zone}</span>
                </p>
              )}
            </div>

            {loadingRecs ? (
              <div className="flex items-center gap-3 text-neutral-400 font-bold py-10">
                <Loader2 className="w-5 h-5 animate-spin" />
                Buscando los mejores locales...
              </div>
            ) : recommendations.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-neutral-200 rounded-[2rem] p-12 text-center">
                <p className="text-neutral-500 font-bold">No hay establecimientos activos todavía en esta zona.</p>
                <p className="text-sm text-neutral-400 mt-1">¿Eres profesional? Sé el primero en aparecer registrando tu negocio.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
                {recommendations.map((business, i) => (
                  <Link
                    key={i}
                    href={`/business/${business.slug}`}
                    className="group bg-white rounded-3xl p-3 border border-neutral-200 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-500"
                  >
                    <div className="relative h-44 rounded-2xl overflow-hidden bg-neutral-100">
                      {business.imageUrl ? (
                        <img
                          src={getFullImageUrl(business.imageUrl)}
                          alt={business.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-100" />
                      )}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-neutral-900 px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {business.rating ? business.rating.toFixed(1) : '--'}
                      </div>
                    </div>

                    <div className="pt-4 px-2 pb-2">
                      <h3 className="text-lg font-black text-neutral-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{business.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        <span className="line-clamp-1">{business.address || 'Ubicación no especificada'}</span>
                      </p>
                      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Desde</span>
                        <span className="text-sm font-black text-neutral-900">
                          {business.services?.[0] ? `${business.services[0].price}€` : '--€'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* For Professionals Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[3.5rem] p-8 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] border border-neutral-100">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 shadow-xl shadow-indigo-500/40 transform hover:scale-105 transition-all">
                  <Zap className="w-4 h-4 text-white fill-white/30 force-white" />
                  <span className="text-xs font-black uppercase tracking-widest text-white force-white">Zyro para Negocios</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight leading-[1.1]">
                  Gestiona tu negocio <br />
                  <span className="text-blue-600 italic font-serif">sin esfuerzo.</span>
                </h2>
                
                <ul className="space-y-4">
                  {[
                    "Agenda inteligente y sincronizada en tiempo real",
                    "Reduce las inasistencias con recordatorios automáticos",
                    "Página de perfil personalizada para tu marca",
                    "Analíticas detalladas sobre tus ventas y clientes"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-600 font-bold">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                        <ChevronRight className="w-4 h-4 text-blue-600 stroke-[3px]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link href="/register?role=PROFESSIONAL" className="inline-block bg-blue-600 text-white force-white px-10 py-5 rounded-2xl font-black text-base hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/20">
                    Registra tu negocio hoy
                  </Link>
                </div>
              </div>

              <div className="relative z-10 flex-1 w-full max-w-md">
                <img
                  src="/images/primera_seccion.png"
                  alt="Panel de control profesional"
                  className="w-full rounded-[3rem] shadow-2xl border border-white/10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Discovery & Reviews Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-[1.1]">
                Reserva con los mejores <br />
                profesionales <span className="text-indigo-600 italic font-serif">cerca de ti.</span>
              </h2>
              <div className="space-y-6 text-neutral-500 font-medium leading-relaxed">
                <p>
                  Navega por la plataforma para descubrir los mejores negocios de salud y belleza que hay en Zyro. Encuentra salones, barberías y centros de estética verificados por nuestra comunidad.
                </p>
                <p>
                  Echa un vistazo al perfil del negocio y conoce las opiniones de otros usuarios gracias a las reseñas verificadas. También puedes ver los resultados de su trabajo a través de sus galerías de fotos.
                </p>
                <p className="text-neutral-900 font-bold">
                  Ahorra tiempo y deja el estrés a otro. Con Zyro, reservar tu próxima cita de belleza es gratis, fácil y rápido desde cualquier dispositivo.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full translate-x-10 translate-y-10" />
              <img 
                src="/images/segunda_seccion.png" 
                alt="Descubrimiento de profesionales" 
                className="relative z-10 w-full rounded-[3rem] shadow-2xl border border-neutral-100"
              />
            </div>
          </div>
        </section>

        {/* Management & Flexibility Section */}
        <section className="py-24 bg-neutral-50/50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full -translate-x-10 translate-y-10" />
              <img 
                src="/images/tercera_seccion.png" 
                alt="Gestión de reservas online" 
                className="relative z-10 w-full rounded-[3rem] shadow-2xl border border-neutral-100"
              />
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-[1.1]">
                ¿Ha surgido algo? <br />
                ¡Nosotros <span className="text-emerald-600 italic font-serif">nos encargamos!</span>
              </h2>
              <div className="space-y-6 text-neutral-500 font-medium leading-relaxed">
                <p>
                  Usa la plataforma web de Zyro para gestionar tus citas desde cualquier lugar, sin necesidad de descargar ninguna aplicación pesada. Modifica o cancela tus reservas de forma sencilla sin necesidad de llamar por teléfono.
                </p>
                <p>
                  Y como sabemos que tu día a día es ajetreado, Zyro te enviará recordatorios automáticos por correo o notificaciones web para que nunca más te olvides o pierdas una cita importante.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 text-indigo-600 font-black hover:gap-3 transition-all">
                  Empieza a reservar ahora <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
