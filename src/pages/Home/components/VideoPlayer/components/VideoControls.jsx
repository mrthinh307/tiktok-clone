import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../VideoPlayer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { MuteVolumeIcon, UnmuteVolumeIcon, EllipsisIcon } from '~/assets/images/icons';
import Menu from '~/components/Popper/Menu';
import { ELLIPSIS_OPTIONS, ELLIPSIS_POPPER_PROPS } from '~/constants/videoConstant';

const cx = classNames.bind(styles);

const VideoControls = memo(({
    isPlaying,
    isMuted,
    progress,
    showPlayPauseOverlay,
    toggleMute
}) => {
    return (
        <>
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
});

VideoControls.displayName = 'VideoControls';

VideoControls.propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    isMuted: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    showPlayPauseOverlay: PropTypes.bool.isRequired,
    toggleMute: PropTypes.func.isRequired
};

export default VideoControls;