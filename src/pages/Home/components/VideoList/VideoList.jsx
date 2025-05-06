import PropTypes from 'prop-types';
import VideoPlayer from '../VideoPlayer';


const VideoList = ({
    videos,
    currentVideoIndex,
    videosToRender,
    navigateToNext,
    navigateToPrev,
    loadedMap,
    className,
}) => {

    return (
        <div className={className}>
            {videosToRender.map((video) => {
                const videoIndex = videos.findIndex((v) => v.id === video.id);

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
                            shouldPlay={
                                currentVideoIndex === videoIndex
                            }
                        />
                    </div>
                );
            })}
        </div>
    );
};

VideoList.propTypes = {
    videos: PropTypes.array.isRequired,
    currentVideoIndex: PropTypes.number.isRequired,
    videosToRender: PropTypes.array.isRequired,
    navigateToNext: PropTypes.func.isRequired,
    navigateToPrev: PropTypes.func.isRequired,
    loadedMap: PropTypes.object.isRequired,
};

VideoList.displayName = 'VideoList';

export default VideoList;
