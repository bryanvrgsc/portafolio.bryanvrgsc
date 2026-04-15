"use client";

import React from 'react';
import Image from 'next/image';

const AboutThisMac = React.memo(() => {
  return (
    <div className="tahoe-app-surface flex h-full flex-col items-center px-12 pt-8 pb-6 font-sans">
      {/* Laptop Image */}
      <div className="mt-4 mb-4 w-full max-w-[260px] flex justify-center">
        <Image
          src="/macbook_pro.avif"
          alt="MacBook Pro"
          width={260}
          height={160}
          className="object-contain"
          priority
        />
      </div>

      {/* Title and Subtitle */}
      <div className="text-center mb-8">
        <h1 className="mb-0 text-[28px] font-bold tracking-tight">MacBook Pro</h1>
        <p className="text-[13px] font-medium" style={{ color: 'var(--tahoe-text-secondary)' }}>13-inch, M1, 2020</p>
      </div>

      {/* Specs Grid */}
      <div className="w-full max-w-[280px] mb-8">
        <div className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-1 text-[13px] items-baseline">
          <span className="text-right font-semibold" style={{ color: 'var(--tahoe-text-secondary)' }}>Chip</span>
          <span className="text-left font-medium">Apple M1</span>

          <span className="text-right font-semibold" style={{ color: 'var(--tahoe-text-secondary)' }}>Memoria</span>
          <span className="text-left font-medium">16 GB</span>

          <span className="text-right font-semibold" style={{ color: 'var(--tahoe-text-secondary)' }}>Número de serie</span>
          <span className="text-left font-medium select-text">C02DP1K40KPF</span>

          <span className="text-right font-semibold" style={{ color: 'var(--tahoe-text-secondary)' }}>macOS</span>
          <span className="text-left font-medium">Tahoe 26.2</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-8">
        <button className="rounded-lg border px-5 py-1.5 text-[13px] font-medium shadow-sm transition-colors" style={{ background: 'var(--tahoe-app-toolbar-surface)', borderColor: 'var(--tahoe-stroke-soft)' }}>
          Más información...
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-auto text-center flex flex-col items-center gap-1">
        <p className="cursor-pointer text-[12px] hover:underline" style={{ color: 'var(--tahoe-accent)', textDecorationColor: 'color-mix(in srgb, var(--tahoe-accent) 40%, transparent)' }}>
          Certificación reglamentaria
        </p>
        <div className="mt-1 space-y-0.5 text-[11px] leading-tight" style={{ color: 'var(--tahoe-text-secondary)' }}>
          <p>™ y © 1983-2025 Apple Inc.</p>
          <p>Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
});

AboutThisMac.displayName = 'AboutThisMac';

export default AboutThisMac;
