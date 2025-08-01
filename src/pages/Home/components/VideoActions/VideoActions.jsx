import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
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
import { useSocialInteraction } from '~/contexts/SocialInteractionContext';

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
  const { isFollowing, handleToggleFollow, handleToggleLikeVideo } =
    useSocialInteraction();

  const [liked, setLiked] = useState(video.is_liked);
  const [likesCount, setLikesCount] = useState(video.likes_count);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(isFollowing(video.user.id));

  // Cập nhật trạng thái followed, liked khi followingIds, likedIds thay đổi
  useEffect(() => {
    setFollowed(isFollowing(video.user.id));
  }, [isFollowing, video.user.id]);

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
      likes: formatCount(likesCount),
      comments: formatCount(video.comments_count),
      saves: formatCount(Math.floor(Math.random() * 200)),
      shares: formatCount(video.shares_count),
    }),
    [likesCount, video.comments_count, video.shares_count, formatCount],
  );

  // Wrapper to check if user is logged in before executing action
  const requireAuth = useCallback(
    (action) => (e) => {
      e.stopPropagation();
      if (!user) {
        toggleLoginForm();
        return;
      }
      action(e);
    },
    [user, toggleLoginForm],
  );

  const handleLikeButtonClick = useCallback(
    async (e) => {
      e.stopPropagation();

      try {
        if (!liked) {
          setLikesCount((prev) => prev + 1);
          video.is_liked = true;
          video.likes_count = likesCount + 1;
        } else {
          setLikesCount((prev) => Math.max(prev - 1, 0));
          video.is_liked = false;
          video.likes_count = Math.max(likesCount - 1, 0);
        }
        setLiked((prev) => !prev);
        await handleToggleLikeVideo(video.id);
      } catch (error) {
        console.error('Error toggling like:', error);
        return;
      }
    },
    [handleToggleLikeVideo, liked, likesCount, video],
  );

  const handleFollowButtonClick = useCallback(
    async (e) => {
      e.stopPropagation();

      try {
        setFollowed(!isFollowing(video.user.id));
        await handleToggleFollow(video.user.id);
      } catch (error) {
        console.error('Error handling follow/unfollow:', error);
      }
    },
    [video.user.id, isFollowing, handleToggleFollow],
  );

  const handleSave = useCallback((e) => {
    setSaved((prev) => !prev);
  }, []);

  const handleComment = useCallback((e) => {}, []);

  const handleShare = useCallback((e) => {}, []);

  return (
    <div className={cx('action-buttons')}>
      <button
        className={cx('avatar-container')}
        onClick={requireAuth(() => {})}
      >
        <img
          src={video.user.avatar_url}
          alt="avatar"
          className={cx('avatar')}
        />
        <div
          className={cx('follow-btn', {
            followed: followed,
            hidden: video.user.id === user?.sub,
          })}
          onClick={requireAuth((e) => handleFollowButtonClick(e))}
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
        onClick={requireAuth((e) => handleLikeButtonClick(e))}
        isActive={liked}
        sparkColor={liked ? '#fe2c55' : '#000'}
      />

      <ActionButton
        icon={<FontAwesomeIcon icon={faCommentDots} />}
        count={formattedCounts.comments}
        onClick={handleComment}
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
        onClick={handleShare}
        isActive={false}
        sparkColor="transparent"
      />

      <button className={cx('sound-container')} onClick={requireAuth(() => {})}>
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

export default memo(VideoActions);
