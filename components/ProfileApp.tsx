"use client";

import React, { useState } from 'react';

interface Experience {
  company: string;
  position: string;
  location: string;
  period: string;
  icon: string;
  highlights: string[];
}

interface Project {
  name: string;
  url: string;
  description: string;
  icon: string;
  highlights: string[];
}

const experiences: Experience[] = [
  {
    company: "Freelance / Proyectos Independientes",
    position: "Software Engineer & Full Stack Developer",
    location: "Remoto",
    period: "Abr 2025 - Presente",
    icon: "💻",
    highlights: [
      "Desarrollo de arquitecturas de software completas para clientes y productos propios, especializándome en ecosistemas móviles (iOS) y web de alto rendimiento.",
      "Ingeniería de una plataforma de gestión de gimnasios (iOS/SwiftUI) con backend Serverless, integrando autenticación segura y sincronización en tiempo real.",
      "Implementación de sitios corporativos estáticos (SSG con Astro/Tailwind) optimizados para SEO técnico, velocidad y seguridad.",
      "Automatización de procesos de negocio mediante bots y scripts (Node.js/Puppeteer), reduciendo tareas manuales repetitivas."
    ]
  },
  {
    company: "KREA Construction",
    position: "IT Support Specialist & Technical Analyst",
    location: "Seattle, Estados Unidos",
    period: "Ene 2025 - Abr 2025",
    icon: "🏗️",
    highlights: [
      "Desarrollo e implementación de un sistema de presupuestación automatizado conectando Excel con datos de productos de Home Depot, optimizando la precisión y tiempo de cotización de proyectos.",
      "Gestión integral de infraestructura TI: Mantenimiento preventivo/correctivo de hardware/software y administración de redes para asegurar continuidad operativa.",
      "Análisis técnico de proyectos de construcción, elaborando catálogos de materiales y presupuestos basados en datos."
    ]
  },
  {
    company: "Universidad Anáhuac México Norte",
    position: "Traductor Inglés-Español",
    location: "Huixquilucan, México",
    period: "Feb 2021 - Mar 2025",
    icon: "🎓",
    highlights: [
      "Traducción técnica y académica de documentos complejos durante más de 4 años, garantizando precisión terminológica y coherencia cultural.",
      "Gestión de plazos estrictos y comunicación intercultural efectiva en un entorno académico de alto nivel."
    ]
  },
  {
    company: "VITALIS AC, ONG",
    position: "Web Master & SysAdmin",
    location: "Madrid, España (Remoto)",
    period: "Feb 2024 - Dic 2024",
    icon: "🌱",
    highlights: [
      "Optimización de rendimiento web (WPO): Reducción drástica de tiempos de carga, alcanzando un Largest Contentful Paint (LCP) de 1.14s, mejorando significativamente el SEO y la retención de usuarios.",
      "Administración y actualización de servidores y plataformas críticas (Moodle LMS, WordPress), asegurando disponibilidad y seguridad de los datos.",
      "Mantenimiento y optimización de bases de datos SQL para soportar la carga operativa de la organización."
    ]
  },
  {
    company: "Fundación Acompaña",
    position: "Data Warehouse Engineer",
    location: "Ciudad de México, México",
    period: "Jun 2023 - Dic 2023",
    icon: "💜",
    highlights: [
      "Diseño de Data Warehouse consolidando 5 fuentes de datos distintas, incluyendo la normalización de registros históricos en Excel (2021-2023) dispares.",
      "Desarrollo de pipelines ETL robustos para la limpieza y transformación de datos, asegurando la integridad de la información para la toma de decisiones.",
      "Implementación de dashboards de visualización de datos para la directiva, permitiendo identificar tendencias y KPIs operativos."
    ]
  },
  {
    company: "Sports Miners",
    position: "Data Analyst & Python Developer",
    location: "Mexicali, México (Remoto)",
    period: "Ene 2023 - Jun 2023",
    icon: "🏀",
    highlights: [
      "Automatización de Ingesta de Datos: Desarrollo de scripts en Python para procesar archivos CSV masivos e importarlos automáticamente a PostgreSQL, eliminando la carga manual y reduciendo errores.",
      "Web Scraping avanzado de estadísticas deportivas (NCAA/ESPN) utilizando RegEx y SQL.",
      "Creación de reportes analíticos automatizados y visualizaciones gráficas para la evaluación de rendimiento de jugadores."
    ]
  }
];

