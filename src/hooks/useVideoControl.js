/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useAutoScroll } from '~/contexts/AutoScrollContext';
import { useVolume } from '~/contexts/VolumeContext';

export default function useVideoControl({
  videoId,
  hasNext,
  onNext,
  isActive = false,
}) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayPauseOverlay, setShowPlayPauseOverlay] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const { isGloballyMuted, toggleGlobalMute } = useVolume();

  const videoRef = useRef(null);
  const autoScrollTimeoutRef = useRef(null);
  const { isAutoScrollEnabled } = useAutoScroll();

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

    // Sync volume state - ALWAYS MUTE ON LOAD TO MAKE SURE AUTOPLAY
    if (videoRef.current) {
      videoRef.current.muted = true;
    }

    // Event handlers
    const handleLoadedMetadata = () => {
      setVideoLoaded(true);
    };

    const handleCanPlay = () => {
      if (!videoRef.current || !isActive) return;

      if (isActive && !isPlaying) {
        if (!videoRef.current) return;
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            // Only remove MUTE if user set UNMUTE
            setTimeout(() => {
              if (videoRef.current && !isGloballyMuted) {
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
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoRef.current.addEventListener('canplay', handleCanPlay);
    }

    // Explicit play attempt if this is the active video
    const attemptPlay = async () => {
      if (!isActive || !videoRef.current) return;

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

    // Try to play immediately for active videos and retry after 500ms if needed
    if (isActive && videoRef.current) {
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
        videoRef.current.removeEventListener(
          'loadedmetadata',
          handleLoadedMetadata,
        );
        videoRef.current.removeEventListener('canplay', handleCanPlay);
      }
    };
  }, [videoId, videoRef.current?.src, isActive, isGloballyMuted]);

  // Pause video when not active
  useEffect(() => {
    if (!isActive && videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

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
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      if (videoRef.current) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error('Play failed on toggle:', err));
      }
    }

    setShowPlayPauseOverlay(true);
  };

  useEffect(() => {
    if (!videoRef.current || !videoRef.current.src) return;

    // Xử lý sự kiện waiting (video bị dừng do đang buffer)
    const handleWaiting = () => {
      if (isPlaying) {
        setIsBuffering(true);
      }
    };

    // Xử lý sự kiện playing (video đã buffer xong và đang phát)
    const handlePlaying = () => {
      setIsBuffering(false);
    };

    // Thêm event listeners
    if (videoRef.current) {
      videoRef.current.addEventListener('waiting', handleWaiting);
      videoRef.current.addEventListener('playing', handlePlaying);
    }

    // Cleanup
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('waiting', handleWaiting);
        videoRef.current.removeEventListener('playing', handlePlaying);
      }
    };
  }, [videoRef.current?.src, isPlaying]);

  // Update volume state in video
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.muted = isGloballyMuted;
    }
  }, [isGloballyMuted, isPlaying]);

  // Handle event turn on/off sound
  const handleToggleMute = (e) => {
    if (e) e.stopPropagation();
    toggleGlobalMute();
  };

  return {
    videoRef,
    videoLoaded,
    isPlaying,
    isMuted: isGloballyMuted,
    showPlayPauseOverlay,
    isAutoScrollEnabled,
    isBuffering,
    togglePlay,
    toggleMute: handleToggleMute,
  };
}
