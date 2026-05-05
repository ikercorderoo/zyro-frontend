'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();

    const handleExploreServices = (e: React.MouseEvent) => {
        // Si estamos en la home, hacemos scroll suave
        if (pathname === '/') {
            const target = document.getElementById('locales-recomendados');
            if (target) {
                e.preventDefault();
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1200; // Misma duración que en el hero para consistencia
                let start: number | null = null;

                const animation = (currentTime: number) => {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                };

                const ease = (t: number, b: number, c: number, d: number) => {
                    t /= d / 2;
                    if (t < 1) return (c / 2) * t * t + b;
                    t--;
                    return (-c / 2) * (t * (t - 2) - 1) + b;
                };

                requestAnimationFrame(animation);
            }
        }
        // Si no estamos en la home, el Link nos llevará a "/" automáticamente
    };

    return (
        <footer className="footer-dark bg-black border-t border-white/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <span className="text-2xl font-black text-white tracking-tighter italic">ZYRO<sup className="text-[10px] ml-0.5">TM</sup></span>
                        <p className="text-neutral-200 text-sm leading-relaxed">
                            Simplificando la gestión de reservas para negocios modernos. Inteligencia y diseño al servicio de tu agenda.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-neutral-200">
                                <Mail className="w-4 h-4 text-indigo-400" />
                                <span>soporte@zyro.com</span>
                            </div>
                            <div className="flex gap-4">
                                <a href="#" className="p-2 rounded-lg bg-white/10 text-white hover:text-white hover:bg-white/20 transition-all">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 rounded-lg bg-white/10 text-white hover:text-white hover:bg-white/20 transition-all">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 rounded-lg bg-white/10 text-white hover:text-white hover:bg-white/20 transition-all">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-neutral-100 font-bold mb-6">Plataforma</h4>
                        <ul className="space-y-4 text-sm text-neutral-200">
                            <li>
                                <Link 
                                    href="/" 
                                    onClick={handleExploreServices}
                                    className="hover:text-indigo-400 transition-colors"
                                >
                                    Explorar Servicios
                                </Link>
                            </li>
                            <li><Link href="/register" className="hover:text-indigo-400 transition-colors">Crear Perfil Pro</Link></li>
                            <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Acceso Clientes</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-neutral-100 font-bold mb-6">Empresa</h4>
                        <ul className="space-y-4 text-sm text-neutral-200">
                            <li><Link href="/about" className="hover:text-indigo-400 transition-colors">Sobre nosotros</Link></li>
                            <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Policies Section */}
                    <div>
                        <h4 className="text-neutral-100 font-bold mb-6">Políticas</h4>
                        <ul className="space-y-4 text-sm text-neutral-200">
                            <li><Link href="/legal" className="hover:text-indigo-400 transition-colors">Aviso Legal</Link></li>
                            <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacidad</Link></li>
                            <li><Link href="/cookies" className="hover:text-indigo-400 transition-colors">Cookies</Link></li>
                            <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Términos de Servicio</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-300 text-xs font-medium">
                    <p>© {new Date().getFullYear()} ZYRO. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <p className="flex items-center gap-1">Hecho con <span className="text-red-500">❤️</span> por Zyro Team</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

