"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface VFile {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'app';
  icon?: string;
  parentId: string | null; // null significa escritorio
  content?: string;
  isProtected?: boolean;
  isHiddenFromDesktop?: boolean;
}

interface FileSystemContextType {
  fs: VFile[];
  addFolder: (parentId: string | null) => void;
  renameFile: (id: string, newName: string) => void;
  deleteFile: (id: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

const getInitialFiles = (): VFile[] => [
  // Root Folders (Visible on Desktop)
  { id: 'projects', name: 'Proyectos', type: 'folder', parentId: null, isProtected: true },
  
  // Hidden System Folders (Only in Finder)
  { id: 'documents', name: 'Documentos', type: 'folder', parentId: null, isProtected: true, isHiddenFromDesktop: true },
  { id: 'downloads', name: 'Descargas', type: 'folder', parentId: null, isProtected: true, isHiddenFromDesktop: true },
  { id: 'images', name: 'Imágenes', type: 'folder', parentId: null, isProtected: true, isHiddenFromDesktop: true },
  
  // Files in Root (Visible on Desktop)
  { id: 'cv', name: 'CV_Bryan_Vargas.pdf', type: 'file', parentId: null, isProtected: true },

  // Files in Proyectos
  { id: 'p1', name: 'Portfolio.tsx', type: 'file', parentId: 'projects' },
  { id: 'p2', name: 'E-commerce', type: 'folder', parentId: 'projects' },
  { id: 'p3', name: 'Dashboard', type: 'folder', parentId: 'projects' },
];

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
      return false;
    }
  }
};

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fs, setFs] = useState<VFile[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = safeLocalStorage.getItem('macos_vfs_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setFs(parsed), 0);
      } catch (error) {
        console.warn('Failed to parse VFS from localStorage:', error);
        setTimeout(() => setFs(getInitialFiles()), 0);
      }
    } else {
      const initial = getInitialFiles();
      setTimeout(() => setFs(initial), 0);
      safeLocalStorage.setItem('macos_vfs_v4', JSON.stringify(initial));
    }
  }, []);

  const save = useCallback((newFs: VFile[]) => {
    setFs(newFs);
    safeLocalStorage.setItem('macos_vfs_v4', JSON.stringify(newFs));
  }, []);

  const addFolder = useCallback((parentId: string | null) => {
    const newFolder: VFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Nueva Carpeta',
      type: 'folder',
      parentId
    };
    save([...fs, newFolder]);
  }, [fs, save]);

  const renameFile = useCallback((id: string, newName: string) => {
    const file = fs.find(f => f.id === id);
    if (file?.isProtected) return;
    save(fs.map(f => f.id === id ? { ...f, name: newName } : f));
  }, [fs, save]);

  const deleteFile = useCallback((id: string) => {
    const file = fs.find(f => f.id === id);
    if (file?.isProtected) return;
    save(fs.filter(f => f.id !== id));
  }, [fs, save]);

  return (
    <FileSystemContext.Provider value={{ fs, addFolder, renameFile, deleteFile }}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};
