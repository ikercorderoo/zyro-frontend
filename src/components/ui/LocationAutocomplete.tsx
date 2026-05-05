'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function LocationAutocomplete({ value, onChange, placeholder }: LocationAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (query: string) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            // Using Photon API (OpenStreetMap) without 'es' lang since it's unsupported
            // Requesting more limit to filter locally for ES
            const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=15&osm_tag=place`);
            const data = await response.json();

            // Filter results to only keep those in Spain
            const filtered = data.features 
                ? data.features.filter((f: any) => f.properties.countrycode === 'ES').slice(0, 5) 
                : [];
            
            // Remove duplicates based on display name
            const uniqueFiltered = Array.from(new Map(filtered.map((item: any) => 
                [[item.properties.name, item.properties.city, item.properties.state].join('-'), item]
            )).values());

            setSuggestions(uniqueFiltered);
            setShowSuggestions(uniqueFiltered.length > 0);
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val);
        fetchSuggestions(val);
    };

    const handleSelect = (suggestion: any) => {
        const { name, city, state } = suggestion.properties;
        const displayName = [name, city, state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ');
        onChange(displayName);
        setShowSuggestions(false);
    };

    return (
        <div className="relative flex-1 w-full" ref={containerRef}>
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => value.length >= 3 && setShowSuggestions(true)}
                    placeholder={placeholder || "¿En qué zona?"}
                    className="bg-transparent w-full text-neutral-900 outline-none placeholder:text-neutral-400 font-bold text-lg"
                />
                {loading && <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-[calc(100%+0.5rem)] left-0 right-[-2rem] md:right-0 bg-white border border-neutral-100 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.3)] overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-3 border-b border-neutral-50 bg-neutral-50/50">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-3">Sugerencias</span>
                    </div>
                    {suggestions.map((s, i) => {
                        const { name, city, state, country } = s.properties;
                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(s)}
                                className="w-full text-left px-6 py-4 hover:bg-neutral-50 transition-all border-b border-neutral-50 last:border-0 flex flex-col gap-0.5 group"
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-neutral-900 font-bold text-sm">{name}</span>
                                </div>
                                <span className="text-neutral-400 text-xs font-medium pl-5">
                                    {[city, state, country].filter(Boolean).join(', ')}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
