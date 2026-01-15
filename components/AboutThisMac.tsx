"use client";

import React from 'react';
import Image from 'next/image';

const AboutThisMac = React.memo(() => {
  return (
    <div className="flex flex-col items-center pt-8 pb-6 px-12 text-white h-full bg-[#1e1e1e] font-sans">
      {/* Laptop Image */}
      <div className="mt-4 mb-4 w-full max-w-[260px] flex justify-center">
        <Image
          src="/macbook_pro.png"
          alt="MacBook Pro"
          width={260}
          height={160}
          className="object-contain"
          priority
        />
      </div>

      {/* Title and Subtitle */}
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-white mb-0">MacBook Pro</h1>
        <p className="text-[#888888] text-[13px] font-medium">13-inch, M1, 2020</p>
      </div>

      {/* Specs Grid */}
      <div className="w-full max-w-[280px] mb-8">
        <div className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-1 text-[13px] items-baseline">
          <span className="text-right font-semibold text-white/90">Chip</span>
          <span className="text-left text-white font-medium">Apple M1</span>

          <span className="text-right font-semibold text-white/90">Memoria</span>
          <span className="text-left text-white font-medium">16 GB</span>

          <span className="text-right font-semibold text-white/90">Número de serie</span>
          <span className="text-left text-white font-medium select-text">C02DP1K40KPF</span>

          <span className="text-right font-semibold text-white/90">macOS</span>
          <span className="text-left text-white font-medium">Tahoe 26.2</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-8">
        <button className="px-5 py-1.5 bg-[#323232] hover:bg-[#3d3d3d] active:bg-[#2a2a2a] rounded-lg text-[13px] font-medium transition-colors border border-white/[0.05] shadow-sm">
          Más información...
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-auto text-center flex flex-col items-center gap-1">
        <p className="text-[#2466d0] hover:underline cursor-pointer text-[12px] decoration-[#2466d0]/40">
          Certificación reglamentaria
        </p>
        <div className="text-[#888888] text-[11px] leading-tight space-y-0.5 mt-1">
          <p>™ y © 1983-2025 Apple Inc.</p>
          <p>Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
});

export default AboutThisMac;
