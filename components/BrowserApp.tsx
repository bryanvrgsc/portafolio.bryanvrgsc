"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Share, Plus, ExternalLink } from 'lucide-react';

interface Project {
  name: string;
  url: string;
  description: string;
  icon: string;
  canEmbed: boolean;
  screenshot?: string;
  highlights: string[];
}

const projects: Project[] = [
  {
    name: "GymApp",
    url: "https://github.com/bryanvrgsc/GymApp",
    description: "Arquitectura de software completa diseñada desde cero para gestión de gimnasios",
    icon: "💪",
    canEmbed: false,
    screenshot: "/screenshots/gymapp.png",
    highlights: ["iOS (SwiftUI, MVVM)", "Combine + Swift Concurrency", "Firebase/Auth0 Backend"]
  },
  {
    name: "Netflix Code Bot",
    url: "https://github.com/bryanvrgsc/netflix_code_bot",
    description: "Solución de automatización para gestión de identidad compartida",
    icon: "🤖",
    canEmbed: false,
    screenshot: "/screenshots/netflix.png",
    highlights: ["Node.js + Puppeteer", "IMAP/WhatsApp Integration", "WebSockets Real-time"]
  },
  {
    name: "Sitio Refrigeración",
    url: "https://github.com/bryanvrgsc/Website_Refrigeracion",
    description: "Sitio web corporativo de alto rendimiento para servicios de climatización",
    icon: "❄️",
    canEmbed: false,
    screenshot: "/screenshots/refrigeracion.png",
    highlights: ["Astro 5.0 + Tailwind 4.0", "SSG Optimizado", "UI/UX Moderna"]
  },
  {
    name: "Portafolio Personal",
    url: "https://github.com/bryanvrgsc/bryanvrgsc.github.io",
    description: "Landing page de marca personal de alto rendimiento y seguridad",
    icon: "🚀",
    canEmbed: false,
    screenshot: "/screenshots/freelance.png",
    highlights: ["Cloudflare Pages + Astro", "CSP, HSTS Security", "Formspree + reCAPTCHA"]
  }
];

interface Experience {
  company: string;
  position: string;
  location: string;
  period: string;
  icon: string;
  url: string;
  canEmbed: boolean;
  screenshot?: string; // Screenshot for blocked sites
  highlights: string[];
}

const experiences: Experience[] = [
  {
    company: "Freelance",
    position: "Software Engineer & Full Stack Developer",
    location: "Remoto",
    period: "Abr 2025 - Presente",
    icon: "💻",
    url: "https://bryanvrgsc.vercel.app/",
    canEmbed: false,
    screenshot: "/screenshots/freelance.png",
    highlights: [
      "Desarrollo de arquitecturas iOS (SwiftUI) y web de alto rendimiento",
      "Ingeniería de plataforma de gestión de gimnasios con backend Serverless",
      "Implementación de sitios corporativos SSG optimizados para SEO",
      "Automatización de procesos con Node.js/Puppeteer"
    ]
  },
  {
    company: "KREA Construction",
    position: "IT Support Specialist & Technical Analyst",
    location: "Seattle, Estados Unidos",
    period: "Ene 2025 - Abr 2025",
    icon: "🏗️",
    url: "https://kreaconstruction.com",
    canEmbed: true,
    highlights: [
      "Sistema de presupuestación automatizado Excel + Home Depot API",
      "Gestión integral de infraestructura TI y redes",
      "Análisis técnico de proyectos de construcción"
    ]
  },
  {
    company: "Universidad Anáhuac México",
    position: "Traductor Inglés-Español",
    location: "Huixquilucan, México",
    period: "Feb 2021 - Mar 2025",
    icon: "🎓",
    url: "https://www.anahuac.mx/mexico/",
    canEmbed: false,
    screenshot: "/screenshots/anahuac.png",
    highlights: [
      "Traducción técnica y académica por más de 4 años",
      "Gestión de plazos estrictos en entorno académico de alto nivel"
    ]
  },
  {
    company: "VITALIS AC",
    position: "Web Master & SysAdmin",
    location: "Madrid, España (Remoto)",
    period: "Feb 2024 - Dic 2024",
    icon: "🌱",
    url: "https://vitalis.net",
    canEmbed: true,
    highlights: [
      "Optimización WPO: LCP de 1.14s mejorando SEO y retención",
      "Administración de Moodle LMS y WordPress",
      "Mantenimiento de bases de datos SQL"
    ]
  },
  {
    company: "Fundación Acompaña",
    position: "Data Warehouse Engineer",
    location: "Ciudad de México, México",
    period: "Jun 2023 - Dic 2023",
    icon: "💜",
    url: "https://acompana.org/",
    canEmbed: false,
    screenshot: "/screenshots/acompana.png",
    highlights: [
      "Diseño de Data Warehouse consolidando 5 fuentes de datos",
      "Desarrollo de pipelines ETL para limpieza y transformación",
      "Implementación de dashboards para KPIs operativos"
    ]
  },
  {
    company: "Sports Miners",
    position: "Data Analyst & Python Developer",
    location: "Mexicali, México (Remoto)",
    period: "Ene 2023 - Jun 2023",
    icon: "🏀",
    url: "https://sportsminers.com",
    canEmbed: true,
    highlights: [
      "Automatización de ingesta de datos CSV a PostgreSQL",
      "Web Scraping de estadísticas NCAA/ESPN con Python",
      "Reportes analíticos y visualizaciones de rendimiento"
    ]
  }
];

