import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
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
                        <Lock className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Protección de Datos</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Política de Privacidad</h1>
                    <p className="text-neutral-500 mt-2">Última actualización: 28 de abril de 2026</p>
                </div>

                <div className="prose prose-neutral max-w-none space-y-8 font-medium text-neutral-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">1. Responsable del Tratamiento</h2>
                        <p>
                            Zyro Marketplace S.L., con domicilio en Tech Hub Valencia, Calle de la Innovación 42, 46001 Valencia, garantiza la protección de todos los datos de carácter personal que proporcione el Usuario en la Web y, en cumplimiento de lo dispuesto en el Reglamento (UE) 2016/679 (RGPD) y la LOPDGDD 3/2018.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">2. Finalidad del Tratamiento</h2>
                        <p>
                            Los datos personales proporcionados a Zyro a través de la Web serán tratados con las siguientes finalidades:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Gestión de la cuenta de usuario y servicios de reserva.</li>
                            <li>Envío de comunicaciones comerciales si el usuario ha dado su consentimiento.</li>
                            <li>Resolución de consultas a través del formulario de contacto.</li>
                            <li>Gestión de la relación contractual con los profesionales registrados.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">3. Legitimación</h2>
                        <p>
                            La base legal para el tratamiento de sus datos es la ejecución del contrato de servicios de Zyro, así como el consentimiento explícito prestado por el usuario en los casos que así se requiera.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">4. Derechos del Usuario</h2>
                        <p>
                            Cualquier persona tiene derecho a obtener confirmación sobre si en Zyro estamos tratando datos personales que les conciernan, o no. Las personas interesadas tienen derecho a:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Acceder a sus datos personales.</li>
                            <li>Solicitar la rectificación de los datos inexactos.</li>
                            <li>Solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.</li>
                            <li>Solicitar la limitación de su tratamiento.</li>
                            <li>Oponerse al tratamiento de sus datos.</li>
                            <li>Solicitar la portabilidad de los datos.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-neutral-900 mb-4 uppercase tracking-wider text-sm">5. Conservación de los Datos</h2>
                        <p>
                            Los datos personales proporcionados se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
