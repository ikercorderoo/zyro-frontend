import Link from 'next/link';
import { Users, Target, Rocket, Shield, Heart, ArrowLeft, Linkedin } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-neutral-900">
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
                <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
                    <div className="inline-block px-4 py-1.5 mb-6 bg-indigo-50 rounded-full border border-indigo-100">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">NUESTRA HISTORIA</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tight leading-[1.1] mb-8">
                        Reinventando la <span className="text-indigo-600 italic">gestión</span> de servicios.
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-neutral-600 leading-relaxed font-medium">
                        Zyro nació con una visión clara: eliminar las barreras entre los profesionales y sus clientes, automatizando lo complejo para que tú puedas centrarte en lo que mejor sabes hacer.
                    </p>
                </section>

                {/* Founders Section */}
                <section className="max-w-7xl mx-auto px-6 mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black text-neutral-900 tracking-tight">Los rostros detrás de <span className="text-indigo-600 italic">Zyro</span>.</h2>
                            <p className="text-neutral-600 text-lg leading-relaxed font-medium">
                                Fundada por <span className="text-neutral-900 font-bold">Iker Cordero</span> y <span className="text-neutral-900 font-bold">Aitor Martínez</span>, Zyro es el resultado de la pasión por la tecnología y el compromiso con el éxito empresarial. Como propietarios y desarrolladores principales, su misión es construir la herramienta más potente y sencilla del mercado.
                            </p>
                            <div className="flex gap-12">
                                <div className="space-y-2">
                                    <p className="text-3xl font-black text-neutral-900">100%</p>
                                    <p className="text-sm uppercase tracking-widest font-bold text-indigo-600">Compromiso</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-black text-neutral-900">24/7</p>
                                    <p className="text-sm uppercase tracking-widest font-bold text-indigo-600">Innovación</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                            {[
                                {
                                    name: "Iker Cordero",
                                    role: "Propietario",
                                    image: "/images/ikercordero.jpg",
                                    linkedin: "https://www.linkedin.com/in/iker-cordero/"
                                },
                                {
                                    name: "Aitor Martínez",
                                    role: "Propietario",
                                    image: "/images/aitormartinez.png",
                                    linkedin: "https://www.linkedin.com/in/aitor-martinez-lora-456122397/"
                                }
                            ].map((founder, i) => (
                                <div key={i} className="group relative">
                                    <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-100 border border-neutral-200 aspect-[4/5] shadow-lg shadow-indigo-100">
                                        <img 
                                            src={founder.image} 
                                            alt={founder.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                            <a 
                                                href={founder.linkedin} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 scale-50 group-hover:scale-100 transition-all duration-500 delay-100 shadow-2xl"
                                            >
                                                <Linkedin className="w-8 h-8" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <p className="text-xl font-black text-neutral-900 tracking-tight">{founder.name}</p>
                                        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">{founder.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="bg-neutral-50/50 py-32 border-y border-neutral-100 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-50 blur-[120px] rounded-full -z-10" />
                    <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                        <h2 className="text-3xl font-black text-neutral-900 mb-4">Nuestros Valores</h2>
                        <p className="text-neutral-600 max-w-xl mx-auto font-medium">Los pilares sobre los que construimos el futuro de las reservas inteligentes.</p>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Target className="w-8 h-8 text-indigo-600" />,
                                title: "Precisión",
                                desc: "Cada reserva, cada horario y cada dato está gestionado con la máxima exactitud tecnológica."
                            },
                            {
                                icon: <Rocket className="w-8 h-8 text-indigo-600" />,
                                title: "Agilidad",
                                desc: "Desarrollamos una plataforma que se mueve a la velocidad de tu negocio, sin fricciones."
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-indigo-600" />,
                                title: "Confianza",
                                desc: "La privacidad de tus datos es nuestra prioridad absoluta. Seguridad de nivel empresarial."
                            }
                        ].map((value, i) => (
                            <div key={i} className="group p-8 rounded-[2.5rem] bg-white border border-neutral-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-500">
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-black text-neutral-900 mb-3 tracking-tight">{value.title}</h3>
                                <p className="text-neutral-600 leading-relaxed font-medium">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
