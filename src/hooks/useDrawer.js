import { useState, useEffect, useRef } from 'react';

export default function useDrawer(isCollapsed, { 
    animationDuration = 400, 
    animationDelay = 50,
    className = '' 
} = {}) {
    // State để kiểm soát việc hiển thị drawer
    const [showDrawer, setShowDrawer] = useState(false);
    
    // Ref cho drawer element
    const drawerRef = useRef(null);
    
    // Xử lý hiệu ứng animation dựa trên isCollapsed
    useEffect(() => {
        let showTimer, hideTimer;
        
        if (isCollapsed) {
            // Khi sidebar thu gọn, hiển thị drawer
            setShowDrawer(true);
            
            // Chờ DOM cập nhật rồi thêm class show cho animation
            showTimer = setTimeout(() => {
                if (drawerRef.current) {
                    drawerRef.current.classList.add(className);
                }
            }, animationDelay);
        } else {
            // Khi sidebar mở rộng, ẩn drawer với animation
            if (drawerRef.current) {
                drawerRef.current.classList.remove(className);
                
                // Chờ animation hoàn thành rồi unmount
                hideTimer = setTimeout(() => {
                    setShowDrawer(false);
                }, animationDuration);
            } else {
                setShowDrawer(false);
            }
        }
        
        // Cleanup timers khi unmount hoặc deps thay đổi
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [isCollapsed, className, animationDuration, animationDelay]);
    
    return {
        showDrawer,       // Boolean: có hiển thị drawer không
        drawerRef,        // Ref để gắn vào element
        setShowDrawer     // Function: để set state nếu cần
    };
}