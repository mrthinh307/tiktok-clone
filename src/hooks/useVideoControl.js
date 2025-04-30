/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useAutoScroll } from '~/contexts/AutoScrollContext';

export default function useVideoControl({ videoId, hasNext, onNext }) {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showPlayPauseOverlay, setShowPlayPauseOverlay] = useState(false);
    const [isMuted, setIsMuted] = useState(() => {
        const savedPreference = localStorage.getItem('tiktok-sound-preference');
        return savedPreference ? savedPreference === 'muted' : true;
    });

    const videoRef = useRef(null);
    const autoScrollTimeoutRef = useRef(null);
    const { isAutoScrollEnabled } = useAutoScroll();

    // Storage sound preference
    useEffect(() => {
        localStorage.setItem(
            'tiktok-sound-preference',
            isMuted ? 'muted' : 'unmuted',
        );
    }, [isMuted]);

    // Handle auto scroll
    useEffect(() => {
        const handleVideoEnded = () => {
            if (isAutoScrollEnabled && hasNext && onNext) {
                autoScrollTimeoutRef.current = setTimeout(() => {
                    onNext();
                }, 500);
            } else if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current
                    .play()
                    .catch((err) => console.error('Replay failed:', err));
            }
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('ended', handleVideoEnded);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('ended', handleVideoEnded);
            }
            if (autoScrollTimeoutRef.current) {
                clearTimeout(autoScrollTimeoutRef.current);
            }
        };
    }, [isAutoScrollEnabled, hasNext, onNext]);

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

        // Add event listeners
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoRef.current.addEventListener('canplay', handleCanPlay);

        // Explicit play attempt
        const attemptPlay = async () => {
            try {
                await videoRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.log('Initial autoplay prevented, waiting for canplay event:', error);
            }
        };

        // Thử phát ngay và thử lại sau 500ms nếu cần
        attemptPlay();
        const retryTimeout = setTimeout(() => {
            if (!isPlaying && videoRef.current) {
                attemptPlay();
            }
        }, 500);

        return () => {
            clearTimeout(retryTimeout);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                videoRef.current.removeEventListener('canplay', handleCanPlay);
            }
        };
    }, [videoId, isMuted]);

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
                    (videoRef.current.currentTime / videoRef.current.duration) * 100;
                setProgress(currentProgress);
            }
        };

        const intervalId = setInterval(updateProgress, 100);
        return () => clearInterval(intervalId);
    }, [isPlaying]);

    // Play/pause overlay animation
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
        if (e) e.stopPropagation();

        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        if (videoRef.current) {
            videoRef.current.muted = newMutedState;
        }
    };

    return {
        videoRef,
        videoLoaded,
        isPlaying,
        isMuted,
        progress,
        showPlayPauseOverlay,
        isAutoScrollEnabled,
        togglePlay,
        toggleMute,
    };
}