const projects: Project[] = [
  {
    name: "GymApp",
    url: "https://github.com/bryanvrgsc/GymApp",
    description: "Arquitectura de software completa diseñada desde cero para gestión de gimnasios",
    icon: "💪",
    highlights: [
      "Arquitectura iOS (SwiftUI, MVVM): Implementación de Combine y Swift Concurrency para alto rendimiento.",
      "Backend Serverless (Firebase/Auth0): Autenticación segura y base de datos NoSQL en tiempo real."
    ]
  },
  {
    name: "Netflix Code Bot",
    url: "https://github.com/bryanvrgsc/netflix_code_bot",
    description: "Solución de automatización para gestión de identidad compartida",
    icon: "🤖",
    highlights: [
      "Stack: Node.js, Puppeteer y WebSockets para automatización de navegación y actualizaciones en tiempo real.",
      "Integración IMAP/WhatsApp: Sistema de escucha de correos y reenvío automático de códigos."
    ]
  },
  {
    name: "Aire Acondicionado y Multiservicio Industrial",
    url: "https://github.com/bryanvrgsc/Website_Refrigeracion",
    description: "Sitio web corporativo de alto rendimiento para servicios de climatización",
    icon: "❄️",
    highlights: [
      "Astro 5.0 & Tailwind CSS 4.0: Desarrollo de sitio estático (SSG) optimizado para SEO y velocidad.",
      "UI/UX Moderna: Diseño responsivo con animaciones avanzadas y componentes reutilizables en TypeScript."
    ]
  },
  {
    name: "Portafolio Personal",
    url: "https://github.com/bryanvrgsc/bryanvrgsc.github.io",
    description: "Landing page de marca personal de alto rendimiento y seguridad",
    icon: "🚀",
    highlights: [
      "Cloudflare Pages & Astro: Despliegue en el edge para latencia mínima y seguridad robusta (CSP, HSTS).",
      "Integración Serverless: Gestión de contacto vía Formspree y protección con reCAPTCHA."
    ]
  }
];

