"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Share, Plus } from 'lucide-react';

interface Company {
  name: string;
  url: string;
  description: string;
  icon: string;
}

const companies: Company[] = [
  {
    name: "Boca Code",
    url: "https://bocacode.com",
    description: "Software Engineer - Desarrollé GameSync, una plataforma para coordinar sesiones de gaming.",
    icon: "🎮"
  },
  {
    name: "Cisco (Open Source)",
    url: "https://github.com/cisco-en-automation",
    description: "Contributor - Trabajo en automatización con Python y Go para SDKs de red.",
    icon: "🔌"
  },
  {
    name: "Innovación Digital",
    url: "https://example.com/innovacion",
    description: "Lead Frontend - Arquitectura de micro-frontends usando React y Next.js.",
    icon: "✨"
  },
  {
    name: "Global Tech Solutions",
    url: "https://example.com/global",
    description: "Fullstack Developer - Implementación de APIs escalables con Node.js y PostgreSQL.",
    icon: "🌐"
  }
];

const BrowserApp = React.memo(() => {
  const [, setUrl] = useState("bryanvrgsc.dev/companies");
  const [inputValue, setInputValue] = useState("bryanvrgsc.dev/companies");
  const [view, setView] = useState<'grid' | 'browser'>('grid');
  const [iframeSrc, setIframeSrc] = useState("");

  const navigateTo = (newUrl: string, isRealSite: boolean = false) => {
    if (isRealSite) {
      const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
      setIframeSrc(fullUrl);
      setView('browser');
      setUrl(newUrl.replace('https://', ''));
      setInputValue(newUrl.replace('https://', ''));
    } else {
      setView('grid');
      setUrl("bryanvrgsc.dev/companies");
      setInputValue("bryanvrgsc.dev/companies");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputValue, true);
  };

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-white">
      {/* Safari Header */}
      <div className="flex flex-col gap-2 p-2 bg-[#2c2c2e]/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="flex gap-4 text-white/40">
              <ChevronLeft
                size={20}
                className={`transition-colors ${view === 'browser' ? 'text-white cursor-pointer' : 'opacity-20'}`}
                onClick={() => navigateTo("", false)}
              />
              <ChevronRight size={20} className="opacity-20" />
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch}>
              <div className="h-8 bg-black/40 rounded-lg flex items-center px-3 gap-2 border border-white/5 text-[13px]">
                <span className="text-blue-400">🔒</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white/80 font-medium"
                />
                <RotateCw size={12} className="text-white/40 hover:text-white cursor-pointer" onClick={() => setIframeSrc(iframeSrc)} />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4 text-white/60">
            <Share size={18} className="hover:text-white cursor-pointer" />
            <Plus size={18} className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden">
        {view === 'grid' ? (
          <div className="h-full p-10 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl font-bold tracking-tight mb-2">Empresas & Proyectos</h2>
                <p className="text-white/40 text-lg">Haz clic en una tarjeta para visitar el sitio.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companies.map((company) => (
                  <button
                    key={company.name}
                    onClick={() => navigateTo(company.url, true)}
                    className="group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-2xl transition-all hover:from-blue-500/20 text-left w-full"
                  >
                    <div className="h-full p-6 bg-[#2c2c2e]/80 backdrop-blur-md rounded-[15px] border border-white/5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                          {company.icon}
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-white/40 font-mono">
                          {company.url.replace('https://', '')}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">{company.name}</h3>
                        <p className="text-sm text-white/50 leading-relaxed">{company.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-white">
            <iframe
              src={iframeSrc}
              className="w-full h-full border-none"
              title="Safari Browser"
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default BrowserApp;
