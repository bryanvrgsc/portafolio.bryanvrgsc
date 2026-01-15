"use client";

import { useState, useEffect } from 'react';

export interface VFile {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'app';
  icon?: string;
  parentId: string | null; // null significa escritorio
  content?: string;
  isProtected?: boolean;
}

export const useFileSystem = () => {
  const [fs, setFs] = useState<VFile[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('macos_vfs');
    if (saved) {
      // Usar un pequeño timeout para evitar el error de renderizado en cascada sincrónico
      setTimeout(() => setFs(JSON.parse(saved)), 0);
    } else {
      const initial: VFile[] = [
        { id: 'about-me', name: 'Sobre Mí', type: 'folder', parentId: null, isProtected: true },
        { id: 'projects', name: 'Proyectos', type: 'folder', parentId: null, isProtected: true },
        { id: 'experience', name: 'Experiencia', type: 'folder', parentId: null, isProtected: true },
        { id: 'skills', name: 'Habilidades', type: 'folder', parentId: null, isProtected: true },
        { id: 'contact', name: 'Contacto', type: 'folder', parentId: null, isProtected: true },
      ];
      setTimeout(() => setFs(initial), 0);
      localStorage.setItem('macos_vfs', JSON.stringify(initial));
    }
  }, []);

  const save = (newFs: VFile[]) => {
    setFs(newFs);
    localStorage.setItem('macos_vfs', JSON.stringify(newFs));
  };

  const addFolder = (parentId: string | null) => {
    const newFolder: VFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Nueva Carpeta',
      type: 'folder',
      parentId
    };
    save([...fs, newFolder]);
  };

  const renameFile = (id: string, newName: string) => {
    const file = fs.find(f => f.id === id);
    if (file?.isProtected) return;
    save(fs.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const deleteFile = (id: string) => {
    const file = fs.find(f => f.id === id);
    if (file?.isProtected) return;
    save(fs.filter(f => f.id !== id));
  };

  return { fs, addFolder, renameFile, deleteFile };
};
