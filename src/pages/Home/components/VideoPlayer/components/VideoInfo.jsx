import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from '../VideoPlayer.module.scss';
import { BlueTickIcon } from '~/assets/images/icons';

const cx = classNames.bind(styles);

const VideoInfo = memo(({ video, expandedDescription, toggleDescription }) => {
    return (
        <div className={cx('video-info')}>
            <div className={cx('user-info')}>
                <Link to={`/@${video.user.id}`} className={cx('username')}>
                    @{video.user.nickname}
                </Link>
                {video.user.tick && (
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
                                <strong key={index} className={cx('hashtag')}>
                                    {word}
                                </strong>
                            ) : (
                                word
                            ),
                        )}
                </p>
                <strong className={cx('more-btn')} onClick={toggleDescription}>
                    {expandedDescription ? 'less' : 'more'}
                </strong>
            </div>
        </div>
    );
});

VideoInfo.displayName = 'VideoInfo';

VideoInfo.propTypes = {
    video: PropTypes.object.isRequired,
    expandedDescription: PropTypes.bool.isRequired,
    toggleDescription: PropTypes.func.isRequired,
};

export default VideoInfo;