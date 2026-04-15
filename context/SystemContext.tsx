"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Appearance,
  ThemeMode,
  getNextThemeMode,
  resolveAppearanceForThemeMode,
  resolveStoredThemeMode,
  SYSTEM_THEME_MODE_STORAGE_KEY,
  TAHOE_APPEARANCE_QUERY,
} from '@/lib/tahoe-theme';

interface SystemContextType {
  appearance: Appearance;
  themeMode: ThemeMode;
  setThemeMode: (value: ThemeMode) => void;
  cycleThemeMode: () => void;
  brightness: number;
  setBrightness: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getSystemPreference = () => {
    if (typeof window === 'undefined') {
      return true;
    }

    return window.matchMedia(TAHOE_APPEARANCE_QUERY).matches;
  };

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }

    return resolveStoredThemeMode(localStorage.getItem(SYSTEM_THEME_MODE_STORAGE_KEY));
  });
  const [prefersDark, setPrefersDark] = useState<boolean>(getSystemPreference);
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
    const syncPreference = (matches: boolean) => setPrefersDark(matches);
    const handleAppearanceChange = (event: MediaQueryListEvent) => syncPreference(event.matches);

    syncPreference(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleAppearanceChange);

    return () => {
      mediaQuery.removeEventListener('change', handleAppearanceChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SYSTEM_THEME_MODE_STORAGE_KEY, themeMode);
    }
  }, [themeMode]);

  const setThemeMode = useCallback((value: ThemeMode) => {
    setThemeModeState(value);
  }, []);

  const cycleThemeMode = useCallback(() => {
    setThemeModeState((currentMode) => getNextThemeMode(currentMode));
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

  const appearance = useMemo(
    () => resolveAppearanceForThemeMode(themeMode, prefersDark),
    [themeMode, prefersDark]
  );

  const value = useMemo(() => ({
    appearance,
    themeMode,
    setThemeMode,
    cycleThemeMode,
    brightness,
    setBrightness,
    volume,
    setVolume,
  }), [appearance, themeMode, setThemeMode, cycleThemeMode, brightness, setBrightness, volume, setVolume]);

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
