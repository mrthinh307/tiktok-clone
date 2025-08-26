import { useState, useEffect } from 'react';
import cx from 'clsx';
import styles from './FollowersModal.module.scss';
import { CloseIcon, BlueTickIcon } from '~/assets/images/icons';
import { useAuth } from '~/contexts/AuthContext';
import { useSocialInteraction } from '~/contexts/SocialInteractionContext';
import { usePreventBodyScroll } from '~/hooks';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { TiktokLoading } from '~/components/Animations';

function FollowersModal({
  isOpen,
  onClose,
  profile,
  initialTab,
  followingUsers = [],
  followersUsers = [],
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [displayUsers, setDisplayUsers] = useState([]);
  const { user } = useAuth();
  const {
    isLoading,
    fetchFollowingUsers,
    fetchFollowersUsers,
    followingUsers: contextFollowingUsers,
    followersUsers: contextFollowersUsers,
    isFollowing,
    handleToggleFollow,
  } = useSocialInteraction();

  // Prevent body scroll when modal is open
  usePreventBodyScroll(isOpen);

  // Update activeTab when initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Fetch data when modal opens or tab changes
  useEffect(() => {
    if (!isOpen || !profile?.id) return;

    const fetchInitialData = async () => {
      try {
        if (activeTab === 'following' && !contextFollowingUsers[profile.id]) {
          await fetchFollowingUsers(profile.id);
        } else if (
          activeTab === 'followers' &&
          !contextFollowersUsers[profile.id]
        ) {
          await fetchFollowersUsers(profile.id);
        }
      } catch (error) {
        toast.error(`Failed to load ${activeTab}`);
      }
    };

    fetchInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    activeTab,
    profile?.id,
    contextFollowingUsers,
    contextFollowersUsers,
  ]);

  // Update display users when tab changes or data changes
  useEffect(() => {
    const currentFollowingData =
      contextFollowingUsers[profile?.id] || followingUsers;
    const currentFollowersData =
      contextFollowersUsers[profile?.id] || followersUsers;

    if (activeTab === 'following') {
      setDisplayUsers(currentFollowingData);
    } else if (activeTab === 'followers') {
      setDisplayUsers(currentFollowersData);
    } else {
      setDisplayUsers([]); // Friends tab - implement later
    }
  }, [
    activeTab,
    followingUsers,
    followersUsers,
    contextFollowingUsers,
    contextFollowersUsers,
    profile?.id,
  ]);

  // Handle tab change with data fetching
  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);
  };

  if (!isOpen) return null;

  const tabs = [
    {
      id: 'following',
      label: 'Following',
      count: profile?.followings_count || 0,
    },
    {
      id: 'followers',
      label: 'Followers',
      count: profile?.followers_count || 0,
    },
  ];

  const handleFollowClick = async (userId) => {
    try {
      await handleToggleFollow(userId);
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  return (
    <div className={cx(styles.overlay)} onClick={onClose}>
      <div className={cx(styles.modal)} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={cx(styles.header)}>
          <h2 className={cx(styles.title)}>{profile?.nickname || 'tc009'}</h2>
          <button className={cx(styles.closeBtn)} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Tabs */}
        <div className={cx(styles.tabsContainer)}>
          <div className={cx(styles.tabs)}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={cx(styles.tab, {
                  [styles.active]: activeTab === tab.id,
                })}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className={cx(styles.tabLabel)}>{tab.label}</span>
                {tab.count !== null && (
                  <span className={cx(styles.tabCount)}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
          <div className={cx(styles.tabIndicator)} />
        </div>

        {/* Content */}
        <div className={cx(styles.content)}>
          {!isLoading ? (
            displayUsers.length > 0 ? (
              displayUsers.map((userData) => (
                <div key={userData.id} className={cx(styles.userItem)}>
                  <Link
                    to={`/user/${userData.nickname}`}
                    className={cx(styles.userInfo)}
                    onClick={onClose}
                  >
                    <div className={cx(styles.avatarContainer)}>
                      <img
                        src={userData.avatar_url}
                        alt={userData.nickname}
                        className={cx(styles.avatar)}
                      />
                    </div>
                    <div className={cx(styles.userDetails)}>
                      <div className={cx(styles.nicknameRow)}>
                        <span className={cx(styles.nickname)}>
                          {userData.nickname}
                        </span>
                        {userData.tick && (
                          <BlueTickIcon className={cx(styles.blueTick)} />
                        )}
                      </div>
                      <div className={cx(styles.fullName)}>
                        {userData.fullName}
                      </div>
                    </div>
                  </Link>

                  {/* Follow Button - Don't show for current user */}
                  {userData.id !== user?.sub && (
                    <button
                      className={cx(styles.followBtn, {
                        [styles.following]: isFollowing(userData.id),
                      })}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFollowClick(userData.id);
                      }}
                    >
                      {isFollowing(userData.id) ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className={cx(styles.emptyState)}>
                <p>No {activeTab} yet</p>
              </div>
            )
          ) : (
            <div className={cx(styles.loadingState)}>
              <TiktokLoading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowersModal;
