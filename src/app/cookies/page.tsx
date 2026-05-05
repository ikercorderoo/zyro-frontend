import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export default function CookiesPolicy() {
    return (
        <div className="min-h-screen bg-white font-sans text-neutral-900">
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter italic hover:opacity-80 transition-opacity">
                        ZYRO<sup className="text-[10px] ml-0.5">TM</sup>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-indigo-600 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 max-w-4xl mx-auto px-6">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
                        <Cookie className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Configuración</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Política de Cookies</h1>
                    <p className="text-neutral-500 mt-2">Última actualización: 28 de abril de 2026</p>
                </div>

                <div className="prose prose-neutral max-w-none space-y-8 font-medium text-neutral-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">1. ¿Qué son las cookies?</h2>
                        <p>
                            Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">2. Tipos de cookies que utiliza esta web</h2>
                        <ul className="list-disc pl-6 mt-4 space-y-4">
                            <li>
                                <strong>Cookies Técnicas:</strong> Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan.
                            </li>
                            <li>
                                <strong>Cookies de Personalización:</strong> Permiten al usuario acceder al servicio con algunas características de carácter general predefinidas en función de una serie de criterios en el terminal del usuario (ej: idioma).
                            </li>
                            <li>
                                <strong>Cookies de Análisis:</strong> Son aquellas que bien tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">3. Desactivación de cookies</h2>
                        <p>
                            Usted puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li><strong>Google Chrome:</strong> Configuración - Privacidad - Configuración de contenido.</li>
                            <li><strong>Firefox:</strong> Opciones - Privacidad - Historial.</li>
                            <li><strong>Safari:</strong> Preferencias - Seguridad.</li>
                            <li><strong>Edge:</strong> Configuración - Configuración avanzada.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">4. Cookies de Terceros</h2>
                        <p>
                            Zyro puede utilizar servicios de terceros (como Google Analytics) que recopilarán información con fines estadísticos, de uso del Site por parte del usuario y para la prestacion de otros servicios relacionados con la actividad del Website y otros servicios de Internet.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
