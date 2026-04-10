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
    onClose: () => void;
    onLaunchApp: (id: AppId) => void;
}

const Spotlight: React.FC<SpotlightProps> = memo(({ onClose, onLaunchApp }) => {
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
        const timer = setTimeout(() => inputRef.current?.focus(), 50);
        return () => clearTimeout(timer);
    }, []);

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

    return (
        <div className="fixed inset-0 z-[1000000] flex items-start justify-center pt-[15vh] pointer-events-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="tahoe-spotlight spotlight-container w-[640px] max-w-[calc(100vw-32px)] rounded-[1.75rem] overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center px-5 h-16 gap-3 border-b" style={{ borderColor: 'var(--tahoe-hairline)' }}>
                    <Search size={22} className="shrink-0" style={{ color: 'var(--tahoe-text-secondary)' }} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Búsqueda en Spotlight"
                        className="bg-transparent border-none outline-none text-[1.35rem] w-full font-light"
                        style={{ color: 'var(--tahoe-text-primary)' }}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        aria-label="Búsqueda en Spotlight"
                    />
                </div>

                {/* Results */}
                {filteredApps.length > 0 && (
                    <div className="max-h-[420px] overflow-y-auto py-2">
                        <div className="px-5 py-1 text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: 'var(--tahoe-text-tertiary)' }}>
                            Aplicaciones
                        </div>
                        {filteredApps.map((app, index) => (
                            <button
                                key={app.id}
                                onClick={() => handleAppClick(app.id)}
                                data-active={index === selectedIndex}
                                className="tahoe-spotlight-result w-full flex items-center gap-3 px-5 py-2.5 transition-colors"
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
                                <span className="text-[15px] font-medium" style={{ color: 'var(--tahoe-text-primary)' }}>{app.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {filteredApps.length === 0 && query.trim() !== '' && (
                    <div className="px-4 py-8 text-center" style={{ color: 'var(--tahoe-text-secondary)' }}>
                        No se encontraron resultados para &quot;{query}&quot;
                    </div>
                )}
            </motion.div>
        </div>
    );
});

Spotlight.displayName = 'Spotlight';

export default Spotlight;
