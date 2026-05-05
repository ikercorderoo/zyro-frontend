'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
    value: string;
    onChange: (address: string, lat?: number, lng?: number) => void;
    placeholder?: string;
    required?: boolean;
}

export default function AddressAutocomplete({ value, onChange, placeholder, required }: AddressAutocompleteProps) {
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update query when external value changes (e.g. on load)
    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchAddress = async (searchTerm: string) => {
        if (searchTerm.length < 3) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchTerm)}&limit=6`);
            const data = await response.json();
            setResults(data.features || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query !== value) {
                searchAddress(query);
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (feature: any) => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates; // [lng, lat]
        
        const parts = [
            props.name,
            props.street ? `${props.street}${props.housenumber ? ` ${props.housenumber}` : ''}` : null,
            props.city,
            props.state,
            props.country
        ].filter(Boolean);
        
        // Remove duplicates (sometimes name is same as street or city)
        const uniqueParts = Array.from(new Set(parts));
        const fullAddress = uniqueParts.join(', ');
        
        setQuery(fullAddress);
        setShowDropdown(false);
        onChange(fullAddress, coords[1], coords[0]);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                </div>
                <input
                    type="text"
                    required={required}
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                    placeholder={placeholder || "Escribe tu dirección..."}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                />
            </div>

            {showDropdown && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.map((feature, idx) => {
                        const p = feature.properties;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelect(feature)}
                                className="w-full text-left px-5 py-4 hover:bg-neutral-50 flex items-start gap-4 transition-colors border-b border-neutral-50 last:border-0"
                            >
                                <div className="mt-1 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-neutral-900 text-sm">
                                        {[p.name, p.street ? `${p.street}${p.housenumber ? ` ${p.housenumber}` : ''}` : null].filter(Boolean).join(', ')}
                                    </span>
                                    <span className="text-xs text-neutral-500 mt-0.5">
                                        {[p.city, p.state, p.country].filter(Boolean).join(', ')}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
