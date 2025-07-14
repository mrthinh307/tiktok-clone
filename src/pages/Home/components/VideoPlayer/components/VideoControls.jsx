import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../VideoPlayer.module.scss';
import useVideoProgress from '~/hooks/useVideoProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import {
  MuteVolumeIcon,
  UnmuteVolumeIcon,
  EllipsisIcon,
} from '~/assets/images/icons';
import Menu from '~/components/Popper/Menu';
import {
  ELLIPSIS_OPTIONS,
  ELLIPSIS_POPPER_PROPS,
} from '~/constants/videoConstant';
import LoadingSpinner from '~/layouts/components/LoadingSpinner';

const cx = classNames.bind(styles);

const VideoControls = memo(
  ({
    videoRef,
    isActive,
    isPlaying,
    isMuted,
    showPlayPauseOverlay,
    toggleMute,
    isBuffering,
  }) => {
    const progress = useVideoProgress(videoRef, isPlaying, isActive);

    return (
      <>
        {/* Play/Pause Overlay */}
        {!isBuffering && (
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
        )}

        {/* Buffering overlay - hiển thị khi đang buffer */}
        {isBuffering && <LoadingSpinner />}

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
      </>
    );
  },
);

VideoControls.displayName = 'VideoControls';

VideoControls.propTypes = {
  videoRef: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isMuted: PropTypes.bool.isRequired,
  showPlayPauseOverlay: PropTypes.bool.isRequired,
  toggleMute: PropTypes.func.isRequired,
  isBuffering: PropTypes.bool,
};

VideoControls.defaultProps = {
  isBuffering: false,
};

export default VideoControls;
