"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Appearance, resolveTahoeAppearance, TAHOE_APPEARANCE_QUERY } from '@/lib/tahoe-theme';

interface SystemContextType {
  appearance: Appearance;
  brightness: number;
  setBrightness: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appearance, setAppearance] = useState<Appearance>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    return resolveTahoeAppearance(window.matchMedia(TAHOE_APPEARANCE_QUERY).matches);
  });
  const [brightness, setBrightnessState] = useState(() => {
    if (typeof window === 'undefined') {
      return 100;
    }

    const savedBrightness = localStorage.getItem('system_brightness');
    return savedBrightness ? parseInt(savedBrightness, 10) : 100;
  });
  const [volume, setVolumeState] = useState(() => {
    if (typeof window === 'undefined') {
      return 50;
    }

    const savedVolume = localStorage.getItem('system_volume');
    return savedVolume ? parseInt(savedVolume, 10) : 50;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(TAHOE_APPEARANCE_QUERY);
    const syncAppearance = (matches: boolean) => setAppearance(resolveTahoeAppearance(matches));
    const handleAppearanceChange = (event: MediaQueryListEvent) => syncAppearance(event.matches);

    mediaQuery.addEventListener('change', handleAppearanceChange);

    return () => {
      mediaQuery.removeEventListener('change', handleAppearanceChange);
    };
  }, []);

  const setBrightness = useCallback((value: number) => {
    setBrightnessState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('system_brightness', value.toString());
    }
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('system_volume', value.toString());
    }
  }, []);

  const value = useMemo(() => ({
    appearance,
    brightness,
    setBrightness,
    volume,
    setVolume,
  }), [appearance, brightness, setBrightness, volume, setVolume]);

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (context === undefined) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
};
