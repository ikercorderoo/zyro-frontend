'use client';

import { useState, useRef } from 'react';
import { apiFetch } from '@/services/api';
import { Camera, X, UploadCloud, CheckCircle2 } from 'lucide-react';
import { getFullImageUrl } from '@/utils/url';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    required?: boolean;
}

export default function ImageUpload({ value, onChange, label, required }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const token = localStorage.getItem('zyro_token');
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            
            const response = await fetch(`${baseUrl}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al subir imagen');
            }
            
            const data = await response.json();
            
            // Si la URL ya es completa (como la de Uploadcare), la usamos directamente
            const finalUrl = data.url;
            onChange(finalUrl);
            setPreview(finalUrl);
        } catch (err: any) {
            console.error('Error en la subida:', err);
            alert(`Error: ${err.message || 'No se pudo subir la imagen'}`);
            setPreview(value); // Revertir al valor anterior
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreview('');
        onChange('');
    };

    const getFullUrl = (url: string) => {
        return getFullImageUrl(url);
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-bold text-neutral-700 ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <div className="relative max-w-xl">
                {preview ? (
                    <div className="relative group w-full h-40 rounded-3xl overflow-hidden border-2 border-neutral-200 bg-neutral-50 shadow-sm">
                        <img 
                            src={getFullUrl(preview)} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 bg-white rounded-full text-neutral-900 hover:scale-110 transition-transform"
                                title="Cambiar imagen"
                            >
                                <Camera size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="p-3 bg-red-500 rounded-full text-white hover:scale-110 transition-transform"
                                title="Eliminar imagen"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Subiendo...</p>
                            </div>
                        )}
                        {!uploading && (
                            <div className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                <CheckCircle2 size={12} />
                                Lista
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-indigo-400 transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-neutral-100 group-hover:scale-110 transition-transform">
                            <UploadCloud className="text-neutral-400 group-hover:text-indigo-600 transition-colors" size={24} />
                        </div>
                        <div className="text-center px-4">
                            <p className="text-xs font-bold text-neutral-700">Subir foto del local</p>
                            <p className="text-[10px] text-neutral-500 mt-0.5">JPG, PNG o WEBP (Máx. 5MB)</p>
                        </div>
                    </button>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
}
