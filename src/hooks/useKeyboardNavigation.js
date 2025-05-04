import { useEffect, useCallback } from 'react';

/**
 * Hook để xử lý điều hướng bằng bàn phím
 * @param {Object} props - Các props cấu hình
 * @param {Function} props.onNavigateNext - Hàm callback khi di chuyển đến video tiếp theo
 * @param {Function} props.onNavigatePrev - Hàm callback khi di chuyển đến video trước
 * @param {boolean} props.isEnabled - Có kích hoạt keyboard navigation hay không
 * @param {boolean} props.canNavigateNext - Có thể di chuyển đến video tiếp theo không
 * @param {boolean} props.canNavigatePrev - Có thể di chuyển đến video trước không
 * @param {array} props.dependencyList - Danh sách phụ thuộc để useEffect chạy lại
 */
function useKeyboardNavigation({
    onNavigateNext,
    onNavigatePrev,
    isEnabled = true,
    canNavigateNext = true,
    canNavigatePrev = true,
    dependencyList = [],
}) {
    const handleKeyDown = useCallback(
        (event) => {
            if (!isEnabled) return;

            // Prevent default behavior for arrow keys
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
            }

            switch (event.key) {
                case 'ArrowUp':
                    if (canNavigatePrev) {
                        onNavigatePrev();
                    }
                    break;
                case 'ArrowDown':
                    if (canNavigateNext) {
                        onNavigateNext();
                    }
                    break;
                default:
                    break;
            }
        },
        [
            isEnabled,
            canNavigateNext,
            canNavigatePrev,
            onNavigateNext,
            onNavigatePrev,
        ],
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleKeyDown, ...dependencyList]);
}

export default useKeyboardNavigation;
