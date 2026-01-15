"use client";

import React from 'react';

const ProfileApp = React.memo(() => {
  return (
    <div className="flex h-full text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-black/20 backdrop-blur-md border-r border-white/5 p-4 flex flex-col gap-2">
        <div className="text-[11px] font-bold text-white/30 px-2 mb-2 uppercase tracking-wider">Contacto</div>
        <div className="px-3 py-1.5 bg-blue-500 rounded-md text-sm font-medium">Información</div>
        <div className="px-3 py-1.5 hover:bg-white/5 rounded-md text-sm font-medium text-white/60 transition-colors cursor-default">Experiencia</div>
        <div className="px-3 py-1.5 hover:bg-white/5 rounded-md text-sm font-medium text-white/60 transition-colors cursor-default">Proyectos</div>

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
        <div className="max-w-2xl mx-auto">
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

          <div className="grid grid-cols-1 gap-10">
            <section>
              <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Perfil</h2>
              <p className="text-white/80 leading-relaxed text-base">
                Ingeniero en Sistemas especializado en <span className="text-white font-semibold">Desarrollo de Software</span> y <span className="text-white font-semibold">Análisis de Datos</span> con enfoque en la transformación digital y eficiencia operativa. Especializado en el diseño de arquitecturas escalables, implementación de soluciones Cloud/Web y construcción de Data Warehouses para la toma de decisiones estratégicas. Trayectoria probada en la gestión integral de proyectos tecnológicos y soporte especializado en entornos corporativos internacionales.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Educación</h2>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start">
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
        </div>
      </div>
    </div>
  );
});

export default ProfileApp;
