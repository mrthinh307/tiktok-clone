import cx from 'clsx';
import { useState } from 'react';
import Button from '~/components/Button';
import { EllipsisIcon, SettingIcon, ShareIcon } from '~/assets/images/icons';
import { useAuth } from '~/contexts/AuthContext';
import EditProfileModal from '../EditProfileModal';
import styles from './ProfileHeader.module.scss';

function ProfileHeader({
  nickname,
  displayName = 'duy thinh',
  avatar = 'https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/51b002de377bbab3d82174c2f4c6c8d5~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=041f7cad&x-expires=1755748800&x-signature=FMvFtfmiq8eS5Q%2FO3EyBwHULiEU%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2',
  bio = 'No bio yet.',
  stats = {
    following: 822,
    followers: 35,
    likes: 57,
  },
}) {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if this profile belongs to the current user
  const isOwnProfile =
    user &&
    (user.nickname === nickname ||
      user.username === nickname ||
      user.id === nickname);

  // Current user profile data for modal
  const userProfile = {
    username: nickname,
    name: displayName,
    bio: bio,
    avatar: avatar,
  };

  // Handle button clicks
  const handlePrimaryButtonClick = () => {
    if (isOwnProfile) {
      setIsEditModalOpen(true);
    } else {
      console.log('Follow clicked - Following user:', nickname);
    }
  };

  const handleSecondaryButtonClick = () => {
    if (isOwnProfile) {
      console.log('Promote Post clicked - Opening promotion options');
    } else {
      console.log('Message clicked - Opening chat with user:', nickname);
    }
  };

  const handleShareClick = () => {
    console.log('Share clicked - Sharing profile:', nickname);
  };

  const handleMoreOptionsClick = () => {
    console.log('More options clicked for profile:', nickname);
  };

  return (
    <>
      <div className={cx(styles['profile-header'])}>
        <div className={cx(styles['avatar-container'])}>
          <img alt="avatar" src={avatar} className={cx(styles.avatar)} />
        </div>
        <div className={cx(styles['user-info'])}>
          <div className={cx(styles['user-details'])}>
            <span className={cx(styles.username)}>{nickname}</span>
            <p className={cx(styles['display-name'])}>{displayName}</p>
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
                {stats.following}
              </span>
              <span className={cx(styles['stat-label'])}>Following</span>
            </div>
            <div className={cx(styles['stat-item'])}>
              <span className={cx(styles['stat-number'])}>
                {stats.followers}
              </span>
              <span className={cx(styles['stat-label'])}>Followers</span>
            </div>
            <div className={cx(styles['stat-item'])}>
              <span className={cx(styles['stat-number'])}>{stats.likes}</span>
              <span className={cx(styles['stat-label'])}>Likes</span>
            </div>
          </div>

          <p className={cx(styles.bio)}>{bio}</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={userProfile}
      />
    </>
  );
}

export default ProfileHeader;
