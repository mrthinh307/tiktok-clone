import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './VideoActions.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faShare } from '@fortawesome/free-solid-svg-icons';
import { ClickSpark } from '~/components/Animations';

import {
    BookmarkIcon,
    PlusIcon,
    TickFollowIcon,
    TymIcon,
} from '~/assets/images/icons';
import { useAuth } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

const ActionButton = React.memo(
    ({ icon, count, onClick, isActive, sparkColor }) => (
        <ClickSpark
            sparkColor={sparkColor}
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
        >
            <button
                className={cx('action-btn', { active: isActive })}
                onClick={onClick}
            >
                <div className={cx('icon-wrapper')}>{icon}</div>
                <span className={cx('count')}>{count}</span>
            </button>
        </ClickSpark>
    ),
);

function VideoActions({ video }) {
    const { user, toggleLoginForm } = useAuth();

    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [followed, setFollowed] = useState(false);

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
            likes: formatCount(video.likes_count),
            comments: formatCount(video.comments_count),
            saves: formatCount(Math.floor(Math.random() * 200)),
            shares: formatCount(video.shares_count),
        }),
        [video, formatCount],
    );

    // Wrapper to check if user is logged in before executing action
    const requireAuth = useCallback(
        (action) => (e) => {
            if (!user) {
                toggleLoginForm();
                return;
            }
            action(e);
        },
        [user, toggleLoginForm],
    );

    const handleLike = useCallback((e) => {
        setLiked((prev) => !prev);
    }, []);

    const handleSave = useCallback((e) => {
        setSaved((prev) => !prev);
    }, []);

    const handleComment = useCallback((e) => {}, []);

    const handleShare = useCallback((e) => {}, []);

    const handleFollowButtonClick = useCallback(
        (e) => {
            e.stopPropagation();

            if (!user) {
                toggleLoginForm();
                return;
            }

            setFollowed((prev) => !prev);
        },
        [user, toggleLoginForm],
    );

    return (
        <div className={cx('action-buttons')}>
            <button
                className={cx('avatar-container')}
                onClick={requireAuth(() => {})}
            >
                <img
                    src={video.user.avatar}
                    alt="avatar"
                    className={cx('avatar')}
                />
                <div
                    className={cx('follow-btn', { followed: followed })}
                    onClick={handleFollowButtonClick}
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
                onClick={requireAuth(handleLike)}
                isActive={liked}
                sparkColor={liked ? '#fe2c55' : '#000'}
            />

            <ActionButton
                icon={<FontAwesomeIcon icon={faCommentDots} />}
                count={formattedCounts.comments}
                onClick={requireAuth(handleComment)}
                isActive={false}
                sparkColor="transparent"
            />

            <ActionButton
                icon={<BookmarkIcon className={cx('bookmark')} />}
                count={formattedCounts.saves}
                onClick={requireAuth(handleSave)}
                isActive={saved}
                sparkColor={saved ? '#f3cd00' : '#000'}
            />

            <ActionButton
                icon={<FontAwesomeIcon icon={faShare} />}
                count={formattedCounts.shares}
                onClick={requireAuth(handleShare)}
                isActive={false}
                sparkColor="transparent"
            />

            <button
                className={cx('sound-container')}
                onClick={requireAuth(() => {})}
            >
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
    sparkColor: PropTypes.string,
};

export default VideoActions;
