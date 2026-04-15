"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
  const sectionLabelStyle: React.CSSProperties = { color: 'var(--tahoe-text-tertiary)' };
  const secondaryTextStyle: React.CSSProperties = { color: 'var(--tahoe-text-secondary)' };
  const mutedTextStyle: React.CSSProperties = { color: 'var(--tahoe-text-tertiary)' };
  const surfaceCardStyle: React.CSSProperties = {
    background: 'var(--tahoe-toolbar-bg)',
    border: '1px solid var(--tahoe-stroke-soft)',
  };
  const sidebarLinkStyle: React.CSSProperties = { color: 'var(--tahoe-text-secondary)' };
  const pillStyle: React.CSSProperties = {
    background: 'var(--tahoe-toolbar-bg)',
    border: '1px solid var(--tahoe-stroke-soft)',
    color: 'var(--tahoe-text-secondary)',
  };
  const techPillStyle: React.CSSProperties = {
    background: 'var(--tahoe-toolbar-bg)',
    border: '1px solid var(--tahoe-stroke-soft)',
    color: 'var(--tahoe-text-primary)',
  };
  const timelineStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, var(--tahoe-stroke), var(--tahoe-hairline), transparent)',
  };
  const timelineNodeStyle: React.CSSProperties = {
    background: 'var(--tahoe-toolbar-bg)',
    border: '1px solid var(--tahoe-stroke)',
  };
  const pointerStyle: React.CSSProperties = {
    background: 'var(--tahoe-toolbar-bg)',
    borderLeft: '1px solid var(--tahoe-stroke-soft)',
    borderTop: '1px solid var(--tahoe-stroke-soft)',
  };

  return (
    <div className="tahoe-app-surface flex h-full flex-col overflow-hidden md:flex-row">
      {/* Sidebar */}
      <div
        className="tahoe-app-sidebar flex w-full shrink-0 flex-row gap-2 overflow-x-auto border-b p-4 no-scrollbar md:w-52 md:flex-col md:border-b-0 md:border-r"
        style={{ borderColor: 'var(--tahoe-hairline)' }}
      >
        <div className="mb-2 hidden px-2 text-[11px] font-bold uppercase tracking-wider md:block" style={sectionLabelStyle}>Navegación</div>
        <button
          onClick={() => setActiveTab('info')}
          className={`rounded-xl px-3 py-1.5 text-left text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'info' ? 'bg-blue-500 text-white shadow-[0_12px_28px_rgba(59,130,246,0.24)]' : 'hover:bg-white/10 hover:text-[var(--tahoe-text-primary)]'
          }`}
          style={activeTab === 'info' ? undefined : sidebarLinkStyle}
        >
          Información
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`rounded-xl px-3 py-1.5 text-left text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'experience' ? 'bg-blue-500 text-white shadow-[0_12px_28px_rgba(59,130,246,0.24)]' : 'hover:bg-white/10 hover:text-[var(--tahoe-text-primary)]'
          }`}
          style={activeTab === 'experience' ? undefined : sidebarLinkStyle}
        >
          Experiencia
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`rounded-xl px-3 py-1.5 text-left text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'projects' ? 'bg-blue-500 text-white shadow-[0_12px_28px_rgba(59,130,246,0.24)]' : 'hover:bg-white/10 hover:text-[var(--tahoe-text-primary)]'
          }`}
          style={activeTab === 'projects' ? undefined : sidebarLinkStyle}
        >
          Proyectos
        </button>

        <div className="mt-8 mb-2 hidden px-2 text-[11px] font-bold uppercase tracking-wider md:block" style={sectionLabelStyle}>Social</div>
        <a
          href="https://github.com/bryanvrgsc"
          target="_blank"
          rel="noopener noreferrer"
          className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap hover:bg-white/10 hover:text-[var(--tahoe-text-primary)]"
          style={sidebarLinkStyle}
        >
          <span>GitHub</span>
        </a>
        <a
          href="https://linkedin.com/in/bryanvrgsc"
          target="_blank"
          rel="noopener noreferrer"
          className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap hover:bg-white/10 hover:text-[var(--tahoe-text-primary)]"
          style={sidebarLinkStyle}
        >
          <span>LinkedIn</span>
        </a>
      </div>

      {/* Main Content */}
      <div className="tahoe-app-panel flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl p-4 md:p-10">
          {/* Header - Always visible */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center text-4xl md:text-5xl font-black shadow-2xl ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-500">
                BV
              </div>
              <div
                className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full bg-green-500 shadow-lg md:-right-2 md:-bottom-2 md:h-8 md:w-8"
                style={{ border: '4px solid var(--tahoe-app-panel-surface)' }}
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-1">Bryan Alan Vargas Chávez</h1>
              <p className="text-orange-400 text-base md:text-lg font-medium">Software Engineer | Full Stack (iOS/Web) & Data Analyst</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-3 mt-4 flex-wrap">
                <div className="rounded-full border px-3 py-1 text-xs" style={pillStyle}>📍 Cuautitlán Izcalli & Huixquilucan, MX</div>
                <div className="rounded-full border px-3 py-1 text-xs" style={pillStyle}>🌐 Open to Remote</div>
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">💼 Disponible</div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 gap-10">
              <section>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest" style={sectionLabelStyle}>Perfil</h2>
                <p className="text-base leading-relaxed" style={secondaryTextStyle}>
                  Ingeniero en Sistemas especializado en <span style={{ color: 'var(--tahoe-text-primary)' }} className="font-semibold">Desarrollo de Software</span> y <span style={{ color: 'var(--tahoe-text-primary)' }} className="font-semibold">Análisis de Datos</span> con enfoque en la transformación digital y eficiencia operativa. Especializado en el diseño de arquitecturas escalables, implementación de soluciones Cloud/Web y construcción de Data Warehouses para la toma de decisiones estratégicas. Trayectoria probada en la gestión integral de proyectos tecnológicos y soporte especializado en entornos corporativos internacionales, destacando por la capacidad de traducir requerimientos complejos en soluciones técnicas robustas, seguras y de alto rendimiento.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest" style={sectionLabelStyle}>Educación</h2>
                <div className="rounded-2xl p-4" style={surfaceCardStyle}>
                  <div className="flex gap-4 items-start">
                    <div className="relative w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                      <Image
                        src="/icons/anahuac.svg"
                        alt="Universidad Anáhuac"
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Lic. Ingeniería en Sistemas y Tecnologías de la Información</h3>
                        <p className="text-sm" style={secondaryTextStyle}>Universidad Anáhuac - Campus Norte</p>
                        <p className="mt-1 text-xs" style={mutedTextStyle}>Huixquilucan, México</p>
                      </div>
                      <div className="text-right">
                        <span className="text-orange-400 text-sm font-medium">Dic 2024</span>
                        <p className="mt-1 text-xs" style={mutedTextStyle}>Cédula: 14635537</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest" style={sectionLabelStyle}>Stack Tecnológico</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                  <div>
                    <div className="mb-2 text-xs font-bold" style={secondaryTextStyle}>Mobile (iOS)</div>
                    <div className="flex flex-wrap gap-2">
                      {['Swift', 'SwiftUI', 'Combine', 'Core Data', 'XCTest'].map(s => (
                        <span key={s} className="rounded-md border px-2 py-0.5 text-sm" style={techPillStyle}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-bold" style={secondaryTextStyle}>Web</div>
                    <div className="flex flex-wrap gap-2">
                      {['Astro', 'Tailwind', 'TypeScript', 'Next.js', 'Node.js'].map(s => (
                        <span key={s} className="rounded-md border px-2 py-0.5 text-sm" style={techPillStyle}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-bold" style={secondaryTextStyle}>Backend & Cloud</div>
                    <div className="flex flex-wrap gap-2">
                      {['Firebase', 'Auth0', 'Cloudflare', 'Vercel', 'REST APIs'].map(s => (
                        <span key={s} className="rounded-md border px-2 py-0.5 text-sm" style={techPillStyle}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-bold" style={secondaryTextStyle}>Data & Analytics</div>
                    <div className="flex flex-wrap gap-2">
                      {['PostgreSQL', 'MySQL', 'MongoDB', 'Python', 'Power BI'].map(s => (
                        <span key={s} className="rounded-md border px-2 py-0.5 text-sm" style={techPillStyle}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest" style={sectionLabelStyle}>Idiomas</h2>
                <div className="flex flex-wrap gap-4">
                  <div className="rounded-lg border px-4 py-2" style={surfaceCardStyle}>
                    <span className="font-medium">Español</span>
                    <span className="ml-2 text-sm" style={mutedTextStyle}>Nativo</span>
                  </div>
                  <div className="rounded-lg border px-4 py-2" style={surfaceCardStyle}>
                    <span className="font-medium">Inglés</span>
                    <span className="ml-2 text-sm" style={mutedTextStyle}>Avanzado</span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest" style={sectionLabelStyle}>Contacto</h2>
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:bryanvrgsc@gmail.com" className="flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-white/10" style={surfaceCardStyle}>
                    <span>📧</span>
                    <span style={secondaryTextStyle}>bryanvrgsc@gmail.com</span>
                  </a>
                  <a href="tel:+12533687369" className="flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-white/10" style={surfaceCardStyle}>
                    <span>📱</span>
                    <span style={secondaryTextStyle}>+1 253 368 7369</span>
                  </a>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'experience' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative pb-10"
            >
              <h2 className="text-2xl font-bold mb-8 pl-2">Experiencia Profesional</h2>

              {/* Vertical Timeline Line */}
              <div className="absolute left-6 top-[70px] bottom-0 w-px" style={timelineStyle} />

              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.company}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="relative flex gap-6 group"
                  >
                    {/* Timeline Node/Icon */}
                    <div
                      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl shadow-lg transition-all duration-300 group-hover:border-orange-500/50 group-hover:shadow-orange-500/20"
                      style={timelineNodeStyle}
                    >
                      {exp.icon}
                    </div>

                    {/* Content Card */}
                    <div
                      className="relative flex-1 rounded-2xl p-5 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                      style={surfaceCardStyle}
                    >
                      {/* Triangle Pointer */}
                      <div className="absolute top-6 -left-2 h-4 w-4 -rotate-45 rounded-tl-sm transition-colors" style={pointerStyle} />

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                        <div>
                          <h3 className="text-lg font-bold transition-colors group-hover:text-orange-400">{exp.position}</h3>
                          <p className="text-orange-400 font-medium text-sm sm:text-base">{exp.company}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="mb-1 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium" style={pillStyle}>
                            <span>📅</span>
                            {exp.period}
                          </div>
                          <p className="flex items-center gap-1 text-xs sm:justify-end" style={mutedTextStyle}>
                            <span>📍</span>
                            {exp.location}
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-2 mt-4">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={secondaryTextStyle}>
                            <span className="text-orange-400/70 mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400/70 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold mb-6">Proyectos Destacados</h2>
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="rounded-2xl p-5 transition-colors hover:bg-white/[0.07]"
                  style={surfaceCardStyle}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-2xl" style={surfaceCardStyle}>
                      {project.icon}
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="mb-1 text-lg font-bold">{project.name}</h3>
                        <p className="mb-2 text-sm" style={secondaryTextStyle}>{project.description}</p>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 text-xs font-mono">
                          {project.url.replace('https://', '')} →
                        </a>
                      </div>
                      <ul className="space-y-2">
                        {project.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={secondaryTextStyle}>
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
