import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook để xử lý điều hướng bằng cuộn chuột/trackpad
 * @param {Object} props - Các props cấu hình
 * @param {Function} props.onNavigateNext - Hàm callback khi di chuyển đến video tiếp theo
 * @param {Function} props.onNavigatePrev - Hàm callback khi di chuyển đến video trước
 * @param {boolean} props.isEnabled - Có kích hoạt wheel navigation hay không
 * @param {boolean} props.canNavigateNext - Có thể di chuyển đến video tiếp theo không
 * @param {boolean} props.canNavigatePrev - Có thể di chuyển đến video trước không
 * @param {number} props.debounceTime - Thời gian debounce giữa các sự kiện cuộn (ms)
 * @param {number} props.deltaThreshold - Ngưỡng delta để xác định cuộn
 * @param {array} props.dependencyList - Danh sách phụ thuộc để useEffect chạy lại
 */
function useWheelNavigation({
    onNavigateNext,
    onNavigatePrev,
    isEnabled = true,
    canNavigateNext = true,
    canNavigatePrev = true,
    debounceTime = 50,
    deltaThreshold = 20,
    dependencyList = [],
}) {
    const scrollTimeoutRef = useRef(null);

    const handleScroll = useCallback(
        (event) => {
            if (!isEnabled) return;

            // Clear any pending scroll timeouts
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Debounce scroll events to prevent rapid firing
            scrollTimeoutRef.current = setTimeout(() => {
                const delta = event.deltaY;
                if (delta > deltaThreshold && canNavigateNext) {
                    // Scroll down - next video
                    onNavigateNext();
                } else if (delta < -deltaThreshold && canNavigatePrev) {
                    // Scroll up - previous video
                    onNavigatePrev();
                }
            }, debounceTime);
        },
        [
            isEnabled,
            canNavigateNext,
            canNavigatePrev,
            onNavigateNext,
            onNavigatePrev,
            debounceTime,
            deltaThreshold,
        ],
    );

    useEffect(() => {
        window.addEventListener('wheel', handleScroll, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleScroll, ...dependencyList]);

    return {
        cleanup: () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        },
    };
}

export default useWheelNavigation;
