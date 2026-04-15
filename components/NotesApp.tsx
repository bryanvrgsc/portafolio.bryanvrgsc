"use client";

import React, { useState, useContext } from 'react';
import { ListChecks, Table as TableIcon, Paperclip, ChevronsRight } from 'lucide-react';
import { WindowContext } from './Window';

const featureItems = [
    {
        id: 'finder',
        label: 'Finder',
        title: 'Navega por mi sistema de archivos real.',
    },
    {
        id: 'desktop',
        label: 'Escritorio',
        title: 'Abre tus CVs en PDF directamente.',
    },
    {
        id: 'dock',
        label: 'Dock Inteligente',
        title: 'Apps con animaciones fluidas.',
    },
] as const;

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
        <div className="tahoe-app-surface flex h-full flex-col overflow-hidden select-none">
            <div
                className="tahoe-app-toolbar grid h-[52px] shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls?.start(e)}
            >
                <div aria-hidden="true" className="w-[88px]" />

                <div className="justify-self-center">
                    <span className="text-[14px] font-semibold tracking-[0.02em]" style={{ color: 'var(--tahoe-text-primary)' }}>
                        Mi Portafolio
                    </span>
                </div>

                <div className="flex items-center justify-self-end gap-2">
                    <div
                        className="tahoe-control-cluster pointer-events-auto flex items-center gap-1 rounded-[16px] p-1"
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <button
                            className="tahoe-control-button rounded-[11px] px-3 py-1.5 text-[14px] font-medium"
                            data-active="true"
                            aria-label="Opciones de formato"
                        >
                            Aa
                        </button>
                        <button
                            className="tahoe-control-button flex h-8 w-8 items-center justify-center rounded-[11px]"
                            aria-label="Lista de tareas"
                        >
                            <ListChecks size={18} strokeWidth={2} />
                        </button>
                        <button
                            className="tahoe-control-button flex h-8 w-8 items-center justify-center rounded-[11px]"
                            aria-label="Insertar tabla"
                        >
                            <TableIcon size={18} strokeWidth={2} />
                        </button>
                        <button
                            className="tahoe-control-button flex h-8 w-8 items-center justify-center rounded-[11px]"
                            aria-label="Adjuntar archivo"
                        >
                            <Paperclip size={18} strokeWidth={2} />
                        </button>
                    </div>

                    <button
                        className="tahoe-control-button pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-[var(--tahoe-stroke-soft)] bg-[var(--tahoe-control-surface)]"
                        onPointerDown={(e) => e.stopPropagation()}
                        aria-label="Expandir"
                    >
                        <ChevronsRight size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-10 custom-scrollbar sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pt-6">
                    <div className="flex justify-center">
                        <p
                            className="rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.28em] uppercase"
                            style={{
                                background: 'var(--tahoe-control-surface)',
                                borderColor: 'var(--tahoe-stroke-soft)',
                                color: 'var(--tahoe-text-tertiary)',
                            }}
                        >
                            {currentDate}
                        </p>
                    </div>

                    <div
                        className="tahoe-content-card rounded-[32px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9"
                        style={{
                            background:
                                'linear-gradient(180deg, color-mix(in srgb, var(--tahoe-content-card-surface) 92%, white), var(--tahoe-content-card-surface))',
                        }}
                    >
                        <div className="space-y-4">
                            <p className="tahoe-sidebar-section-title text-[11px] font-semibold">
                                Nota
                            </p>
                            <h1
                                className="text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-[1.06] tracking-[-0.03em]"
                                style={{ color: 'var(--tahoe-text-primary)' }}
                            >
                                Bienvenido a Mi Portafolio
                            </h1>
                            <p
                                className="max-w-2xl text-[17px] leading-8 font-medium"
                                style={{ color: 'var(--tahoe-text-secondary)' }}
                            >
                                👋 ¡Hola! Gracias por visitar mi portafolio interactivo.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <div className="tahoe-content-card rounded-[26px] p-5 sm:p-6">
                                <h3
                                    className="text-[15px] font-semibold"
                                    style={{ color: 'var(--tahoe-accent)' }}
                                >
                                    🖥️ ¿Qué es esto?
                                </h3>
                                <p
                                    className="mt-3 text-[14px] leading-7 font-medium"
                                    style={{ color: 'var(--tahoe-text-secondary)' }}
                                >
                                    Este es un portafolio interactivo diseñado como una réplica funcional de macOS.
                                    Explora mis proyectos y experiencia de forma inmersiva.
                                </p>
                            </div>

                            <div className="tahoe-content-card rounded-[26px] p-5 sm:p-6">
                                <h3
                                    className="text-[15px] font-semibold"
                                    style={{ color: 'var(--tahoe-accent)' }}
                                >
                                    🧭 Cómo navegar
                                </h3>
                                <p
                                    className="mt-3 text-[14px] leading-7 font-medium"
                                    style={{ color: 'var(--tahoe-text-secondary)' }}
                                >
                                    Usa el Finder para ver archivos, el Dock para apps y Spotlight (⌘+Espacio) para buscar.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <h2
                                    className="text-[18px] font-semibold tracking-[-0.02em]"
                                    style={{ color: 'var(--tahoe-text-primary)' }}
                                >
                                    🚀 Funcionalidades
                                </h2>
                                <div className="h-px flex-1" style={{ background: 'var(--tahoe-hairline)' }} />
                            </div>

                            <ol className="space-y-3">
                                {featureItems.map((item, index) => (
                                    <li key={item.id} className="flex items-start gap-4 rounded-[22px] px-4 py-3">
                                        <div
                                            className="tahoe-content-card mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                                            style={{ color: 'var(--tahoe-text-secondary)' }}
                                        >
                                            {index + 1}
                                        </div>
                                        <p
                                            className="text-[14px] leading-7 font-medium"
                                            style={{ color: 'var(--tahoe-text-secondary)' }}
                                        >
                                            <span
                                                className="font-semibold"
                                                style={{ color: 'var(--tahoe-text-primary)' }}
                                            >
                                                {item.label}:
                                            </span>{' '}
                                            {item.title}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div
                            className="mt-10 flex flex-wrap items-center justify-center gap-2 text-center text-[11px] font-semibold tracking-[0.22em] uppercase"
                            style={{ color: 'var(--tahoe-text-tertiary)' }}
                        >
                            <span>Hecho con amor en Next.js</span>
                            <span className="tahoe-status-separator">•</span>
                            <span>2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

NotesApp.displayName = 'NotesApp';

export default NotesApp;
