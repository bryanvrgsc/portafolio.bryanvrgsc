"use client";

import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, RotateCw, Share, Plus, ExternalLink,
  PanelLeft, LayoutGrid, ChevronDown, Home, Shield, AlignLeft,
  Languages, Puzzle, User, Copy, Briefcase, FolderCode
} from 'lucide-react';
import { WindowContext } from './Window';
import Image from 'next/image';

interface Tab {
  id: string;
  url: string;
  view: 'projects' | 'experience' | 'browser' | 'blocked' | 'profile';
  iframeSrc: string;
  blockedUrl: string;
  blockedCompany: string;
  blockedScreenshot?: string;
  history: Array<{ view: 'projects' | 'experience' | 'browser' | 'blocked' | 'profile', url: string, iframeSrc?: string }>;
  historyIndex: number;
  title: string;
  icon: string;
}

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

interface TechStackItem {
  name: string;
  icon?: string;
  level: number; // 1-5 expertise dots
}

interface TechStackCategory {
  category: string;
  items: TechStackItem[];
}

const techStack: TechStackCategory[] = [
  {
    category: "Mobile (iOS)",
    items: [
      { name: "Swift", level: 5 },
      { name: "SwiftUI", level: 5 },
      { name: "Combine", level: 4 },
      { name: "Core Data", level: 4 },
      { name: "XCTest", level: 4 }
    ]
  },
  {
    category: "Web",
    items: [
      { name: "Astro", level: 5 },
      { name: "Tailwind", level: 5 },
      { name: "TypeScript", level: 5 },
      { name: "Next.js", level: 4 },
      { name: "Node.js", level: 4 }
    ]
  },
  {
    category: "Backend & Cloud",
    items: [
      { name: "Firebase", level: 4 },
      { name: "Auth0", level: 3 },
      { name: "Cloudflare", level: 4 },
      { name: "Vercel", level: 5 },
      { name: "REST APIs", level: 5 }
    ]
  },
  {
    category: "Data & Analytics",
    items: [
      { name: "PostgreSQL", level: 4 },
      { name: "MySQL", level: 4 },
      { name: "MongoDB", level: 3 },
      { name: "Python", level: 4 },
      { name: "Power BI", level: 3 }
    ]
  }
];

const profileData = {
  degree: "Lic. Ingeniería en Sistemas y Tecnologías de la Información",
  university: "Universidad Anáhuac - Campus Norte",
  location: "Huixquilucan, México",
  date: "Dic 2024",
  cedula: "14635537",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Logo_Uni_Anahuac.svg/1200px-Logo_Uni_Anahuac.svg.png"
};

const contactInfo = {
  email: "bryanvrgsc@gmail.com",
  phone: "+1 253 368 7369",
  social: [
    { name: "GitHub", url: "https://github.com/bryanvrgsc", icon: "🐙" },
    { name: "LinkedIn", url: "https://linkedin.com/in/bryanvrgsc", icon: "💼" }
  ]
};

interface LanguageItem {
  name: string;
  level: string;
}

const languages: LanguageItem[] = [
  { name: "Español", level: "Nativo" },
  { name: "Inglés", level: "Avanzado" }
];

