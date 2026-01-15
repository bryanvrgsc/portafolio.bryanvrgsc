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
        <div className="px-3 py-1.5 hover:bg-white/5 rounded-md text-sm font-medium text-white/60 transition-colors cursor-default flex items-center gap-2">
          <span>GitHub</span>
        </div>
        <div className="px-3 py-1.5 hover:bg-white/5 rounded-md text-sm font-medium text-white/60 transition-colors cursor-default flex items-center gap-2">
          <span>LinkedIn</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-10 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-8 mb-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-5xl font-black shadow-2xl ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-500">
                BV
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#1c1c1e] shadow-lg"></div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-1">Bryan Vargas</h1>
              <p className="text-blue-400 text-lg font-medium">Senior Software Engineer</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/40">📍 San José, Costa Rica</div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/40">💼 Disponible</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10">
            <section>
              <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Biografía</h2>
              <p className="text-white/80 leading-relaxed text-lg">
                Ingeniero de software con más de 5 años de experiencia construyendo sistemas escalables y experiencias de usuario memorables. Especialista en el ecosistema de <span className="text-white font-semibold">JavaScript/TypeScript</span>, con un fuerte enfoque en el rendimiento y la accesibilidad.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-4">Stack Tecnológico</h2>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <div className="text-xs font-bold text-white/60 mb-2">Frontend</div>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'].map(s => (
                      <span key={s} className="text-sm text-white/90">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white/60 mb-2">Backend</div>
                  <div className="flex flex-wrap gap-2">
                    {['Node.js', 'Go', 'Python', 'PostgreSQL', 'Redis'].map(s => (
                      <span key={s} className="text-sm text-white/90">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfileApp;
