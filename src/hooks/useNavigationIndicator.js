import { useState, useRef, useCallback } from 'react';

/**
 * Hook để quản lý hiển thị chỉ báo navigation (mũi tên chỉ hướng)
 * @param {number} duration - Thời gian hiển thị indicator (ms)
 */
function useNavigationIndicator(duration = 500) {
  const [showNavigationIndicator, setShowNavigationIndicator] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState(null);

  const navigationTimeoutRef = useRef(null);

  const showNavigationCue = useCallback(
    (direction) => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      setTransitionDirection(direction);
      setShowNavigationIndicator(true);

      navigationTimeoutRef.current = setTimeout(() => {
        setShowNavigationIndicator(false);
      }, duration);
    },
    [duration],
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
  }, []);

  return {
    showNavigationIndicator,
    transitionDirection,
    showNavigationCue,
    cleanup,
  };
}

export default useNavigationIndicator;
