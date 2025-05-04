import { useRef, useState, useCallback } from 'react';
import useKeyboardNavigation from './useKeyboardNavigation';
import useWheelNavigation from './useWheelNavigation';
import useNavigationIndicator from './useNavigationIndicator';
import useVideoTransition from './useVideoTransition';

/**
 * Hook tổng hợp để xử lý tất cả logic điều hướng video
 * @param {Object} props - Các props cấu hình
 * @param {number} props.initialIndex - Chỉ số video ban đầu
 * @param {number} props.totalItems - Tổng số video
 * @param {boolean} props.isEnabled - Có kích hoạt navigation hay không
 * @param {number} props.transitionDuration - Thời gian transition (ms)
 * @param {number} props.indicatorDuration - Thời gian hiển thị indicator (ms)
 * @param {Object} props.containerRef - Ref đến container để áp dụng class CSS
 * @param {Function} props.onIndexChange - Callback khi index thay đổi
 * @param {Function} props.classNameFormatter - Function để format class names (optional)
 */
function useVideoNavigation({
    initialIndex = 0,
    totalItems = 0,
    isEnabled = true,
    transitionDuration = 200,
    indicatorDuration = 500,
    containerRef,
    onIndexChange,
    classNameFormatter,
}) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Define className binding function
    const cx = useRef(classNameFormatter || ((name) => name)).current;

    // Navigation indicator hook
    const {
        showNavigationIndicator,
        transitionDirection,
        showNavigationCue,
    } = useNavigationIndicator(indicatorDuration);

    // Transition class management
    const applyTransitionClass = useCallback(
        (direction) => {
            if (containerRef.current) {
                containerRef.current.classList.add(cx('transitioning'));
                containerRef.current.classList.add(
                    cx(`transitioning-${direction}`),
                );
            }
        },
        [containerRef, cx],
    );

    const removeTransitionClass = useCallback(
        (direction) => {
            if (containerRef.current) {
                containerRef.current.classList.remove(cx('transitioning'));
                containerRef.current.classList.remove(
                    cx(`transitioning-${direction}`),
                );
            }
        },
        [containerRef, cx],
    );

    // Video transition hook
    const {
        isTransitioning,
        direction: transitioningDirection,
        handleTransition,
    } = useVideoTransition({
        onTransitionStart: (direction) => {
            showNavigationCue(direction);
        },
        onTransitionComplete: (index) => {
            setCurrentIndex(index);
            if (onIndexChange) onIndexChange(index);
        },
        transitionDuration,
        cleanupDelay: 50,
        applyTransitionClass,
        removeTransitionClass,
    });

    // Navigation actions
    const canNavigateNext = currentIndex < totalItems - 1;
    const canNavigatePrev = currentIndex > 0;

    // Shared navigation functions
    const navigateToNext = useCallback(() => {
        if (canNavigateNext && !isTransitioning) {
            handleTransition(currentIndex + 1, currentIndex, 'next');
            return true;
        }
        return false;
    }, [canNavigateNext, isTransitioning, handleTransition, currentIndex]);

    const navigateToPrev = useCallback(() => {
        if (canNavigatePrev && !isTransitioning) {
            handleTransition(currentIndex - 1, currentIndex, 'prev');
            return true;
        }
        return false;
    }, [canNavigatePrev, isTransitioning, handleTransition, currentIndex]);

    const navigateTo = useCallback(
        (index) => {
            if (index === currentIndex || isTransitioning) return false;
            if (index >= 0 && index < totalItems) {
                const direction = index > currentIndex ? 'next' : 'prev';
                return handleTransition(index, currentIndex, direction);
            }
            return false;
        },
        [currentIndex, isTransitioning, totalItems, handleTransition],
    );

    // Register keyboard navigation
    useKeyboardNavigation({
        onNavigateNext: navigateToNext,
        onNavigatePrev: navigateToPrev,
        isEnabled: isEnabled && !isTransitioning,
        canNavigateNext,
        canNavigatePrev,
        dependencyList: [currentIndex, totalItems, isTransitioning],
    });

    // Register wheel navigation
    const { cleanup: cleanupWheel } = useWheelNavigation({
        onNavigateNext: navigateToNext,
        onNavigatePrev: navigateToPrev,
        isEnabled: isEnabled && !isTransitioning,
        canNavigateNext,
        canNavigatePrev,
        dependencyList: [currentIndex, totalItems, isTransitioning],
    });

    // Cleanup function for all event handlers
    const cleanup = useCallback(() => {
        cleanupWheel();
    }, [cleanupWheel]);

    return {
        currentIndex,
        isTransitioning,
        transitionDirection: transitioningDirection || transitionDirection,
        showNavigationIndicator,
        navigateToNext,
        navigateToPrev,
        navigateTo,
        cleanup,
    };
}

export default useVideoNavigation;
