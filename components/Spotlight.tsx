"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { AppId } from './Desktop';

interface SpotlightApp {
    id: AppId;
    iconSrc: string;
    label: string;
    keywords?: string[];
}

const SPOTLIGHT_APPS: SpotlightApp[] = [
    { id: 'finder', iconSrc: '/icons/finder.avif', label: 'Finder', keywords: ['archivos', 'files', 'carpetas', 'folders'] },
    { id: 'profile', iconSrc: '/icons/profile.avif', label: 'Perfil', keywords: ['about', 'cv', 'resume', 'información', 'contacto'] },
    { id: 'browser', iconSrc: '/icons/safari.avif', label: 'Safari', keywords: ['web', 'internet', 'navegador', 'browser'] },
    { id: 'notes', iconSrc: '/icons/notes.avif', label: 'Notas', keywords: ['notes', 'portafolio', 'bienvenido', 'welcome'] },
    { id: 'terminal', iconSrc: '/icons/terminal.avif', label: 'Terminal', keywords: ['console', 'shell', 'command', 'bash', 'zsh'] },
    { id: 'about', iconSrc: '/icons/profile.avif', label: 'Acerca de este Mac', keywords: ['system', 'info', 'mac', 'apple'] },
];

interface SpotlightProps {
    isOpen: boolean;
    onClose: () => void;
    onLaunchApp: (id: AppId) => void;
}

const Spotlight: React.FC<SpotlightProps> = memo(({ isOpen, onClose, onLaunchApp }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredApps = query.trim() === ''
        ? SPOTLIGHT_APPS
        : SPOTLIGHT_APPS.filter(app => {
            const q = query.toLowerCase();
            return (
                app.label.toLowerCase().includes(q) ||
                app.id.toLowerCase().includes(q) ||
                app.keywords?.some(k => k.toLowerCase().includes(q))
            );
        });

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredApps.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredApps[selectedIndex]) {
                onLaunchApp(filteredApps[selectedIndex].id);
                onClose();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    const handleAppClick = (id: AppId) => {
        onLaunchApp(id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000000] flex items-start justify-center pt-[15vh] pointer-events-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="spotlight-container w-[600px] bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center px-4 h-14 gap-3 border-b border-white/10">
                    <Search size={24} className="text-white/40 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Búsqueda en Spotlight"
                        className="bg-transparent border-none outline-none text-xl w-full text-white font-light placeholder:text-white/40"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        aria-label="Búsqueda en Spotlight"
                    />
                </div>

                {/* Results */}
                {filteredApps.length > 0 && (
                    <div className="max-h-[400px] overflow-y-auto py-2">
                        <div className="px-4 py-1 text-[11px] text-white/40 uppercase tracking-wider font-medium">
                            Aplicaciones
                        </div>
                        {filteredApps.map((app, index) => (
                            <button
                                key={app.id}
                                onClick={() => handleAppClick(app.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${index === selectedIndex ? 'bg-blue-500/80' : 'hover:bg-white/10'
                                    }`}
                            >
                                <div className="w-8 h-8 relative shrink-0">
                                    <Image
                                        src={app.iconSrc}
                                        alt={app.label}
                                        fill
                                        className="object-contain"
                                        sizes="32px"
                                    />
                                </div>
                                <span className="text-white text-[15px] font-medium">{app.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {filteredApps.length === 0 && query.trim() !== '' && (
                    <div className="px-4 py-8 text-center text-white/40">
                        No se encontraron resultados para "{query}"
                    </div>
                )}
            </motion.div>
        </div>
    );
});

Spotlight.displayName = 'Spotlight';

export default Spotlight;
