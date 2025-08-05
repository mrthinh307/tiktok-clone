import classNames from 'classnames/bind';
import styles from '../VideoPlayer.module.scss';

const cx = classNames.bind(styles);

function VideoPlayerSkeleton() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        {/* Video Player Skeleton */}
        <div
          className={cx(
            'video-player',
            'relative h-full w-[450px] max-w-[768px] overflow-hidden',
          )}
        >
          {/* Main video skeleton with shimmer */}
          <div
            className={cx('skeleton-shimmer', 'absolute inset-0 bg-gray-200')}
          ></div>

          {/* Video info skeleton */}
          <div className={cx('video-info')}>
            {/* User info skeleton */}
            <div className="flex items-center mb-[6px]">
              <div
                className={cx('skeleton-text', 'h-[18px] bg-gray-300 w-[110px]')}
              ></div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-[4px]">
              <div
                className={cx('skeleton-text', 'h-[18px] bg-gray-300 w-[300px]')}
              ></div>
              <div
                className={cx('skeleton-text', 'h-[18px] bg-gray-300 w-[200px]')}
              ></div>
            </div>
          </div>
        </div>

        {/* Video Actions Skeleton */}
        <div className="flex flex-col items-center gap-6 ml-4">
          {/* Avatar skeleton */}
          <div className="relative">
            <div
              className={cx('skeleton-avatar', 'w-[48px] h-[48px] bg-gray-300')}
            ></div>
          </div>

          {/* Like button skeleton */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={cx('skeleton-button', 'w-[48px] h-[48px] bg-gray-300')}
            ></div>
          </div>

          {/* Comment button skeleton */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={cx('skeleton-button', 'w-[48px] h-[48px] bg-gray-300')}
            ></div>
          </div>

          {/* Bookmark button skeleton */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={cx('skeleton-button', 'w-[48px] h-[48px] bg-gray-300')}
            ></div>
          </div>

          {/* Share button skeleton */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={cx('skeleton-button', 'w-[48px] h-[48px] bg-gray-300')}
            ></div>
          </div>

          {/* Music icon skeleton */}
          <div
            className={cx(
              'skeleton-shimmer',
              'w-[48px] h-[48px] bg-gray-300 rounded-full',
            )}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerSkeleton;
