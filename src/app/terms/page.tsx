import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
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
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Contrato</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Términos de Servicio</h1>
                    <p className="text-neutral-500 mt-2">Última actualización: 28 de abril de 2026</p>
                </div>

                <div className="prose prose-neutral max-w-none space-y-8 font-medium text-neutral-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">1. Objeto</h2>
                        <p>
                            Los presentes Términos de Servicio regulan el uso de la plataforma Zyro, un marketplace que facilita la reserva de servicios profesionales entre negocios (Profesionales) y sus usuarios (Clientes).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">2. Registro de Usuarios</h2>
                        <p>
                            Para acceder a determinadas funcionalidades, el usuario deberá registrarse. El usuario es responsable de mantener la confidencialidad de sus datos de acceso y de todas las actividades que ocurran bajo su cuenta.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">3. Reservas y Pagos</h2>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Zyro actúa como intermediario tecnológico en el proceso de reserva.</li>
                            <li>Los precios de los servicios son establecidos directamente por los Profesionales.</li>
                            <li>La cancelación de una reserva está sujeta a la política de cancelación de cada establecimiento.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">4. Responsabilidades</h2>
                        <p>
                            El Profesional es el único responsable de la prestación del servicio contratado. Zyro no se responsabiliza de la calidad, seguridad o legalidad de los servicios ofrecidos por los profesionales registrados en la plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">5. Propiedad del Contenido</h2>
                        <p>
                            El usuario garantiza que el contenido que sube a la plataforma (imágenes, reseñas) no infringe derechos de terceros. Al subir contenido, el usuario concede a Zyro una licencia no exclusiva para mostrar dicho contenido en la plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">6. Ley Aplicable y Jurisdicción</h2>
                        <p>
                            Estas Condiciones se rigen por la ley española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Valencia, salvo que la ley disponga lo contrario.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
