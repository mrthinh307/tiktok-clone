import { useState, useEffect, useRef } from 'react';

export default function useDrawer(isCollapsed, options = {}) {
    const {
        className = '',
        animationDuration = 400,
        animationDelay = 50
    } = options;
    
    const [showDrawer, setShowDrawer] = useState(false);
    const drawerRef = useRef(null);
    
    useEffect(() => {
        let showTimer, hideTimer;
        
        if (isCollapsed) {
            setShowDrawer(true);
            
            showTimer = setTimeout(() => {
                if (drawerRef.current) {
                    drawerRef.current.classList.add(className);
                }
            }, animationDelay);
        } else {
            if (drawerRef.current) {
                drawerRef.current.classList.remove(className);
                
                hideTimer = setTimeout(() => {
                    setShowDrawer(false);
                }, animationDuration);
            } else {
                setShowDrawer(false);
            }
        }
        
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [isCollapsed, className, animationDuration, animationDelay]);
    
    return {
        showDrawer,
        drawerRef,
        setShowDrawer
    };
}