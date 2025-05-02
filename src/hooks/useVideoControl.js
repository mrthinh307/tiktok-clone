/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useAutoScroll } from '~/contexts/AutoScrollContext';

export default function useVideoControl({ videoId, hasNext, onNext, isActive = false }) {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showPlayPauseOverlay, setShowPlayPauseOverlay] = useState(false);
    const [isMuted, setIsMuted] = useState(() => {
        const savedPreference = localStorage.getItem('tiktok-sound-preference');
        return savedPreference ? savedPreference === 'muted' : true;
    });
    const [forcePlay, setForcePlay] = useState(false);

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

    // Handle auto scroll and video end
    useEffect(() => {
        if (!videoRef.current || !isActive) return;

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

        videoRef.current.addEventListener('ended', handleVideoEnded);

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('ended', handleVideoEnded);
            }
            if (autoScrollTimeoutRef.current) {
                clearTimeout(autoScrollTimeoutRef.current);
            }
        };
    }, [isAutoScrollEnabled, hasNext, onNext, isActive]);

    // Handle video when source changes or active state changes
    useEffect(() => {
        if (!videoRef.current || !videoRef.current.src) return;

        // Reset state when video changes
        if (!videoLoaded) {
            setProgress(0);
        }

        // Sync volume state - ALWAYS MUTE ON LOAD TO MAKE SURE AUTOPLAY
        videoRef.current.muted = true;

        // Event handlers
        const handleLoadedMetadata = () => {
            setVideoLoaded(true);
        };

        const handleCanPlay = () => {
            if (isActive && !isPlaying) {
                videoRef.current
                    .play()
                    .then(() => {
                        setIsPlaying(true);
                        // Only remove MUTE if user set UNMUTE
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

        // Explicit play attempt if this is the active video
        const attemptPlay = async () => {
            if (!isActive) return;
            
            try {
                await videoRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.log('Initial autoplay prevented, waiting for canplay event:', error);
            }
        };

        // Try to play immediately for active videos and retry after 500ms if needed
        if (isActive) {
            attemptPlay();
            const retryTimeout = setTimeout(() => {
                if (!isPlaying && videoRef.current && isActive) {
                    attemptPlay();
                }
            }, 500);
            
            return () => clearTimeout(retryTimeout);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                videoRef.current.removeEventListener('canplay', handleCanPlay);
            }
        };
    }, [videoId, isMuted, videoRef.current?.src, isActive]);

    // Pause video when not active
    useEffect(() => {
        if (!isActive && videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, [isActive]);

    // Handle force play request
    useEffect(() => {
        if (forcePlay && videoRef.current && isActive) {
            videoRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    setForcePlay(false);
                })
                .catch(error => {
                    console.error('Force play failed:', error);
                    setForcePlay(false);
                });
        }
    }, [forcePlay, isActive]);

    // Update volume state in video
    useEffect(() => {
        if (videoRef.current && isPlaying) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted, isPlaying]);

    // Update progress bar
    useEffect(() => {
        if (!videoRef.current || !isPlaying || !isActive) return;

        const updateProgress = () => {
            if (videoRef.current && videoRef.current.duration > 0) {
                const currentProgress =
                    (videoRef.current.currentTime / videoRef.current.duration) * 100;
                setProgress(currentProgress);
            }
        };

        const intervalId = setInterval(updateProgress, 100);
        return () => clearInterval(intervalId);
    }, [isPlaying, isActive]);

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
        if (!videoRef.current || !videoRef.current.src) return;
        
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error('Play failed on toggle:', err));
        }

        setShowPlayPauseOverlay(true);
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
        setForcePlay,
    };
}