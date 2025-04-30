import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './VideoActions.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faShare } from '@fortawesome/free-solid-svg-icons';

import {
    BookmarkIcon,
    PlusIcon,
    TickFollowIcon,
    TymIcon,
} from '~/assets/images/icons';
import { useFlashAnimation } from '~/hooks';

const cx = classNames.bind(styles);

const ActionButton = React.memo(
    ({ icon, count, onClick, isActive, flashClass }) => (
        <button
            className={cx('action-btn', { active: isActive })}
            onClick={onClick}
        >
            <div className={cx('icon-wrapper', { [flashClass]: !!flashClass })}>
                {icon}
            </div>
            <span className={cx('count')}>{count}</span>
        </button>
    ),
);

function VideoActions({ video }) {
    const { stats } = video;

    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [followed, setFollowed] = useState(false);

    const [likedFlash, triggerLikedFlash] = useFlashAnimation();
    const [commentFlash, triggerCommentFlash] = useFlashAnimation();
    const [savedFlash, triggerSavedFlash] = useFlashAnimation();
    const [sharedFlash, triggerSharedFlash] = useFlashAnimation();

    const formatCount = useCallback((count) => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        }
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }, []);

    const formattedCounts = useMemo(
        () => ({
            likes: formatCount(stats.likes),
            comments: formatCount(stats.comments),
            saves: formatCount(stats.saves),
            shares: formatCount(stats.shares),
        }),
        [stats, formatCount],
    );

    const handleLike = useCallback(
        (e) => {
            e.stopPropagation();
            setLiked((prev) => !prev);
            triggerLikedFlash();
        },
        [triggerLikedFlash],
    );

    const handleSave = useCallback(
        (e) => {
            e.stopPropagation();
            setSaved((prev) => !prev);
            triggerSavedFlash();
        },
        [triggerSavedFlash],
    );

    const handleComment = useCallback(
        (e) => {
            e.stopPropagation();
            triggerCommentFlash();
        },
        [triggerCommentFlash],
    );

    const handleShare = useCallback(
        (e) => {
            e.stopPropagation();
            triggerSharedFlash();
        },
        [triggerSharedFlash],
    );

    const handleFollow = useCallback((e) => {
        e.stopPropagation();
        setFollowed((prev) => !prev);
    }, []);

    return (
        <div className={cx('action-buttons')}>
            <button className={cx('avatar-container')}>
                <img
                    // src={video.user.avatar}
                    // alt={video.user.nickname}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&s"
                    alt="DEFAULT_AVATAR"
                    className={cx('avatar')}
                />
                <div
                    className={cx('follow-btn', { followed: followed })}
                    onClick={handleFollow}
                >
                    {!followed ? (
                        <PlusIcon className={cx('plus-icon')} />
                    ) : (
                        <TickFollowIcon className={cx('follow-icon')} />
                    )}
                </div>
            </button>

            <ActionButton
                icon={<TymIcon />}
                count={formattedCounts.likes}
                onClick={handleLike}
                isActive={liked}
                flashClass={likedFlash ? 'liked-flash' : ''}
            />

            <ActionButton
                icon={<FontAwesomeIcon icon={faCommentDots} />}
                count={formattedCounts.comments}
                onClick={handleComment}
                isActive={false}
                flashClass={commentFlash ? 'comment-flash' : ''}
            />

            <ActionButton
                icon={<BookmarkIcon className={cx('bookmark')} />}
                count={formattedCounts.saves}
                onClick={handleSave}
                isActive={saved}
                flashClass={savedFlash ? 'saved-flash' : ''}
            />

            <ActionButton
                icon={<FontAwesomeIcon icon={faShare} />}
                count={formattedCounts.shares}
                onClick={handleShare}
                isActive={false}
                flashClass={sharedFlash ? 'shared-flash' : ''}
            />

            <button className={cx('sound-container')}>
                <img
                    src="https://avatar-ex-swe.nixcdn.com/song/2024/09/17/i/O/M/T/1726557845569_640.jpg"
                    alt="sound-default"
                    className={cx('sound')}
                />
            </button>
        </div>
    );
}

VideoActions.propTypes = {
    video: PropTypes.shape({
        stats: PropTypes.shape({
            likes: PropTypes.number,
            comments: PropTypes.number,
            saves: PropTypes.number,
            shares: PropTypes.number,
        }),
    }).isRequired,
};

ActionButton.propTypes = {
    icon: PropTypes.node.isRequired,
    count: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    flashClass: PropTypes.string,
};

export default VideoActions;