const ProfileApp = React.memo(() => {
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'projects'>('info');

  return (
    <div className="flex h-full text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-black/20 backdrop-blur-md border-r border-white/5 p-4 flex flex-col gap-2">
        <div className="text-[11px] font-bold text-white/30 px-2 mb-2 uppercase tracking-wider">Navegación</div>
        <button onClick={() => setActiveTab('info')} className={`px-3 py-1.5 rounded-md text-sm font-medium text-left transition-colors ${activeTab === 'info' ? 'bg-blue-500' : 'hover:bg-white/5 text-white/60'}`}>Información</button>
        <button onClick={() => setActiveTab('experience')} className={`px-3 py-1.5 rounded-md text-sm font-medium text-left transition-colors ${activeTab === 'experience' ? 'bg-blue-500' : 'hover:bg-white/5 text-white/60'}`}>Experiencia</button>
        <button onClick={() => setActiveTab('projects')} className={`px-3 py-1.5 rounded-md text-sm font-medium text-left transition-colors ${activeTab === 'projects' ? 'bg-blue-500' : 'hover:bg-white/5 text-white/60'}`}>Proyectos</button>

        <div className="mt-8 text-[11px] font-bold text-white/30 px-2 mb-2 uppercase tracking-wider">Social</div>
        <a href="https://github.com/bryanvrgsc" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 hover:bg-white/5 rounded-md text-sm font-medium text-white/60 transition-colors cursor-pointer flex items-center gap-2">
          <span>GitHub</span>
        </a>
        <a href="https://linkedin.com/in/bryanvrgsc" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 hover:bg-white/5 rounded-md text-sm font-medium text-white/60 transition-colors cursor-pointer flex items-center gap-2">
          <span>LinkedIn</span>
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-10 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-3xl mx-auto">
          {/* Header - Always visible */}
          <div className="flex items-center gap-8 mb-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center text-5xl font-black shadow-2xl ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-500">
                BV
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#1c1c1e] shadow-lg"></div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-1">Bryan Alan Vargas Chávez</h1>
              <p className="text-orange-400 text-lg font-medium">Software Engineer | Full Stack (iOS/Web) & Data Analyst</p>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/40">📍 Cuautitlán Izcalli & Huixquilucan, MX</div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/40">🌐 Open to Remote</div>
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">💼 Disponible</div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 gap-10">
              <section>
                <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Perfil</h2>
                <p className="text-white/80 leading-relaxed text-base">
                  Ingeniero en Sistemas especializado en <span className="text-white font-semibold">Desarrollo de Software</span> y <span className="text-white font-semibold">Análisis de Datos</span> con enfoque en la transformación digital y eficiencia operativa. Especializado en el diseño de arquitecturas escalables, implementación de soluciones Cloud/Web y construcción de Data Warehouses para la toma de decisiones estratégicas. Trayectoria probada en la gestión integral de proyectos tecnológicos y soporte especializado en entornos corporativos internacionales, destacando por la capacidad de traducir requerimientos complejos en soluciones técnicas robustas, seguras y de alto rendimiento.
                </p>
              </section>

              <section>
                <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Educación</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                      <img src="/icons/anahuac.svg" alt="Universidad Anáhuac" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold">Lic. Ingeniería en Sistemas y Tecnologías de la Información</h3>
                        <p className="text-white/60 text-sm">Universidad Anáhuac - Campus Norte</p>
                        <p className="text-white/40 text-xs mt-1">Huixquilucan, México</p>
                      </div>
                      <div className="text-right">
                        <span className="text-orange-400 text-sm font-medium">Dic 2024</span>
                        <p className="text-white/40 text-xs mt-1">Cédula: 14635537</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Stack Tecnológico</h2>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div>
                    <div className="text-xs font-bold text-white/60 mb-2">Mobile (iOS)</div>
                    <div className="flex flex-wrap gap-2">
                      {['Swift', 'SwiftUI', 'Combine', 'Core Data', 'XCTest'].map(s => (
                        <span key={s} className="text-sm text-white/90 bg-white/5 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/60 mb-2">Web</div>
                    <div className="flex flex-wrap gap-2">
                      {['Astro', 'Tailwind', 'TypeScript', 'Next.js', 'Node.js'].map(s => (
                        <span key={s} className="text-sm text-white/90 bg-white/5 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/60 mb-2">Backend & Cloud</div>
                    <div className="flex flex-wrap gap-2">
                      {['Firebase', 'Auth0', 'Cloudflare', 'Vercel', 'REST APIs'].map(s => (
                        <span key={s} className="text-sm text-white/90 bg-white/5 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/60 mb-2">Data & Analytics</div>
                    <div className="flex flex-wrap gap-2">
                      {['PostgreSQL', 'MySQL', 'MongoDB', 'Python', 'Power BI'].map(s => (
                        <span key={s} className="text-sm text-white/90 bg-white/5 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Idiomas</h2>
                <div className="flex gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                    <span className="text-white font-medium">Español</span>
                    <span className="text-white/40 text-sm ml-2">Nativo</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                    <span className="text-white font-medium">Inglés</span>
                    <span className="text-white/40 text-sm ml-2">Avanzado</span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Contacto</h2>
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:bryanvrgsc@gmail.com" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors">
                    <span>📧</span>
                    <span className="text-white/80">bryanvrgsc@gmail.com</span>
                  </a>
                  <a href="tel:+12533687369" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors">
                    <span>📱</span>
                    <span className="text-white/80">+1 253 368 7369</span>
                  </a>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold mb-6">Experiencia Profesional</h2>
              {experiences.map((exp) => (
                <div key={exp.company} className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {exp.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                          <p className="text-orange-400 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-sm">{exp.period}</p>
                          <p className="text-white/40 text-xs">{exp.location}</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="text-sm text-white/70 flex items-start gap-2 leading-relaxed">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold mb-6">Proyectos Destacados</h2>
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {project.icon}
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                        <p className="text-white/60 text-sm mb-2">{project.description}</p>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 text-xs font-mono">
                          {project.url.replace('https://', '')} →
                        </a>
                      </div>
                      <ul className="space-y-2">
                        {project.highlights.map((h, i) => (
                          <li key={i} className="text-sm text-white/70 flex items-start gap-2 leading-relaxed">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProfileApp.displayName = 'ProfileApp';

export default ProfileApp;
