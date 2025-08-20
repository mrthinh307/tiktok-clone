import cx from 'clsx';
import styles from './ProfileHeader.module.scss';
import Button from '~/components/Button';
import { useState } from 'react';
import { EllipsisIcon, SettingIcon, ShareIcon } from '~/assets/images/icons';
import EditProfileModal from '../EditProfileModal';
import { useAuth } from '~/contexts/AuthContext';

function ProfileHeader({ profile }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();

  // Check if this profile belongs to the current user
  const isOwnProfile = profile?.nickname === user?.nickname || profile?.id === user?.sub;

  // Safety check - if profile is null/undefined, don't render
  if (!profile) {
    return null;
  }

  // Handle button clicks
  const handlePrimaryButtonClick = () => {
    if (isOwnProfile) {
      setIsEditModalOpen(true);
    } else {
      console.log('Follow clicked - Following user:', profile.nickname);
    }
  };

  const handleSecondaryButtonClick = () => {
    if (isOwnProfile) {
      console.log('Promote Post clicked - Opening promotion options');
    } else {
      console.log(
        'Message clicked - Opening chat with user:',
        profile.nickname,
      );
    }
  };

  const handleShareClick = () => {
    console.log('Share clicked - Sharing profile:', profile.nickname);
  };

  const handleMoreOptionsClick = () => {
    console.log('More options clicked for profile:', profile.nickname);
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
            <p className={cx(styles['display-name'])}>
              {profile.fullName || ''}
            </p>
          </div>

          <div className={cx(styles['action-buttons'])}>
            <Button
              className={cx(styles['edit-profile-btn'])}
              primary
              onClick={handlePrimaryButtonClick}
            >
              {isOwnProfile ? 'Edit Profile' : 'Follow'}
            </Button>
            <Button
              className={cx(styles['promote-post-btn'])}
              primary
              onClick={handleSecondaryButtonClick}
            >
              {isOwnProfile ? 'Promote Post' : 'Message'}
            </Button>
            <div
              className={cx(styles['action-icon'])}
              onClick={handleShareClick}
            >
              <ShareIcon />
            </div>
            <div
              className={cx(styles['action-icon'])}
              onClick={handleMoreOptionsClick}
            >
              {isOwnProfile ? <SettingIcon /> : <EllipsisIcon />}
            </div>
          </div>

          <div className={cx(styles['stats-container'])}>
            <div className={cx(styles['stat-item'])}>
              <span className={cx(styles['stat-number'])}>
                {profile.followings_count || 0}
              </span>
              <span className={cx(styles['stat-label'])}>Following</span>
            </div>
            <div className={cx(styles['stat-item'])}>
              <span className={cx(styles['stat-number'])}>
                {profile.followers_count || 0}
              </span>
              <span className={cx(styles['stat-label'])}>Followers</span>
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
    </>
  );
}

export default ProfileHeader;
