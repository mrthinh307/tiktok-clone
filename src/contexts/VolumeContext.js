import React, { createContext, useState, useEffect, useCallback } from 'react';

const VolumeContext = createContext();

export const VolumeProvider = ({ children }) => {
    const [isGloballyMuted, setIsGloballyMuted] = useState(() => {
        const savedPreference = localStorage.getItem('tiktok-sound-preference');
        // Default to muted if no preference is saved
        return savedPreference ? savedPreference === 'muted' : true;
    });

    useEffect(() => {
        localStorage.setItem(
            'tiktok-sound-preference',
            isGloballyMuted ? 'muted' : 'unmuted',
        );
    }, [isGloballyMuted]);

    const toggleGlobalMute = useCallback(() => {
        setIsGloballyMuted(prevMuted => !prevMuted);
    }, []);

    return (
        <VolumeContext.Provider value={{ isGloballyMuted, toggleGlobalMute }}>
            {children}
        </VolumeContext.Provider>
    );
};

export const useVolume = () => {
    const context = React.useContext(VolumeContext);
    if (context === undefined) {
        throw new Error('useVolume must be used within a VolumeProvider');
    }
    return context;
};