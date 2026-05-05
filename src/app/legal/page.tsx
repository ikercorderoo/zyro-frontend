import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function LegalNotice() {
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
                        <Shield className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Información Legal</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Aviso Legal</h1>
                    <p className="text-neutral-500 mt-2">Última actualización: 28 de abril de 2026</p>
                </div>

                <div className="prose prose-neutral max-w-none space-y-8 font-medium text-neutral-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">1. Información General</h2>
                        <p>
                            En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li><strong>Titular:</strong> Zyro Marketplace S.L.</li>
                            <li><strong>Domicilio:</strong> Tech Hub Valencia, Calle de la Innovación 42, 46001 Valencia.</li>
                            <li><strong>CIF:</strong> B-12345678</li>
                            <li><strong>Email:</strong> soporte@zyro.com</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">2. Condiciones de Uso</h2>
                        <p>
                            El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">3. Propiedad Intelectual e Industrial</h2>
                        <p>
                            Zyro por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">4. Exclusión de Garantías y Responsabilidad</h2>
                        <p>
                            Zyro no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">5. Modificaciones</h2>
                        <p>
                            Zyro se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
