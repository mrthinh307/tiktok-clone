import { useState, useCallback } from 'react';

export default function useFlashAnimation(duration = 200) {
    const [isFlashing, setIsFlashing] = useState(false);
    
    const triggerFlash = useCallback(() => {
        setIsFlashing(true);
        const timer = setTimeout(() => {
            setIsFlashing(false);
        }, duration);
        
        return () => clearTimeout(timer);
    }, [duration]);
    
    return [isFlashing, triggerFlash];
}