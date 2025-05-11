import { useState, useEffect } from 'react';

export default function useVideoProgress(videoRef, isPlaying, isActive) {
    const [progress, setProgress] = useState(0);

    // Effect 1: Reset progress to 0 if the video is not active or the video element is not available.
    useEffect(() => {
        if (!isActive || !videoRef.current) {
            setProgress(0);
        }
    }, [isActive, videoRef]);

    // Effect 2: Manage interval for continuous updates ONLY when playing,
    // and update progress once to the current time when paused.
    useEffect(() => {
        if (!isActive || !videoRef.current) {
            // Conditions for resetting are handled by Effect 1.
            // Return early here to prevent errors if videoRef.current is null.
            return;
        }

        const videoElement = videoRef.current;

        const updateCurrentProgressToTime = () => {
            if (videoElement.duration > 0) {
                const newProgress =
                    (videoElement.currentTime / videoElement.duration) * 100;
                setProgress(newProgress);
            } else {
                // If duration is invalid (e.g., video not fully loaded or an issue),
                // reset progress. This also covers case where video ends and currentTime might be 0.
                setProgress(0);
            }
        };

        if (isPlaying) {
            // Video is playing: update progress immediately and set an interval for continuous updates.
            updateCurrentProgressToTime(); // Ensure it updates as soon as play starts
            const intervalId = setInterval(updateCurrentProgressToTime, 100);
            return () => clearInterval(intervalId); // Cleanup interval when isPlaying becomes false or component unmounts.
        } else {
            // Video is paused (or not yet playing but is active and loaded):
            // Update progress once to the current time. No interval needed.
            updateCurrentProgressToTime();
        }
    }, [videoRef, isPlaying, isActive]); // Rerun this effect if these crucial states change.

    return progress;
}
