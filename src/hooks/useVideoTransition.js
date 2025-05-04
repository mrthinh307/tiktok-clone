import { useState, useCallback } from 'react';

/**
 * Hook để quản lý hiệu ứng chuyển đổi giữa các video
 * @param {Object} props - Các props cấu hình
 * @param {Function} props.onTransitionStart - Callback khi transition bắt đầu
 * @param {Function} props.onTransitionComplete - Callback khi transition hoàn thành
 * @param {number} props.transitionDuration - Thời gian transition (ms)
 * @param {number} props.cleanupDelay - Thời gian trễ để dọn dẹp sau transition (ms)
 * @param {Function} props.applyTransitionClass - Hàm để áp dụng class CSS cho transition
 * @param {Function} props.removeTransitionClass - Hàm để loại bỏ class CSS transition
 */
function useVideoTransition({
    onTransitionStart = () => {},
    onTransitionComplete = () => {},
    transitionDuration = 200,
    cleanupDelay = 50,
    applyTransitionClass,
    removeTransitionClass,
}) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState(null);

    // Xử lý transition với direction cụ thể
    const handleTransition = useCallback(
        (newIndex, currentIndex, direction = null) => {
            if (isTransitioning) return false;

            // Xác định hướng nếu không được cung cấp
            const actualDirection =
                direction || (newIndex > currentIndex ? 'next' : 'prev');

            setIsTransitioning(true);
            setDirection(actualDirection);

            // Gọi callback khi bắt đầu transition
            onTransitionStart(actualDirection);

            // Áp dụng class CSS nếu có
            if (typeof applyTransitionClass === 'function') {
                applyTransitionClass(actualDirection);
            }

            // Đặt hẹn giờ để hoàn tất transition
            setTimeout(() => {
                // Cập nhật index xong
                onTransitionComplete(newIndex);

                // Sau khi cập nhật, xóa class transition
                setTimeout(() => {
                    if (typeof removeTransitionClass === 'function') {
                        removeTransitionClass(actualDirection);
                    }
                    setIsTransitioning(false);
                    setDirection(null);
                }, cleanupDelay);
            }, transitionDuration);

            return true;
        },
        [
            isTransitioning,
            onTransitionStart,
            onTransitionComplete,
            applyTransitionClass,
            removeTransitionClass,
            transitionDuration,
            cleanupDelay,
        ],
    );

    return {
        isTransitioning,
        direction,
        handleTransition,
    };
}

export default useVideoTransition;
