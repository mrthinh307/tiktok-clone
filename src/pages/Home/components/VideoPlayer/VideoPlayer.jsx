import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './VideoPlayer.module.scss';
import useVideoControl from '~/hooks/useVideoControl';
import VideoActions from '../VideoActions';
import { VideoControls, VideoInfo } from './components';

const cx = classNames.bind(styles);

function VideoPlayer({ video, onNext, onPrev, hasNext, hasPrev }) {
    const [expandedDescription, setExpandedDescription] = useState(false);

    // Use custom hook to manage video controls
    const {
        videoRef,
        videoLoaded,
        isPlaying,
        isMuted,
        progress,
        showPlayPauseOverlay,
        isAutoScrollEnabled,
        togglePlay,
        toggleMute,
    } = useVideoControl({
        videoId: video.id,
        hasNext,
        onNext,
    });

    const toggleDescription = useCallback((e) => {
        if (e) e.stopPropagation();
        setExpandedDescription((prev) => !prev);
    }, []);

    return (
        <div className={cx('wrapper')}>
            {/* Video Player */}
            <div className={cx('container')}>
                <div className={cx('video-player')} onClick={togglePlay}>
                    {!videoLoaded && (
                        <div className={cx('video-skeleton')}>
                            <div className={cx('skeleton-poster')} 
                                 style={{ backgroundImage: `url(${video.video.cover})` }}>
                                <div className={cx('skeleton-overlay')}></div>
                            </div>
                        </div>
                    )}
                    
                    <video
                        ref={videoRef}
                        src={video.video.playAddr}
                        poster={video.video.cover}
                        loop={!isAutoScrollEnabled}
                        playsInline
                        className={cx('video', { 'video-hidden': !videoLoaded })}
                    />

                    {/* Video Controls (Play/Pause overlay, Progress bar, Sound Button) */}
                    {videoLoaded && (
                        <VideoControls
                            isPlaying={isPlaying}
                            isMuted={isMuted}
                            progress={progress}
                            showPlayPauseOverlay={showPlayPauseOverlay}
                            toggleMute={toggleMute}
                        />
                    )}

                    {/* Video Info (User info and description) */}
                    <VideoInfo
                        video={video}
                        expandedDescription={expandedDescription}
                        toggleDescription={toggleDescription}
                    />
                </div>
                <VideoActions video={video} />
            </div>
        </div>
    );
}

VideoPlayer.propTypes = {
    video: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    hasNext: PropTypes.bool.isRequired,
    hasPrev: PropTypes.bool.isRequired,
};

export default memo(VideoPlayer);