const BrowserApp = React.memo(() => {
  const [, setUrl] = useState("bryanvrgsc.dev/portfolio");
  const [inputValue, setInputValue] = useState("bryanvrgsc.dev/portfolio");
  const [view, setView] = useState<'projects' | 'experience' | 'browser' | 'blocked'>('projects');
  const [iframeSrc, setIframeSrc] = useState("");
  const [blockedUrl, setBlockedUrl] = useState("");
  const [blockedCompany, setBlockedCompany] = useState("");
  const [blockedScreenshot, setBlockedScreenshot] = useState<string | undefined>("");

  const navigateTo = (newUrl: string, isRealSite: boolean = false, canEmbed: boolean = true, company: string = "", screenshot?: string) => {
    if (isRealSite) {
      const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;

      if (!canEmbed) {
        setBlockedUrl(fullUrl);
        setBlockedCompany(company);
        setBlockedScreenshot(screenshot);
        setView('blocked');
        setUrl(newUrl.replace('https://', ''));
        setInputValue(newUrl.replace('https://', ''));
      } else {
        setIframeSrc(fullUrl);
        setView('browser');
        setUrl(newUrl.replace('https://', ''));
        setInputValue(newUrl.replace('https://', ''));
      }
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

  const openInNewTab = () => {
    const url = view === 'browser' ? iframeSrc : blockedUrl;
    window.open(url, '_blank');
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
                className={`transition-colors ${(view === 'browser' || view === 'blocked') ? 'text-white cursor-pointer' : 'opacity-20'}`}
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
        {view === 'projects' && (
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
                  className="px-4 py-2 rounded-lg font-medium transition-colors bg-white/5 text-white/60 hover:bg-white/10"
                >
                  Experiencia
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-4xl font-bold tracking-tight mb-2">Proyectos</h2>
                <p className="text-white/40 text-lg">Haz clic en una tarjeta para visitar el repositorio.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <button
                    key={project.name}
                    onClick={() => navigateTo(project.url, true, project.canEmbed, project.name, project.screenshot)}
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
            </div>
          </div>
        )}

        {view === 'experience' && (
          <div className="h-full p-10 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {/* Tabs */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setView('projects')}
                  className="px-4 py-2 rounded-lg font-medium transition-colors bg-white/5 text-white/60 hover:bg-white/10"
                >
                  Proyectos
                </button>
                <button
                  onClick={() => setView('experience')}
                  className="px-4 py-2 rounded-lg font-medium transition-colors bg-orange-500 text-white"
                >
                  Experiencia
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-4xl font-bold tracking-tight mb-2">Experiencia</h2>
                <p className="text-white/40 text-lg">Haz clic en una empresa para visitar su sitio web.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {experiences.map((exp) => (
                  <button
                    key={exp.company}
                    onClick={() => navigateTo(exp.url, true, exp.canEmbed, exp.company, exp.screenshot)}
                    className="group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-2xl transition-all hover:from-orange-500/20 text-left w-full"
                  >
                    <div className="h-full p-6 bg-[#2c2c2e]/80 backdrop-blur-md rounded-[15px] border border-white/5 flex flex-col items-center text-center gap-4">
                      <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                        {exp.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-1">{exp.company}</h3>
                        <p className="text-xs text-orange-400/80 font-medium mb-2">{exp.position}</p>
                        <p className="text-xs text-white/40">{exp.period}</p>
                        <p className="text-xs text-white/30">{exp.location}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'browser' && (
          <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
            {/* Iframe del sitio */}
            <div className="flex-1 relative overflow-hidden">
              <iframe
                src={iframeSrc}
                className="w-full h-full border-none"
                title="Safari Browser"
              />
            </div>
            {/* Barra inferior con botón */}
            <div className="p-4 bg-[#2c2c2e] border-t border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">{inputValue.split('/')[0]}</h3>
                <p className="text-white/40 text-sm">{iframeSrc}</p>
              </div>
              <button
                onClick={openInNewTab}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
              >
                <ExternalLink size={18} />
                Visitar sitio
              </button>
            </div>
          </div>
        )}

        {view === 'blocked' && (
          <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
            {/* Screenshot del sitio */}
            <div className="flex-1 relative overflow-hidden">
              {blockedScreenshot ? (
                <img
                  src={blockedScreenshot}
                  alt={blockedCompany}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1e1e1e] to-[#2c2c2e]">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6">
                      🔒
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{blockedCompany}</h2>
                    <p className="text-white/60">Vista previa no disponible</p>
                  </div>
                </div>
              )}
            </div>
            {/* Barra inferior con botón */}
            <div className="p-4 bg-[#2c2c2e] border-t border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">{blockedCompany}</h3>
                <p className="text-white/40 text-sm">{blockedUrl}</p>
              </div>
              <button
                onClick={openInNewTab}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
              >
                <ExternalLink size={18} />
                Visitar sitio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default BrowserApp;
