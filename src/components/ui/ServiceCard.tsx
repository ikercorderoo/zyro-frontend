import { Service } from "@/types";

interface ServiceCardProps {
    service: Service;
    onBook: (service: Service) => void;
}

export default function ServiceCard({ service, onBook }: ServiceCardProps) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-xl hover:shadow-indigo-950/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {service.name}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">{service.description || 'Sin descripción'}</p>
                </div>
                <span className="bg-indigo-500/10 text-indigo-400 text-sm font-bold px-3 py-1 rounded-lg border border-indigo-500/20">
                    {service.price}€
                </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 font-medium">
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">⏱️</span> {service.duration} min
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">🏢</span> {service.business.name}
                </div>
            </div>

            <button
                onClick={() => onBook(service)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-xl shadow-lg shadow-indigo-950/20 transition-all active:scale-[0.98]"
            >
                Reservar ahora
            </button>
        </div>
    );
}
