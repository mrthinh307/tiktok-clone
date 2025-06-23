import { BlueTickIcon } from '~/assets/images/icons';
import { DEFAULT_AVATAR } from '~/constants/common';
import { useAuth } from '~/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

function SuggestedAccount({ item, hoveredItem, setHoveredItem }) {
    const { toggleLoginForm } = useAuth();
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const videoRef = useRef(null);
    const isHovered = hoveredItem === item.user_id;

    const handleMouseEnter = () => {
        setHoveredItem(item.user_id);
    };

    // Handle video play/pause and reset
    useEffect(() => {
        if (videoRef.current) {
            if (isHovered && isVideoLoaded) {
                videoRef.current.play().catch(console.error);
            } else {
                videoRef.current.pause();
            }
            videoRef.current.currentTime = 0; // Reset when paused
        }
    }, [isHovered, isVideoLoaded]);

    // Reset video loaded state when item changes
    useEffect(() => {
        if (!isHovered) {
            setIsVideoLoaded(false);
        }
    }, [isHovered]);

    const handleVideoLoaded = () => {
        setIsVideoLoaded(true);
    };

    const handleVideoError = () => {
        setIsVideoLoaded(false);
        console.warn('Failed to load video for user:', item.user_info.nickname);
    };

    return (
        <div
            className="w-[226px] h-[302px] rounded-[8px] mb-[18px] mr-[18px] block"
            onMouseEnter={handleMouseEnter}
        >
            <a
                href={`/user/${item.user_info.nickname}`}
                rel="noopener noreferrer"
                target="_blank"
                className="w-full h-full block relative"
            >
                <div className="w-full h-full overflow-hidden relative bg-[rgb(241, 241, 241)] bg-cover bg-no-repeat bg-center rounded-[8px] flex items-center justify-center">
                    {/* Video - only show when hovered */}
                    {isHovered && (
                        <video
                            ref={videoRef}
                            src={item.file_url}
                            className="w-full h-full absolute top-0 left-0 object-cover"
                            muted
                            loop
                            preload="metadata"
                            onLoadedData={handleVideoLoaded}
                            onError={handleVideoError}
                        />
                    )}
                    {/* Thumbnail image - always present */}
                    <img
                        src={item.thumb_url}
                        alt="thumbnail"
                        className={`w-full h-full relative object-cover ${
                            isHovered && isVideoLoaded
                                ? 'opacity-0'
                                : 'opacity-100'
                        }`}
                    />
                </div>
                <div className="flex flex-col items-center justify-center absolute bottom-0 w-full height-[200px] pt-[30px] px-[12px] pb-[20px] text-center">
                    <div className="w-[48px] h-[48px] mb-[14px] flex-shrink-0 rounded-full overflow-hidden">
                        <img
                            src={item.user_info.avatar_url || DEFAULT_AVATAR}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="text-[1.8rem] text-white font-black leading-[24px] w-full mx-0 my-0 text-center overflow-hidden text-ellipsis">
                        {item.user_info.fullName || ''}
                    </h3>
                    <div className="flex items-center justify-center mx-0 my-0 max-w-full overflow-hidden">
                        <h4 className="text-[1.4rem] font-bold text-white">
                            @{item.user_info.nickname}
                        </h4>
                        {item.user_info.tick && (
                            <BlueTickIcon className="inline-block ml-[4px] w-[14px] h-[14px]" />
                        )}
                    </div>
                    <button
                        className="mt-[12px] border-none text-white bg-[#fe2c55] min-w-[164px] min-h-[36px] text-[1.8rem] leading-[25px] rounded-[4px] font-bold flex items-center justify-center cursor-pointer px-[8px] py-[6px] user-select-none hover:bg-[#f01a4d] active:bg-[#e0194b] transition-colors duration-200"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleLoginForm();
                        }}
                    >
                        Follow
                    </button>
                </div>
            </a>
        </div>
    );
}

export default SuggestedAccount;
