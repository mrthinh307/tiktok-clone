import { useState, useRef, useEffect, memo } from 'react';
import cx from 'clsx';
import styles from './VideoItem.module.scss';
import { PlayOutlineIcon } from '~/assets/images/icons';
import { formatViews } from '~/utils/formatUtils';

function VideoItem({ video, hoveredVideo, setHoveredVideo }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const isHovered = hoveredVideo === video.id;

  const handleMouseEnter = () => {
    setHoveredVideo(video.id);
  };

  // Handle video play/pause and reset
  useEffect(() => {
    if (videoRef.current) {
      if (isHovered && isVideoLoaded) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
      videoRef.current.currentTime = 0;
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
    console.warn('Failed to load video for video ID:', video.id);
  };

  return (
    <div 
      className={cx(styles['video-item'])}
      onMouseEnter={handleMouseEnter}
    >
      {/* Video - only show when hovered */}
      {isHovered && video.file_url && (
        <video
          ref={videoRef}
          src={video.file_url}
          className={cx(styles['video-thumbnail'], {
            [styles['video-playing']]: isVideoLoaded
          })}
          muted
          loop
          preload="metadata"
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            zIndex: isVideoLoaded ? 2 : 1,
            opacity: isVideoLoaded ? 1 : 0
          }}
        />
      )}
      {/* Thumbnail image - always present */}
      <img
        src={video.thumb_url || 'https://via.placeholder.com/300x400?text=No+Thumbnail'}
        alt={video.description || 'Video thumbnail'}
        className={cx(styles['video-thumbnail'])}
      />
      <div className={cx(styles['video-overlay'])}>
        <div className={cx(styles['video-stats'])}>
          <div className={cx(styles['video-stat-item'])}>
            <PlayOutlineIcon />
            <span>{formatViews(video.views_count)}</span>
          </div>
        </div>
      </div>
      {/* You can add pinned logic based on your database schema */}
    </div>
  );
}

// Sử dụng memo để tối ưu performance vì:
// 1. Component này được render trong list với nhiều items
// 2. Nhận props video object phức tạp
// 3. Có internal state cho video loading và playback
// 4. Hover state có thể thay đổi thường xuyên
export default memo(VideoItem);
