"use client";

import React, { useState, useContext } from 'react';
import { ListChecks, Table as TableIcon, Paperclip, ChevronsRight } from 'lucide-react';
import { WindowContext } from './Window';

const NotesApp = React.memo(() => {
    const windowContext = useContext(WindowContext);
    const dragControls = windowContext?.dragControls;

    const [currentDate] = useState(() => {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleDateString('es-ES', { month: 'long' });
        const year = now.getFullYear();
        const time = now.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true });

        // Precisely match: "28 de enero de 2026, 6:47 p.m."
        let timeStr = time.toLowerCase();
        if (timeStr.includes('pm')) timeStr = timeStr.replace('pm', 'p.m.');
        if (timeStr.includes('am')) timeStr = timeStr.replace('am', 'a.m.');

        return `${day} de ${month} de ${year}, ${timeStr}`;
    });

    return (
        <div className="flex flex-col h-full bg-[#1c1c1e] text-white overflow-hidden select-none">
            {/* Header - Matches Screenshot Layout */}
            <div
                className="h-[52px] flex items-center justify-between px-4 shrink-0 cursor-grab active:cursor-grabbing border-b border-white/[0.05]"
                onPointerDown={(e) => dragControls?.start(e)}
            >
                {/* Left segment: Traffic light space + Title */}
                <div className="flex items-center ml-[72px]">
                    <span className="text-[14px] font-bold text-white/90">Mi Portafolio</span>
                </div>

                {/* Right segment: Tools + Expand */}
                <div className="flex items-center gap-3">
                    {/* Toolbar Pill */}
                    <div className="flex items-center bg-[#2d2d2e] border border-white/[0.08] rounded-[10px] p-[2px] pointer-events-auto shadow-sm" onPointerDown={(e) => e.stopPropagation()}>
                        <button className="px-3 py-1 hover:bg-white/[0.08] rounded-[8px] transition-colors text-[14px] font-semibold text-white/90">
                            Aa
                        </button>
                        <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
                        <button className="p-1.5 hover:bg-white/[0.08] rounded-[8px] transition-colors text-white/70">
                            <ListChecks size={18} strokeWidth={2} />
                        </button>
                        <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
                        <button className="p-1.5 hover:bg-white/[0.08] rounded-[8px] transition-colors text-white/70">
                            <TableIcon size={18} strokeWidth={2} />
                        </button>
                        <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
                        <button className="p-1.5 hover:bg-white/[0.08] rounded-[8px] transition-colors text-white/70">
                            <Paperclip size={18} strokeWidth={2} />
                        </button>
                    </div>

                    {/* Expand Button */}
                    <button
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/[0.08] rounded-full text-white/30 hover:text-white/70 transition-colors pointer-events-auto border border-white/[0.05]"
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <ChevronsRight size={18} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-8 pb-10 custom-scrollbar">
                <div className="max-w-3xl mx-auto flex flex-col items-center pt-4">
                    {/* Centered Date - EXACT format and style */}
                    <p className="text-[12px] text-white/30 mb-8 font-medium">
                        {currentDate}
                    </p>

                    <div className="w-full text-left space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-[32px] font-extrabold text-white tracking-tight leading-tight">
                                Bienvenido a Mi Portafolio
                            </h1>
                            <p className="text-xl text-white/80 font-medium">
                                👋 ¡Hola! Gracias por visitar mi portafolio interactivo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-3">
                                <h3 className="text-lg font-bold text-blue-400">🖥️ ¿Qué es esto?</h3>
                                <p className="text-[14px] text-white/60 leading-relaxed font-medium">
                                    Este es un portafolio interactivo diseñado como una réplica funcional de macOS.
                                    Explora mis proyectos y experiencia de forma inmersiva.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-3">
                                <h3 className="text-lg font-bold text-purple-400">🧭 Cómo navegar</h3>
                                <p className="text-[14px] text-white/60 leading-relaxed font-medium">
                                    Usa el Finder para ver archivos, el Dock para apps y Spotlight (⌘+Espacio) para buscar.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">🚀 Funcionalidades</h2>
                            <ul className="space-y-3">
                                <li className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[12px] font-bold text-white/40 shrink-0 mt-0.5">1</div>
                                    <p className="text-[15px] text-white/80 font-medium"><span className="text-white font-bold">Finder:</span> Navega por mi sistema de archivos real.</p>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[12px] font-bold text-white/40 shrink-0 mt-0.5">2</div>
                                    <p className="text-[15px] text-white/80 font-medium"><span className="text-white font-bold">Escritorio:</span> Abre tus CVs en PDF directamente.</p>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[12px] font-bold text-white/40 shrink-0 mt-0.5">3</div>
                                    <p className="text-[15px] text-white/80 font-medium"><span className="text-white font-bold">Dock Inteligente:</span> Apps con animaciones fluidas.</p>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-12 text-center text-white/20 text-[11px] font-bold tracking-widest uppercase">
                            Hecho con amor en Next.js • 2026
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

NotesApp.displayName = 'NotesApp';

export default NotesApp;
