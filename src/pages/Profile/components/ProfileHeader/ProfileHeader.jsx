import cx from 'clsx';
import styles from './ProfileHeader.module.scss';
import Button from '~/components/Button';
import ShareTo from '~/components/ShareTo';
import FollowersModal from '../FollowersModal';
import { useState } from 'react';
import { BlueTickIcon, EllipsisIcon, FollowedIcon, SettingIcon, ShareIcon } from '~/assets/images/icons';
import EditProfileModal from '../EditProfileModal';
import { useAuth } from '~/contexts/AuthContext';
import { useSocialInteraction } from '~/contexts/SocialInteractionContext';
import { Link, useNavigate } from 'react-router-dom';
import { createConversationWithSystemMessage, navigateToConversation } from '~/services/conversationService';
import { toast } from 'sonner';

function ProfileHeader({ profile }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [followersModal, setFollowersModal] = useState({ isOpen: false, tab: 'followers' });
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  // const [isFollowLoading, setIsFollowLoading] = useState(false);
  const { user } = useAuth();
  const { isFollowing, handleToggleFollow, followingUsers, followersUsers } = useSocialInteraction();
  const { toggleLoginForm } = useAuth();
  const navigate = useNavigate();

  // Check if this profile belongs to the current user
  const isOwnProfile =
    profile?.nickname === user?.nickname || profile?.id === user?.sub;

  // Safety check - if profile is null/undefined, don't render
  if (!profile) {
    return null;
  }

  // Handle button clicks
  const handlePrimaryButtonClick = async () => { 
    if (isOwnProfile) {
      setIsEditModalOpen(true);
    } else {
      // Handle follow/unfollow for other users
      if (!user?.sub || !profile?.id) {
        toast.error('Please log in to follow users');
        toggleLoginForm();
        return;
      }

      try {
        await handleToggleFollow(profile.id);
      } catch (error) {
        console.error('Error toggling follow:', error);
        toast.error('Failed to update follow status');
      } finally {
      }
    }
  };

  const handleSecondaryButtonClick = async () => {
    if (isOwnProfile) {
      console.log('Promote Post clicked - Opening promotion options');
    } else {
      // Handle Message button click for other users
      if (!user?.sub || !profile?.id) {
        toast.error('Missing user or profile information');
        return;
      }

      setIsCreatingConversation(true);
      
      try {
        // Create conversation with system message
        const result = await createConversationWithSystemMessage(
          user.sub, // current user ID
          profile.id, // target user ID
          profile.nickname, // target user nickname
          user.fullName || user.nickname || 'Someone' // current user name
        );

        if (result.success) {
          // Navigate to messages page with pre-selected conversation
          const receiverInfo = {
            partner_id: profile.id,
            partner_full_name: profile.fullName,
            partner_avatar_url: profile.avatar_url,
            partner_nickname: profile.nickname
          };
          
          navigateToConversation(profile.id, receiverInfo, navigate);
        } else {
          console.error('Failed to create conversation:', result.error);
          // Still navigate to messages page even if creation failed
          navigate('/messages');
        }
      } catch (error) {
        console.error('Error creating conversation:', error);
        // Fallback: just navigate to messages page
        navigate('/messages');
      } finally {
        setIsCreatingConversation(false);
      }
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleFollowersClick = async () => {
    setFollowersModal({ isOpen: true, tab: 'followers' });
  };

  const handleFollowingClick = async () => {
    setFollowersModal({ isOpen: true, tab: 'following' });
  };


  return (
    <>
      <div className={cx(styles['profile-header'])}>
        <div className={cx(styles['avatar-container'])}>
          <img
            alt="avatar"
            src={profile.avatar_url}
            className={cx(styles.avatar)}
          />
        </div>
        <div className={cx(styles['user-info'])}>
          <div className={cx(styles['user-details'])}>
            <span className={cx(styles.username)}>
              {profile.nickname || ''}
            </span>
            {profile.tick && <BlueTickIcon className={cx(styles['blue-tick'])} />}
            <p className={cx(styles['display-name'])}>
              {profile.fullName || ''}
            </p>
          </div>

          <div className={cx(styles['action-buttons'])}>
            <Button
              className={cx(styles['edit-profile-btn'], {
                [styles.following]: !isOwnProfile && isFollowing(profile.id)
              })}
              primary
              onClick={handlePrimaryButtonClick}
              // disabled={isFollowLoading}
              leftIcon={isFollowing(profile.id) && <FollowedIcon />}
            >
              
                {isOwnProfile 
                  ? 'Edit Profile' 
                    : isFollowing(profile.id) 
                      ? 'Following' 
                      : 'Follow'
                }
            </Button>
            
            {/* Conditionally render Link or Button based on isOwnProfile */}
            {isOwnProfile ? (
              <Link to={`/messages`}>
                <Button
                  className={cx(styles['promote-post-btn'])}
                  primary
                  onClick={handleSecondaryButtonClick}
                >
                  Inbox
                </Button>
              </Link>
            ) : (
              <Button
                className={cx(styles['promote-post-btn'])}
                primary
                onClick={handleSecondaryButtonClick}
                disabled={isCreatingConversation}
              >
                Messages
              </Button>
            )}
            
            <div
              className={cx(styles['action-icon'])}
              onClick={handleShareClick}
            >
              <ShareIcon />
            </div>
            <Link
              className={cx(styles['action-icon'])}
              to={isOwnProfile ? '/setting' : `/user/${profile?.nickname}`}
            >
              {isOwnProfile ? <SettingIcon /> : <EllipsisIcon />}
            </Link>
          </div>

          <div className={cx(styles['stats-container'])}>
            <div className={cx(styles['stat-item'], styles['clickable'])}>
              <span className={cx(styles['stat-number'])}>
                {profile.followings_count || 0}
              </span>
              <span className={cx(styles['stat-label'])} onClick={handleFollowingClick}>Following</span>
            </div>
            <div className={cx(styles['stat-item'], styles['clickable'])}>
              <span className={cx(styles['stat-number'])}>
                {profile.followers_count || 0}
              </span>
              <span className={cx(styles['stat-label'])} onClick={handleFollowersClick}>Followers</span>
            </div>
            <div className={cx(styles['stat-item'])}>
              <span className={cx(styles['stat-number'])}>
                {profile.likes_count || 0}
              </span>
              <span className={cx(styles['stat-label'])}>Likes</span>
            </div>
          </div>

          <p className={cx(styles.bio)}>{profile.bio || 'No bio yet.'}</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={profile}
      />

      {/* Share To Modal */}
      <ShareTo
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
      />

      {/* Followers/Following Modal */}
      <FollowersModal
        isOpen={followersModal.isOpen}
        onClose={() => setFollowersModal({ isOpen: false, tab: 'followers' })}
        profile={profile}
        initialTab={followersModal.tab}
        followingUsers={followingUsers[profile?.id] || []}
        followersUsers={followersUsers[profile?.id] || []}
      />
    </>
  );
}

export default ProfileHeader;
