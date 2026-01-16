"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

interface SystemContextType {
    brightness: number;
    setBrightness: (value: number) => void;
    volume: number;
    setVolume: (value: number) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [brightness, setBrightnessState] = useState(100);
    const [volume, setVolumeState] = useState(50);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount (solo una vez)
    useEffect(() => {
        const savedBrightness = localStorage.getItem('system_brightness');
        const savedVolume = localStorage.getItem('system_volume');

        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (savedBrightness) setBrightnessState(parseInt(savedBrightness));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (savedVolume) setVolumeState(parseInt(savedVolume));
        setIsInitialized(true);
    }, []);

    const setBrightness = useCallback((value: number) => {
        setBrightnessState(value);
        if (isInitialized) {
            localStorage.setItem('system_brightness', value.toString());
        }
    }, [isInitialized]);

    const setVolume = useCallback((value: number) => {
        setVolumeState(value);
        if (isInitialized) {
            localStorage.setItem('system_volume', value.toString());
        }
    }, [isInitialized]);

    const value = useMemo(() => ({
        brightness,
        setBrightness,
        volume,
        setVolume
    }), [brightness, setBrightness, volume, setVolume]);

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