const ScrambledText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "!@#$%^&*()_+{}:\"<>?|1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    let iteration = 0;

    const startScramble = () => {
      const interval = setInterval(() => {
        setDisplayText(prev =>
          text.split("").map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    };

    const timeout = setTimeout(startScramble, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [text, delay]);

  return <>{displayText}</>;
};

const BrowserApp = React.memo(() => {
  const windowContext = useContext(WindowContext);
  const dragControls = windowContext?.dragControls;

  // New Safari Functional States (Global Browser Style)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(100); // Percentage
  const [showTabOverview, setShowTabOverview] = useState(false);

  // 3D Tilt Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-10, 10]), springConfig);

  // Floating Icons Motion Values (Fixed hooks)
  const spotlightX = useSpring(useTransform(mouseX, [-500, 500], [0, 600]));
  const spotlightY = useSpring(useTransform(mouseY, [-500, 500], [400, 600]));
  const leafX = useSpring(useTransform(mouseX, [-500, 500], [-10, 10]));
  const leafY = useSpring(useTransform(mouseY, [-500, 500], [-10, 10]));
  const nodeX = useSpring(useTransform(mouseX, [-500, 500], [20, -20]));
  const nodeY = useSpring(useTransform(mouseY, [-500, 500], [20, -20]));
  const reactX = useSpring(useTransform(mouseX, [-500, 500], [-40, 40]));
  const reactY = useSpring(useTransform(mouseY, [-500, 500], [-40, 40]));
  const appleX = useSpring(useTransform(mouseX, [-500, 500], [30, -30]));
  const appleY = useSpring(useTransform(mouseY, [-500, 500], [30, -30]));

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Iframe loading and error state
  const [iframeLoading, setIframeLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // URL Validation helper
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  // Tab State Management
  const [tabs, setTabs] = useState<Tab[]>([{
    id: '1',
    url: "bryanvrgsc.dev/portfolio",
    view: 'experience',
    iframeSrc: "",
    blockedUrl: "",
    blockedCompany: "",
    history: [{ view: 'experience', url: "bryanvrgsc.dev/portfolio" }],
    historyIndex: 0,
    title: "Experiencia",
    icon: "💻"
  }]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [inputValue, setInputValue] = useState(tabs[0].url);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateActiveTab = (updates: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  };

  const createNewTab = () => {
    const newId = Math.random().toString(36).substring(7);
    const newTab: Tab = {
      id: newId,
      url: "bryanvrgsc.dev/portfolio",
      view: 'projects',
      iframeSrc: "",
      blockedUrl: "",
      blockedCompany: "",
      history: [{ view: 'projects', url: "bryanvrgsc.dev/portfolio" }],
      historyIndex: 0,
      title: "Nueva pestaña",
      icon: "🧭"
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    setInputValue(newTab.url);
    setShowTabOverview(false);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // If last tab, just reset it
      setTabs([{
        id: '1',
        url: "bryanvrgsc.dev/portfolio",
        view: 'projects',
        iframeSrc: "",
        blockedUrl: "",
        blockedCompany: "",
        history: [{ view: 'projects', url: "bryanvrgsc.dev/portfolio" }],
        historyIndex: 0,
        title: "Portafolio",
        icon: "📂"
      }]);
      setActiveTabId('1');
      setInputValue("bryanvrgsc.dev/portfolio");
    } else {
      const newTabs = tabs.filter(t => t.id !== id);
      setTabs(newTabs);
      if (activeTabId === id) {
        const index = tabs.findIndex(t => t.id === id);
        const nextId = newTabs[Math.max(0, index - 1)].id;
        setActiveTabId(nextId);
        setInputValue(newTabs[Math.max(0, index - 1)].url);
      }
    }
  };

  // Keyboard Shortcuts (Cmd+T: New Tab, Cmd+W: Close Tab)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 't') {
          e.preventDefault();
          createNewTab();
        } else if (e.key === 'w') {
          e.preventDefault();
          closeTab({ stopPropagation: () => { } } as React.MouseEvent, activeTabId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateTo = (newUrl: string, isRealSite: boolean = false, canEmbed: boolean = true, company: string = "", screenshot?: string, icon?: string, pushHistory: boolean = true) => {
    let nextView: Tab['view'] = 'projects';
    let nextUrl = newUrl;
    let nextIframeSrc = "";
    let nextBlockedUrl = "";
    let nextBlockedCompany = "";
    let nextTitle = company || activeTab.title;
    let nextIcon = icon || (isRealSite ? "🌐" : "📂");

    if (isRealSite) {
      const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
      nextUrl = newUrl.replace('https://', '');

      if (!canEmbed) {
        nextBlockedUrl = fullUrl;
        nextBlockedCompany = company;
        nextView = 'blocked';
      } else {
        nextIframeSrc = fullUrl;
        nextView = 'browser';
      }
    } else if (newUrl.includes('profile')) {
      nextView = 'profile';
      nextUrl = "bryanvrgsc.dev/profile";
      nextTitle = "Perfil";
      nextIcon = "👤";
    } else {
      nextView = 'experience';
      nextUrl = "bryanvrgsc.dev/portfolio";
      nextTitle = "Experiencia";
      nextIcon = icon || "💻";
    }

    const newHistory = pushHistory
      ? [...activeTab.history.slice(0, activeTab.historyIndex + 1), { view: nextView, url: nextUrl, iframeSrc: nextIframeSrc }]
      : activeTab.history;
    const nextHistoryIndex = pushHistory ? newHistory.length - 1 : activeTab.historyIndex;

    updateActiveTab({
      view: nextView,
      url: nextUrl,
      iframeSrc: nextIframeSrc,
      blockedUrl: nextBlockedUrl,
      blockedCompany: nextBlockedCompany,
      blockedScreenshot: screenshot,
      history: newHistory,
      historyIndex: nextHistoryIndex,
      title: nextTitle,
      icon: nextIcon
    });
    setInputValue(nextUrl);
  };

  const handleBack = () => {
    if (activeTab.historyIndex > 0) {
      const prev = activeTab.history[activeTab.historyIndex - 1];
      updateActiveTab({
        historyIndex: activeTab.historyIndex - 1,
        view: prev.view,
        url: prev.url,
        iframeSrc: prev.iframeSrc || ""
      });
      setInputValue(prev.url);
    }
  };

  const handleForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const next = activeTab.history[activeTab.historyIndex + 1];
      updateActiveTab({
        historyIndex: activeTab.historyIndex + 1,
        view: next.view,
        url: next.url,
        iframeSrc: next.iframeSrc || ""
      });
      setInputValue(next.url);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputValue, true);
  };

  const openInNewTab = () => {
    const url = activeTab.view === 'browser' ? activeTab.iframeSrc : activeTab.blockedUrl;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    const currentUrl = activeTab.view === 'browser' ? activeTab.iframeSrc : (activeTab.view === 'blocked' ? activeTab.blockedUrl : window.location.href);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Bryan Vargas Portfolio', url: currentUrl });
      } catch (err) {
        navigator.clipboard.writeText(currentUrl);
      }
    } else {
      navigator.clipboard.writeText(currentUrl);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-white">
      {/* Safari Modern Unified Header - Pixel Perfect Refinement */}
      <div
        onPointerDown={(e) => dragControls?.start(e)}
        className="h-[52px] shrink-0 bg-[#1c1c1e]/60 backdrop-blur-xl border-b border-white/5 flex items-center px-3 gap-2 cursor-default"
      >
        {/* Left Side: Traffic Lights Space + Sidebar Pill */}
        <div className="flex items-center gap-2">
          <div className="w-[68px]" /> {/* Space for traffic lights */}
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="flex bg-white/10 rounded-lg p-0.5 border border-white/5 items-center"
          >
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-1 px-1.5 hover:bg-white/10 rounded-md transition-colors flex items-center gap-0.5 ${isSidebarOpen ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}
            >
              <PanelLeft size={16} />
              <ChevronDown size={10} className="mt-0.5" />
            </button>
          </div>
        </div>

        {/* Navigation Pill */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="flex bg-white/10 rounded-lg p-0.5 border border-white/5 items-center"
        >
          <button
            onClick={handleBack}
            disabled={activeTab.historyIndex === 0}
            className={`p-1 px-2 rounded-l-md transition-all ${activeTab.historyIndex > 0 ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-white/10'}`}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
          <button
            onClick={handleForward}
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            className={`p-1 px-2 rounded-r-md transition-all ${activeTab.historyIndex < activeTab.history.length - 1 ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-white/10'}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Quick Actions Pill */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="flex bg-white/10 rounded-lg p-0.5 border border-white/5 items-center gap-0.5"
        >
          <button
            onClick={() => navigateTo("", false)}
            className="p-1 px-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
          >
            <Home size={16} />
          </button>
          <button
            onClick={() => alert("Informe de privacidad: No se han detectado rastreadores.")}
            className="p-1 px-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
          >
            <Shield size={16} />
          </button>
          <button
            onClick={() => { navigateTo("", false); }}
            className="p-1 px-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
          >
            <LayoutGrid size={16} />
          </button>
        </div>

        {/* Center: Search Bar Pill */}
        <div className="flex-1 flex justify-center min-w-[300px] px-2">
          <form onSubmit={handleSearch} className="w-full">
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className={`h-[32px] bg-white/10 hover:bg-white/15 transition-colors rounded-lg flex items-center px-3 gap-3 border border-white/5 text-[13px] group shadow-inner ${isReaderMode ? 'ring-1 ring-orange-500/50' : ''}`}
            >
              <AlignLeft
                size={16}
                onClick={() => setIsReaderMode(!isReaderMode)}
                className={`cursor-pointer transition-colors ${isReaderMode ? 'text-orange-400' : 'text-white/40 hover:text-white/70'}`}
              />
              <div className="flex-1 flex items-center justify-center gap-1.5">
                <span className="text-white/30 text-[10px] mt-0.5">🔒</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-transparent border-none outline-none w-full max-w-[200px] text-white/80 font-normal placeholder:text-white/30 text-center"
                  placeholder="Busca o introduce un sitio web"
                />
              </div>
              <div className="flex items-center gap-2">
                <Languages size={14} className="text-white/40 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                <RotateCw
                  size={14}
                  className="text-white/40 hover:text-white cursor-pointer"
                  onClick={() => updateActiveTab({ iframeSrc: activeTab.iframeSrc })}
                />
              </div>
            </div>
          </form>
        </div>

        {/* User/Extensions Pill */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="flex bg-white/10 rounded-lg p-0.5 border border-white/5 items-center gap-0.5"
        >
          <button className="p-1 px-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white">
            <Puzzle size={16} />
          </button>
          <button
            onClick={() => navigateTo("bryanvrgsc.dev/profile", false, true, "Perfil", undefined, "👤")}
            className={`p-1 px-1.5 hover:bg-white/10 rounded-md transition-colors ${activeTab.view === 'profile' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}
          >
            <User size={16} />
          </button>
        </div>

        {/* Typography Pill */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="flex bg-white/10 rounded-lg p-0.5 border border-white/5 items-center px-1.5 gap-2"
        >
          <button onClick={() => setFontSize(Math.max(80, fontSize - 10))} className="text-[10px] font-bold text-white/60 hover:text-white transition-colors">A</button>
          <button onClick={() => setFontSize(Math.min(150, fontSize + 10))} className="text-[13px] font-bold text-white/80 hover:text-white transition-colors">A</button>
        </div>

        {/* Share/Tabs Pill */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="flex bg-white/10 rounded-lg p-0.5 border border-white/5 items-center gap-0.5"
        >
          <button
            onClick={handleShare}
            className="p-1 px-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
          >
            <Share size={16} />
          </button>
          <button
            onClick={createNewTab}
            className="p-1 px-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setShowTabOverview(!showTabOverview)}
            className={`p-1 px-1.5 rounded-md transition-colors flex items-center gap-0.5 ${showTabOverview ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <Copy size={16} className="rotate-90 scale-x-[-1]" />
          </button>
        </div>
      </div>

      {/* Safari Tab Bar - Sequoia Style Refinement */}
      {tabs.length > 1 && !showTabOverview && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="h-[38px] bg-[#1c1c1e]/60 backdrop-blur-xl border-b border-white/5 flex items-center px-2 gap-1 overflow-x-auto no-scrollbar select-none"
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => { setActiveTabId(tab.id); setInputValue(tab.url); }}
              className={`group relative flex items-center h-[30px] px-3 transition-all cursor-default flex-1 min-w-[100px] max-w-[240px] ${activeTabId === tab.id ? 'z-10' : ''}`}
            >
              {/* Tab Background (Pill Style) */}
              <div className={`absolute inset-0 rounded-lg transition-all duration-200 ${activeTabId === tab.id
                ? 'bg-white/15 border border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.2)]'
                : 'hover:bg-white/5'
                }`} />

              <div className="relative flex items-center w-full min-w-0">
                <span className="text-[14px] mr-2 shrink-0">{tab.icon}</span>
                <span className={`text-[11px] font-medium truncate flex-1 text-center ${activeTabId === tab.id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                  {tab.title}
                </span>
                <button
                  onClick={(e) => closeTab(e, tab.id)}
                  className={`ml-2 w-4 h-4 rounded-md flex items-center justify-center hover:bg-white/20 transition-all ${activeTabId === tab.id
                    ? 'opacity-40 hover:opacity-100 text-white'
                    : 'opacity-0 group-hover:opacity-40 hover:opacity-100 text-white'
                    }`}
                >
                  <Plus size={12} className="rotate-45" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Area with Sidebar */}
      <div className="flex-1 flex relative bg-[#1e1e1e] overflow-hidden">
        {/* Tab Overview Overlay */}
        {showTabOverview && (
          <div className="absolute inset-0 z-50 bg-[#1c1c1e]/95 backdrop-blur-2xl p-10 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold">Pestañas</h2>
                <button
                  onClick={createNewTab}
                  className="bg-white/10 hover:bg-white/20 p-2 px-4 rounded-xl flex items-center gap-2 transition-colors border border-white/5"
                >
                  <Plus size={20} />
                  <span>Nueva pestaña</span>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => { setActiveTabId(tab.id); setInputValue(tab.url); setShowTabOverview(false); }}
                    className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105 ${activeTabId === tab.id ? 'ring-2 ring-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]' : 'ring-1 ring-white/10 hover:ring-white/30'}`}
                  >
                    {/* Close button */}
                    <button
                      onClick={(e) => closeTab(e, tab.id)}
                      className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus className="rotate-45" size={14} />
                    </button>

                    {/* Preview Content */}
                    <div className="w-full h-full bg-[#2c2c2e] flex flex-col">
                      <div className="flex-1 flex items-center justify-center p-4">
                        {tab.view === 'browser' || tab.view === 'blocked' ? (
                          tab.blockedScreenshot ? (
                            <img src={tab.blockedScreenshot} className="w-full h-full object-cover rounded-lg" alt="" />
                          ) : (
                            <div className="text-4xl">{tab.icon}</div>
                          )
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-5xl">{tab.icon}</div>
                            <span className="text-xs font-medium text-white/40">{tab.view === 'projects' ? 'Proyectos' : 'Experiencia'}</span>
                          </div>
                        )}
                      </div>
                      <div className="h-10 bg-white/5 flex items-center px-3 gap-2 border-t border-white/5">
                        <span className="text-xs truncate font-medium text-white/80">{tab.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`transition-all duration-300 ease-in-out border-r border-white/5 bg-[#1c1c1e] overflow-hidden ${isSidebarOpen ? 'w-[200px]' : 'w-0'}`}>
          <div className="p-4 w-[200px]">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Favoritos</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigateTo("", false)}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5 w-full text-left"
              >
                <span>📂</span> Portafolio
              </button>
              <button
                onClick={() => window.open("https://github.com/bryanvrgsc", "_blank")}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5 w-full text-left"
              >
                <span>🐙</span> GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div style={{ fontSize: `${fontSize}%` }} className={`h-full ${isReaderMode ? 'bg-[#f5f5f7] text-black transition-colors duration-500' : ''}`}>
            {activeTab.view === 'profile' && (
              <div className="h-full relative overflow-hidden bg-[#0a0c10] text-white font-sans selection:bg-orange-500/30">
                {/* Background Wireframe Mesh */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                      </pattern>
                      <radialGradient id="mouseGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(249,115,22,0.15)" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Mouse Spotlight */}
                    <motion.rect
                      width="400"
                      height="400"
                      fill="url(#mouseGradient)"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        x: spotlightX,
                        y: spotlightY
                      }}
                    />

                    <motion.path
                      d="M0,800 Q250,700 500,800 T1000,800"
                      fill="none"
                      stroke="url(#gradient-blue)"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </svg>
                </div>

                {/* 3D Floating Icons Layer */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ x: leafX, y: leafY }}
                    className="absolute bottom-[10%] right-[10%] w-24 h-24 bg-green-500/10 backdrop-blur-xl rounded-3xl border border-green-500/20 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(34,197,94,0.1)]"
                  >🍃</motion.div>
                  <motion.div
                    animate={{ y: [0, 25, 0], rotate: [0, -8, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    style={{ x: nodeX, y: nodeY }}
                    className="absolute bottom-[5%] right-[25%] w-28 h-28 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                  >
                    <div className="text-3xl font-bold flex items-baseline gap-0.5">n<span className="text-green-500 text-xs">de</span></div>
                    <div className="text-[8px] bg-green-500 px-1 rounded text-black font-bold">JS</div>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    style={{
                      x: reactX,
                      y: reactY,
                      z: 50
                    }}
                    className="absolute bottom-[10%] right-[38%] w-24 h-24 bg-cyan-500/10 backdrop-blur-xl rounded-3xl border border-cyan-500/20 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                  >⚛️</motion.div>
                  <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -12, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    style={{ x: appleX, y: appleY }}
                    className="absolute bottom-[8%] right-[50%] w-24 h-24 bg-orange-600/10 backdrop-blur-xl rounded-3xl border border-orange-500/20 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(249,115,22,0.1)]"
                  >🍎</motion.div>
                </div>

                <div className="relative z-20 flex h-full" onMouseMove={handleMouseMove}>
                  {/* High-Fidelity Sidebar */}
                  <div className="w-64 shrink-0 bg-[#0d1117]/80 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col gap-10">
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-[2px] text-white/30">Navegación</h3>
                      <nav className="flex flex-col gap-2">
                        <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-white text-sm font-semibold shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all">
                          <User size={16} className="text-orange-400" />
                          Información
                        </button>
                        <button
                          onClick={() => updateActiveTab({ view: 'experience', title: 'Experiencia', icon: '💻' })}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 text-sm font-medium hover:bg-white/5 hover:text-white transition-all"
                        >
                          <Briefcase size={16} />
                          Experiencia
                        </button>
                        <button
                          onClick={() => updateActiveTab({ view: 'projects', title: 'Proyectos', icon: '📂' })}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 text-sm font-medium hover:bg-white/5 hover:text-white transition-all"
                        >
                          <FolderCode size={16} />
                          Proyectos
                        </button>
                      </nav>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-[2px] text-white/30">Social</h3>
                      <nav className="flex flex-col gap-2">
                        {contactInfo.social.map(link => (
                          <button
                            key={link.name}
                            onClick={() => window.open(link.url, "_blank")}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 text-sm font-medium hover:bg-white/5 hover:text-white transition-all"
                          >
                            <span className="text-lg">{link.icon}</span>
                            {link.name}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 overflow-y-auto no-scrollbar p-12">
                    <div className="max-w-4xl mx-auto space-y-12">
                      {/* Orange Neon Header Card */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="relative group h-40"
                      >
                        <div className="absolute inset-0 bg-orange-500/10 rounded-3xl blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
                        <div className="relative h-full bg-[#1a1c23]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex items-center gap-8 shadow-[0_0_40px_rgba(249,115,22,0.1)]">
                          <div className="w-20 h-20 bg-white rounded-2xl p-2 flex items-center justify-center shadow-inner overflow-hidden relative">
                            <Image
                              src={profileData.logo}
                              alt="Anahuac"
                              fill
                              className="object-contain p-2"
                              sizes="80px"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1">
                            <h1 className="text-2xl font-bold tracking-tight mb-2 leading-tight">
                              <ScrambledText text={profileData.degree} delay={500} />
                            </h1>
                            <div className="flex items-center gap-2 text-white/50 text-sm">
                              <span><ScrambledText text={profileData.university} delay={1000} /></span>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span><ScrambledText text={profileData.location} delay={1500} /></span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-orange-500 font-bold text-xl mb-1">{profileData.date}</div>
                            <div className="text-white/30 text-[10px] uppercase font-bold tracking-wider">Cédula: {profileData.cedula}</div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Categorized Tech Stack */}
                      <div className="space-y-8">
                        <h2 className="text-[10px] font-bold uppercase tracking-[3px] text-white/30">Stack Tecnológico</h2>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                          {techStack.map((category, idx) => (
                            <motion.div
                              key={category.category}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + (idx * 0.1) }}
                              className="space-y-4"
                            >
                              <h4 className="text-white/60 text-xs font-semibold">{category.category}</h4>
                              <div className="flex flex-wrap gap-2">
                                {category.items.map(item => (
                                  <motion.div
                                    key={item.name}
                                    whileHover={{ scale: 1.05, borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)' }}
                                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex flex-col gap-1 cursor-default transition-all shadow-[0_1px_3px_rgba(0,0,0,0.2)] group/tag overflow-hidden relative"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/tag:translate-x-full transition-transform duration-700 pointer-events-none" />
                                    <span className="text-xs font-semibold text-white/80 group-hover/tag:text-white transition-colors relative z-10">{item.name}</span>
                                    <div className="flex gap-0.5 relative z-10">
                                      {[1, 2, 3, 4, 5].map(dot => (
                                        <div
                                          key={dot}
                                          className={`w-1 h-1 rounded-full transition-all duration-500 ${dot <= item.level ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)] scale-110' : 'bg-white/10 group-hover/tag:bg-white/20'}`}
                                        />
                                      ))}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Idiomas & Contacto Bottom Sections */}
                      <div className="grid grid-cols-2 gap-12 items-end pb-12">
                        <div className="space-y-6">
                          <h2 className="text-[10px] font-bold uppercase tracking-[3px] text-white/30">Idiomas</h2>
                          <div className="flex gap-4">
                            {languages.map(lang => (
                              <div
                                key={lang.name}
                                className={`flex items-baseline gap-2 px-6 py-4 rounded-2xl border backdrop-blur-md transition-all ${lang.name === 'Inglés' ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-white/5 border-white/10'}`}
                              >
                                <span className="text-sm font-bold">{lang.name}</span>
                                <span className="text-[10px] text-white/40 font-medium">{lang.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h2 className="text-[10px] font-bold uppercase tracking-[3px] text-white/30">Contacto</h2>
                          <div className="flex gap-4">
                            <motion.button
                              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                              onClick={() => navigator.clipboard.writeText(contactInfo.email)}
                              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all group"
                            >
                              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs group-hover:bg-orange-500 transition-colors">📧</div>
                              <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">{contactInfo.email}</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                              onClick={() => navigator.clipboard.writeText(contactInfo.phone)}
                              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all group"
                            >
                              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs group-hover:bg-orange-500 transition-colors">📱</div>
                              <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">{contactInfo.phone}</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab.view === 'projects' && (
              <div className="h-full p-10 overflow-auto">
                <div className="max-w-4xl mx-auto">
                  {/* Tabs */}
                  <div className="flex gap-4 mb-8">
                    <button
                      onClick={() => updateActiveTab({ view: 'experience', title: 'Experiencia', icon: '💻' })}
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-white/5 text-white/60 hover:bg-white/10"
                    >
                      Experiencia
                    </button>
                    <button
                      onClick={() => updateActiveTab({ view: 'projects', title: 'Proyectos', icon: '📂' })}
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    >
                      Proyectos
                    </button>
                  </div>

                  <div className="mb-8">
                    <h2 className={`text-4xl font-bold tracking-tight mb-2 ${isReaderMode ? 'text-black' : 'text-white'}`}>Proyectos</h2>
                    <p className={isReaderMode ? 'text-black/60 text-lg' : 'text-white/40 text-lg'}>Haz clic en una tarjeta para visitar el repositorio.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project: Project) => (
                      <button
                        key={project.name}
                        onClick={() => navigateTo(project.url, true, project.canEmbed, project.name, project.screenshot, project.icon)}
                        className={`group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-2xl transition-all hover:from-orange-500/20 text-left w-full ${isReaderMode ? 'from-black/10' : ''}`}
                      >
                        <div className={`h-full p-6 backdrop-blur-md rounded-[15px] border border-white/5 flex flex-col gap-4 ${isReaderMode ? 'bg-white border-black/5' : 'bg-[#2c2c2e]/80'}`}>
                          <div className="flex items-center justify-between">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                              {project.icon}
                            </div>
                            <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-white/40 font-mono">
                              github.com
                            </div>
                          </div>
                          <div>
                            <h3 className={`text-xl font-bold group-hover:text-orange-400 transition-colors mb-2 ${isReaderMode ? 'text-black' : 'text-white'}`}>{project.name}</h3>
                            <p className={`text-sm leading-relaxed mb-3 ${isReaderMode ? 'text-black/60' : 'text-white/50'}`}>{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {project.highlights.map((h: string) => (
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

            {activeTab.view === 'experience' && (
              <div className="h-full p-10 overflow-auto">
                <div className="max-w-4xl mx-auto">
                  {/* Tabs */}
                  <div className="flex gap-4 mb-8">
                    <button
                      onClick={() => updateActiveTab({ view: 'experience', title: 'Experiencia', icon: '💻' })}
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    >
                      Experiencia
                    </button>
                    <button
                      onClick={() => updateActiveTab({ view: 'projects', title: 'Proyectos', icon: '📂' })}
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-white/5 text-white/60 hover:bg-white/10"
                    >
                      Proyectos
                    </button>
                  </div>

                  <div className="mb-8">
                    <h2 className={`text-4xl font-bold tracking-tight mb-2 ${isReaderMode ? 'text-black' : 'text-white'}`}>Experiencia</h2>
                    <p className={isReaderMode ? 'text-black/60 text-lg' : 'text-white/40 text-lg'}>Haz clic en una empresa para visitar su sitio web.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {experiences.map((exp: Experience) => (
                      <button
                        key={exp.company}
                        onClick={() => navigateTo(exp.url, true, exp.canEmbed, exp.company, exp.screenshot, typeof exp.icon === 'string' ? exp.icon : undefined)}
                        className={`group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-2xl transition-all hover:from-orange-500/20 text-left w-full ${isReaderMode ? 'from-black/10' : ''}`}
                      >
                        <div className={`h-full p-6 backdrop-blur-md rounded-[15px] border border-white/5 flex flex-col items-center text-center gap-4 ${isReaderMode ? 'bg-white border-black/5 shadow-sm' : 'bg-[#2c2c2e]/80'}`}>
                          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                            {exp.icon}
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold group-hover:text-orange-400 transition-colors mb-1 ${isReaderMode ? 'text-black' : 'text-white'}`}>{exp.company}</h3>
                            <p className="text-xs text-orange-400/80 font-medium mb-2">{exp.position}</p>
                            <p className={`text-xs ${isReaderMode ? 'text-black/40' : 'text-white/40'}`}>{exp.period}</p>
                            <p className={`text-xs ${isReaderMode ? 'text-black/30' : 'text-white/30'}`}>{exp.location}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab.view === 'browser' && (
              <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
                {/* Iframe del sitio */}
                <div className="flex-1 relative overflow-hidden">
                  {iframeLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
                      <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                  {iframeError ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#1e1e1e]">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-red-500/20">
                          ⚠️
                        </div>
                        <h3 className="text-white font-semibold mb-2">Error al cargar</h3>
                        <p className="text-white/40 text-sm">No se pudo cargar el contenido</p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={isValidUrl(activeTab.iframeSrc) ? activeTab.iframeSrc : ''}
                      className="w-full h-full border-none"
                      title="Safari Browser"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      onLoad={() => setIframeLoading(false)}
                      onError={() => { setIframeLoading(false); setIframeError(true); }}
                    />
                  )}
                </div>
                {/* Barra inferior con botón */}
                {!isReaderMode && (
                  <div className="p-4 bg-[#2c2c2e] border-t border-white/10 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{activeTab.url.split('/')[0]}</h3>
                      <p className="text-white/40 text-sm">{activeTab.iframeSrc}</p>
                    </div>
                    <button
                      onClick={openInNewTab}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
                    >
                      <ExternalLink size={18} />
                      Visitar sitio
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab.view === 'blocked' && (
              <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
                {/* Screenshot del sitio */}
                <div className="flex-1 relative overflow-hidden">
                  {activeTab.blockedScreenshot ? (
                    <img
                      src={activeTab.blockedScreenshot}
                      alt={activeTab.blockedCompany}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1e1e1e] to-[#2c2c2e]">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6">
                          🔒
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{activeTab.blockedCompany}</h2>
                        <p className="text-white/60">Vista previa no disponible</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Barra inferior con botón */}
                {!isReaderMode && (
                  <div className="p-4 bg-[#2c2c2e] border-t border-white/10 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{activeTab.blockedCompany}</h3>
                      <p className="text-white/40 text-sm">{activeTab.blockedUrl}</p>
                    </div>
                    <button
                      onClick={openInNewTab}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
                    >
                      <ExternalLink size={18} />
                      Visitar sitio
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

BrowserApp.displayName = 'BrowserApp';

export default BrowserApp;
