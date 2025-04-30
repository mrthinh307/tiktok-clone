import { createContext, useState, useContext, useEffect } from 'react';

const AutoScrollContext = createContext();

export const AutoScrollProvider = ({ children }) => {
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(() => {
        // Get the initial state from localStorage
        const savedState = localStorage.getItem('autoscroll');
        return savedState ? JSON.parse(savedState) : false;
    });

    useEffect(() => {
        localStorage.setItem('autoscroll', JSON.stringify(isAutoScrollEnabled));
    }, [isAutoScrollEnabled]);

    const toggleAutoScroll = () => {
        setIsAutoScrollEnabled(prev => !prev);
    };

    return (
        <AutoScrollContext.Provider value={{ isAutoScrollEnabled, toggleAutoScroll }}>
            {children}
        </AutoScrollContext.Provider>
    );
};

export const useAutoScroll = () => useContext(AutoScrollContext);