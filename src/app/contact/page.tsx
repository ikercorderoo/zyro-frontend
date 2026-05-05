import Link from 'next/link';
import { Mail, MessageSquare, Phone, MapPin, Send, ArrowLeft, Globe } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header / Navigation */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter italic hover:opacity-80 transition-opacity">
                        ZYRO<sup className="text-[10px] ml-0.5">TM</sup>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-indigo-600 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 mb-20 text-center">
                    <div className="inline-block px-4 py-1.5 mb-6 bg-indigo-50 rounded-full border border-indigo-100">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">SOPORTE Y CONSULTAS</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tight leading-[1.1] mb-8">
                        ¿Cómo podemos <span className="text-indigo-600 italic font-serif">ayudarte</span>?
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-neutral-600 leading-relaxed font-medium">
                        Estamos aquí para resolver tus dudas. Nuestro equipo de expertos está listo para ayudarte con la implementación de Zyro en tu negocio.
                    </p>
                </section>

                <section className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Contact Form */}
                        <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border-2 border-neutral-100 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <Send className="w-10 h-10 text-indigo-500/10 rotate-12" />
                            </div>

                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-neutral-900 tracking-tight mb-4 text-center">Envíanos un mensaje</h2>
                                <p className="text-neutral-500 text-center font-medium">
                                    Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                                </p>
                            </div>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700 ml-1">Nombre</label>
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border-2 border-neutral-200 text-neutral-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-neutral-400 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700 ml-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="tu@email.com"
                                            className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border-2 border-neutral-200 text-neutral-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-neutral-400 font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-700 ml-1">Asunto</label>
                                    <div className="relative">
                                        <select className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border-2 border-neutral-200 text-neutral-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all cursor-pointer appearance-none font-medium">
                                            <option>Soporte Técnico</option>
                                            <option>Consulta Comercial</option>
                                            <option>Feedback del Sistema</option>
                                            <option>Otros</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-700 ml-1">Mensaje</label>
                                    <textarea
                                        rows={4}
                                        placeholder="¿En qué podemos ayudarte?"
                                        className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border-2 border-neutral-200 text-neutral-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-neutral-400 resize-none font-medium"
                                    ></textarea>
                                </div>
                                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 text-lg">
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
