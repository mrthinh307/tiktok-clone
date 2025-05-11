import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from '../VideoPlayer';

const VideoList = React.memo(({
    videos,
    currentVideoIndex,
    videosToRender,
    navigateToNext,
    navigateToPrev,
    loadedMap,
    className,
}) => {
    // Tạo một map từ video ID đến index để tối ưu việc tìm index
    const videoIndexMap = useMemo(() => {
        const map = new Map();
        videos.forEach((video, index) => {
            map.set(video.id, index);
        });
        return map;
    }, [videos]);

    return (
        <div className={className}>
            {videosToRender.map((video) => {
                // Sử dụng map để lấy index thay vì tìm kiếm trong mảng mỗi lần render
                const videoIndex = videoIndexMap.get(video.id);

                return (
                    <div
                        key={video.id}
                        style={{
                            display:
                                currentVideoIndex === videoIndex
                                    ? 'block'
                                    : 'none',
                            height: '100%',
                        }}
                    >
                        <VideoPlayer
                            video={video}
                            onNext={navigateToNext}
                            onPrev={navigateToPrev}
                            hasNext={videoIndex < videos.length - 1}
                            hasPrev={videoIndex > 0}
                            isLoaded={!!loadedMap[video.id]}
                            shouldPlay={currentVideoIndex === videoIndex}
                        />
                    </div>
                );
            })}
        </div>
    );
});

VideoList.propTypes = {
    videos: PropTypes.array.isRequired,
    currentVideoIndex: PropTypes.number.isRequired,
    videosToRender: PropTypes.array.isRequired,
    navigateToNext: PropTypes.func.isRequired,
    navigateToPrev: PropTypes.func.isRequired,
    loadedMap: PropTypes.object.isRequired,
    className: PropTypes.string
};

VideoList.displayName = 'VideoList';

export default VideoList;
