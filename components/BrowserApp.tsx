"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Share, Plus } from 'lucide-react';

interface Project {
  name: string;
  url: string;
  description: string;
  icon: string;
  highlights: string[];
}

const projects: Project[] = [
  {
    name: "GymApp",
    url: "https://github.com/bryanvrgsc/GymApp",
    description: "Arquitectura de software completa diseñada desde cero para gestión de gimnasios",
    icon: "💪",
    highlights: ["SwiftUI + MVVM", "Firebase/Auth0", "Swift Concurrency"]
  },
  {
    name: "Netflix Code Bot",
    url: "https://github.com/bryanvrgsc/netflix_code_bot",
    description: "Solución de automatización para gestión de identidad compartida",
    icon: "🤖",
    highlights: ["Node.js + Puppeteer", "IMAP/WhatsApp", "WebSockets"]
  },
  {
    name: "Aire Acondicionado y Multiservicio Industrial",
    url: "https://github.com/bryanvrgsc/Website_Refrigeracion",
    description: "Sitio web corporativo de alto rendimiento para servicios de climatización",
    icon: "❄️",
    highlights: ["Astro 5.0", "Tailwind CSS 4.0", "SEO Optimizado"]
  },
  {
    name: "Portafolio Personal",
    url: "https://github.com/bryanvrgsc/bryanvrgsc.github.io",
    description: "Landing page de marca personal de alto rendimiento y seguridad",
    icon: "🚀",
    highlights: ["Cloudflare Pages", "Astro", "CSP/HSTS"]
  }
];

interface Experience {
  company: string;
  position: string;
  location: string;
  period: string;
  icon: string;
}

const experiences: Experience[] = [
  {
    company: "Freelance / Proyectos Independientes",
    position: "Software Engineer & Full Stack Developer",
    location: "Remoto",
    period: "Abr 2025 - Presente",
    icon: "💻"
  },
  {
    company: "KREA Construction",
    position: "IT Support Specialist & Technical Analyst",
    location: "Seattle, Estados Unidos",
    period: "Ene 2025 - Abr 2025",
    icon: "🏗️"
  },
  {
    company: "VITALIS AC, ONG",
    position: "Web Master & SysAdmin",
    location: "Madrid, España (Remoto)",
    period: "Feb 2024 - Dic 2024",
    icon: "🌐"
  },
  {
    company: "Fundación Acompaña",
    position: "Data Warehouse Engineer",
    location: "Ciudad de México",
    period: "Jun 2023 - Dic 2023",
    icon: "📊"
  },
  {
    company: "Sports Miners",
    position: "Data Analyst & Python Developer",
    location: "Mexicali, México (Remoto)",
    period: "Ene 2023 - Jun 2023",
    icon: "⚽"
  }
];

const BrowserApp = React.memo(() => {
  const [, setUrl] = useState("bryanvrgsc.dev/portfolio");
  const [inputValue, setInputValue] = useState("bryanvrgsc.dev/portfolio");
  const [view, setView] = useState<'projects' | 'experience' | 'browser'>('projects');
  const [iframeSrc, setIframeSrc] = useState("");

  const navigateTo = (newUrl: string, isRealSite: boolean = false) => {
    if (isRealSite) {
      const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
      setIframeSrc(fullUrl);
      setView('browser');
      setUrl(newUrl.replace('https://', ''));
      setInputValue(newUrl.replace('https://', ''));
    } else {
      setView('projects');
      setUrl("bryanvrgsc.dev/portfolio");
      setInputValue("bryanvrgsc.dev/portfolio");
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
        {view !== 'browser' ? (
          <div className="h-full p-10 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {/* Tabs */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setView('projects')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'projects' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  Proyectos
                </button>
                <button
                  onClick={() => setView('experience')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'experience' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  Experiencia
                </button>
              </div>

              {view === 'projects' && (
                <>
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold tracking-tight mb-2">Proyectos</h2>
                    <p className="text-white/40 text-lg">Haz clic en una tarjeta para visitar el repositorio.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <button
                        key={project.name}
                        onClick={() => navigateTo(project.url, true)}
                        className="group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-2xl transition-all hover:from-orange-500/20 text-left w-full"
                      >
                        <div className="h-full p-6 bg-[#2c2c2e]/80 backdrop-blur-md rounded-[15px] border border-white/5 flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                              {project.icon}
                            </div>
                            <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-white/40 font-mono">
                              github.com
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors mb-2">{project.name}</h3>
                            <p className="text-sm text-white/50 leading-relaxed mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {project.highlights.map((h) => (
                                <span key={h} className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded">{h}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {view === 'experience' && (
                <>
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold tracking-tight mb-2">Experiencia</h2>
                    <p className="text-white/40 text-lg">Trayectoria profesional en tecnología.</p>
                  </div>

                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div
                        key={exp.company}
                        className="p-6 bg-[#2c2c2e]/80 backdrop-blur-md rounded-2xl border border-white/5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl">
                            {exp.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                                <p className="text-orange-400 font-medium">{exp.company}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white/60 text-sm">{exp.period}</p>
                                <p className="text-white/40 text-xs">{exp.location}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
