import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './VideoPlayer.module.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShare,
    faCommentDots,
    faPause,
    faPlay,
    faChevronUp,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import {
    BlueTickIcon,
    BookmarkIcon,
    EllipsisIcon,
    MuteVolumeIcon,
    PlusIcon,
    TickFollowIcon,
    TymIcon,
    UnmuteVolumeIcon,
} from '~/assets/images/icons';
import Menu from '~/components/Popper/Menu';
import {
    ELLIPSIS_OPTIONS,
    ELLIPSIS_POPPER_PROPS,
} from '~/constants/videoConstant';

const cx = classNames.bind(styles);

function VideoPlayer({ video, onNext, onPrev, hasNext, hasPrev }) {
    const [isMuted, setIsMuted] = useState(() => {
        const savedPreference = localStorage.getItem('tiktok-sound-preference');
        return savedPreference ? savedPreference === 'muted' : true;
    });

    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likedFlash, setLikedFlash] = useState(false);
    const [commentFlash, setCommentFlash] = useState(false);
    const [saved, setSaved] = useState(false);
    const [savedFlash, setSavedFlash] = useState(false);
    const [sharedFlash, setSharedFlash] = useState(false);
    const [progress, setProgress] = useState(0);
    const [followed, setFollowed] = useState(false);
    const [expandedDescription, setExpandedDescription] = useState(false);
    const [showPlayPauseOverlay, setShowPlayPauseOverlay] = useState(false);
    
    const videoRef = useRef(null);
    
    useEffect(() => {
        localStorage.setItem(
            'tiktok-sound-preference',
            isMuted ? 'muted' : 'unmuted',
        );
    }, [isMuted]);

    // Handle video when change or mounted
    useEffect(() => {
        if (!videoRef.current) return;

        // Reset state when video changes
        setVideoLoaded(false);
        setIsPlaying(false);

        // Sync volume state - ALWAYS MUTE ON LOAD TO MAKE SURE AUTOPLAY
        videoRef.current.muted = true;

        // Event handlers
        const handleLoadedMetadata = () => {
            setVideoLoaded(true);
        };

        const handleCanPlay = () => {
            if (!isPlaying) {
                videoRef.current
                    .play()
                    .then(() => {
                        setIsPlaying(true);
                        // only remove MUTE if user setted UNMUTE
                        setTimeout(() => {
                            if (videoRef.current && !isMuted) {
                                videoRef.current.muted = false;
                            }
                        }, 100);
                    })
                    .catch((error) => {
                        console.error('Autoplay prevented:', error);
                    });
            }
        };

        // add event listeners
        videoRef.current.addEventListener(
            'loadedmetadata',
            handleLoadedMetadata,
        );
        videoRef.current.addEventListener('canplay', handleCanPlay);

        // Explicit play attempt
        const attemptPlay = async () => {
            try {
                await videoRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.log(
                    'Initial autoplay prevented, waiting for canplay event:',
                    error,
                );
            }
        };

        // Thử phát ngay và thử lại sau 500ms nếu cần
        attemptPlay();
        const retryTimeout = setTimeout(() => {
            if (!isPlaying && videoRef.current) {
                console.log('Retry');
                attemptPlay();
            }
        }, 500);

        return () => {
            clearTimeout(retryTimeout);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeEventListener(
                    'loadedmetadata',
                    handleLoadedMetadata,
                );
                // eslint-disable-next-line react-hooks/exhaustive-deps
                videoRef.current.removeEventListener('canplay', handleCanPlay);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video.id]);

    // Update volume state in video
    useEffect(() => {
        if (videoRef.current && isPlaying) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted, isPlaying]);

    // Update progress bar
    useEffect(() => {
        if (!videoRef.current || !isPlaying) return;

        const updateProgress = () => {
            if (videoRef.current && videoRef.current.duration > 0) {
                const currentProgress =
                    (videoRef.current.currentTime / videoRef.current.duration) *
                    100;
                setProgress(currentProgress);
            }
        };

        const intervalId = setInterval(updateProgress, 100);
        return () => clearInterval(intervalId);
    }, [isPlaying]);

    useEffect(() => {
        if (showPlayPauseOverlay) {
            const timer = setTimeout(() => {
                setShowPlayPauseOverlay(false);
            }, 400);

            return () => clearTimeout(timer);
        }
    }, [showPlayPauseOverlay]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }

            setShowPlayPauseOverlay(true);
        }
    };

    // Handle event turn on/off sound
    const toggleMute = (e) => {
        e.stopPropagation();
        
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        
        if (videoRef.current) {
            videoRef.current.muted = newMutedState;
        }
    };

    const toggleDescription = (e) => {
        e.stopPropagation();
        setExpandedDescription(prev => !prev);
    };

    const handleLike = (e) => {
        e.stopPropagation();
        setLiked((prev) => !prev);

        setLikedFlash(true);
        setTimeout(() => {
            setLikedFlash(false);
        }, 200);
    };
    
    const handleSave = (e) => {
        e.stopPropagation();
        setSaved((prev) => !prev);

        setSavedFlash(true);
        setTimeout(() => {
            setSavedFlash(false);
        }, 200);
    };
    
    const handleComment = (e) => {
        e.stopPropagation();
        setCommentFlash(true);
        setTimeout(() => setCommentFlash(false), 200);
    };
    
    const handleShare = (e) => {
        e.stopPropagation();
        setSharedFlash(true);
        setTimeout(() => setSharedFlash(false), 200);
    };
    
    const handleFollow = (e) => {
        e.stopPropagation();
        setFollowed(!followed);
    };
    
    // Format numbers for display (e.g. 1.2K, 2.5M)
    const formatCount = (count) => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        }
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    };

    return (
        <div className={cx('video-container')}>
            {/* Video Player */}
            <div className={cx('video-player-wrapper')} onClick={togglePlay}>
                <video
                    ref={videoRef}
                    src={video.video.playAddr}
                    poster={video.video.cover}
                    loop
                    playsInline
                    className={cx('video')}
                />

                {/* Play/Pause Overlay */}
                <div
                    className={cx('play-pause-overlay', {
                        visible: showPlayPauseOverlay,
                    })}
                >
                    <div className={cx('play-pause-btn')}>
                        {isPlaying ? (
                            <FontAwesomeIcon icon={faPause} />
                        ) : (
                            <FontAwesomeIcon icon={faPlay} />
                        )}
                    </div>
                </div>
                
                {/* Navigation overlay indicators */}
                {/* {hasPrev && (
                    <div className={cx('nav-overlay', 'top')}>
                        <button 
                            className={cx('nav-overlay-button')}
                            onClick={handlePrevVideo}
                            aria-label="Previous video"
                        >
                            <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                    </div>
                )}
                
                {hasNext && (
                    <div className={cx('nav-overlay', 'bottom')}>
                        <button 
                            className={cx('nav-overlay-button')}
                            onClick={handleNextVideo}
                            aria-label="Next video"
                        >
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                    </div>
                )} */}

                {/* Progress video */}
                <div className={cx('progress-container')}>
                    <div className={cx('progress-bar')}>
                        <div
                            className={cx('progress-filled')}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Sound Button */}
                <div className={cx('header-btns')}>
                    <button className={cx('btn-wrapper')} onClick={toggleMute}>
                        {isMuted ? (
                            <MuteVolumeIcon className={cx('icon-btn')} />
                        ) : (
                            <UnmuteVolumeIcon className={cx('icon-btn')} />
                        )}
                    </button>

                    <Menu
                        items={ELLIPSIS_OPTIONS}
                        {...ELLIPSIS_POPPER_PROPS}
                        className={cx('ellipsis-popper')}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <button
                            className={cx('btn-wrapper', 'ellipsis-btn')}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                        >
                            <EllipsisIcon className={cx('icon-btn')} />
                        </button>
                    </Menu>
                </div>

                <div className={cx('video-info')}>
                    <div className={cx('user-info')}>
                        <Link to={`/@${video.user.id}`} className={cx('username')}>
                            @{video.user.nickname}
                        </Link>
                        {video.user.verified && (
                            <span className={cx('verified-icon')}>
                                <BlueTickIcon />
                            </span>
                        )}
                    </div>

                    <div
                        className={cx('description', {
                            expanded: expandedDescription,
                        })}
                    >
                        <p>
                            {video.description
                                .split(/(\s+)/)
                                .map((word, index) =>
                                    word.startsWith('#') ? (
                                        <strong
                                            key={index}
                                            className={cx('hashtag')}
                                        >
                                            {word}
                                        </strong>
                                    ) : (
                                        word
                                    ),
                                )}
                        </p>
                        <strong
                            className={cx('more-btn')}
                            onClick={toggleDescription}
                        >
                            {expandedDescription ? 'less' : 'more'}
                        </strong>
                    </div>

                    {/* <div className={cx('music-info')}>
                    <FontAwesomeIcon
                        icon={faMusic}
                        className={cx('music-icon')}
                    />
                    <span className={cx('music-text')}>{video.music}</span>
                </div> */}
                </div>
            </div>

            {/* Video Info */}

            {/* Action Buttons */}
            <div className={cx('action-buttons')}>
                <button className={cx('avatar-container')}>
                    <img
                        // src={video.user.avatar}
                        // alt={video.user.nickname}
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&s"
                        alt="DEFAULT_AVATAR"
                        className={cx('avatar')}
                    />
                    <div
                        className={cx('follow-btn', { followed: followed })}
                        onClick={handleFollow}
                    >
                        {!followed ? (
                            <PlusIcon className={cx('plus-icon')} />
                        ) : (
                            <TickFollowIcon className={cx('follow-icon')} />
                        )}
                    </div>
                </button>

                <button
                    className={cx('action-btn', { active: liked })}
                    onClick={handleLike}
                >
                    <div
                        className={cx('icon-wrapper', {
                            'liked-flash': likedFlash,
                        })}
                    >
                        <TymIcon />
                    </div>
                    <span className={cx('count')}>
                        {formatCount(video.stats.likes)}
                    </span>
                </button>

                <button className={cx('action-btn')} onClick={handleComment}>
                    <div
                        className={cx('icon-wrapper', {
                            'comment-flash': commentFlash,
                        })}
                    >
                        <FontAwesomeIcon icon={faCommentDots} />
                    </div>
                    <span className={cx('count')}>
                        {formatCount(video.stats.comments)}
                    </span>
                </button>

                <button
                    className={cx('action-btn', { active: saved })}
                    onClick={handleSave}
                >
                    <div
                        className={cx('icon-wrapper', {
                            'saved-flash': savedFlash,
                        })}
                    >
                        <BookmarkIcon className={cx('bookmark')} />
                    </div>
                    <span className={cx('count')}>
                        {formatCount(video.stats.saves)}
                    </span>
                </button>

                <button className={cx('action-btn')} onClick={handleShare}>
                    <div
                        className={cx('icon-wrapper', {
                            'shared-flash': sharedFlash,
                        })}
                    >
                        <FontAwesomeIcon icon={faShare} />
                    </div>
                    <span className={cx('count')}>
                        {formatCount(video.stats.shares)}
                    </span>
                </button>

                <button className={cx('sound-container')}>
                    <img
                        src="https://avatar-ex-swe.nixcdn.com/song/2024/09/17/i/O/M/T/1726557845569_640.jpg"
                        alt="sound-default"
                        className={cx('sound')}
                    />
                </button>
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

export default VideoPlayer;
