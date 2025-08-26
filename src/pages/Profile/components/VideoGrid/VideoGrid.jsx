import { memo } from 'react';
import cx from 'clsx';
import styles from './VideoGrid.module.scss';
import VideoItem from '../VideoItem';

function VideoGrid({ 
  videos, 
  loading, 
  hoveredVideo, 
  setHoveredVideo, 
  EmptyComponent,
  skeletonCount = 6 
}) {
  // Show loading skeleton while fetching data
  if (loading) {
    return (
      <div className={cx(styles['videos-grid'])}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className={cx(styles['video-item'])}>
            <div className={cx(styles['video-thumbnail'], styles['skeleton'])} />
          </div>
        ))}
      </div>
    );
  }

  // Show video grid if there are videos after loading is complete
  if (!loading && videos.length > 0) {
    return (
      <div 
        className={cx(styles['videos-grid'])}
        onMouseLeave={() => setHoveredVideo(null)}
      >
        {videos.map((video) => (
          <VideoItem 
            key={video.id} 
            video={video} 
            hoveredVideo={hoveredVideo}
            setHoveredVideo={setHoveredVideo}
          />
        ))}
      </div>
    );
  }

  // Only show empty component if loading is complete and no videos found
  if (!loading && videos.length === 0 && EmptyComponent) {
    return <EmptyComponent />;
  }

  // Fallback: show nothing if no EmptyComponent provided
  return null;
}

export default memo(VideoGrid);
