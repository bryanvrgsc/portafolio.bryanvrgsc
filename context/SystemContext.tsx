"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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

    // Load from localStorage on mount
    useEffect(() => {
        const savedBrightness = localStorage.getItem('system_brightness');
        const savedVolume = localStorage.getItem('system_volume');

        if (savedBrightness) setBrightnessState(parseInt(savedBrightness));
        if (savedVolume) setVolumeState(parseInt(savedVolume));
    }, []);

    const setBrightness = (value: number) => {
        setBrightnessState(value);
        localStorage.setItem('system_brightness', value.toString());
    };

    const setVolume = (value: number) => {
        setVolumeState(value);
        localStorage.setItem('system_volume', value.toString());
    };

    return (
        <SystemContext.Provider value={{ brightness, setBrightness, volume, setVolume }}>
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
