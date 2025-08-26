import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import cx from 'clsx';
import styles from './Profile.module.scss';
import { useSlidingTabs, useVideosProfile } from '~/hooks';
import {
  RepostsEmpty,
  LikedEmpty,
  ProfileHeader,
  ProfileHeaderSkeleton,
  VideosEmpty,
  FavouritesEmpty,
  VideoGrid,
} from './components';
import {
  FavouriteIcon,
  LikedIcon,
  RepostIcon,
  VideoListIcon,
} from '~/assets/images/icons';
import supabase from '~/config/supabaseClient';

function Profile() {
  const { nickname } = useParams();
  const [activeTab, setActiveTab] = useState('videos');
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  // Custom hooks
  const { navTabsRef, handleTabHover, handleNavLeave } = useSlidingTabs(activeTab);
  const { videos, loading: loadingVideos } = useVideosProfile(profile?.id, activeTab);
  
  // Overall loading state: loading profile OR loading videos (when profile exists)
  const isLoading = loadingProfile || (profile?.id && loadingVideos);

  useEffect(() => {
    if (!nickname) return;

    const ac = new AbortController();

    (async () => {
      setLoadingProfile(true);

      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('nickname', nickname)
        .maybeSingle();

      if (ac.signal.aborted) return;

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data ?? null);
      }

      setLoadingProfile(false);

      return () => {
        ac.abort();
      };
    })();
  }, [nickname]);

  const tabs = [
    {
      id: 'videos',
      label: 'Videos',
      icon: <VideoListIcon />,
    },
    {
      id: 'reposts',
      label: 'Reposts',
      icon: <RepostIcon />,
    },
    {
      id: 'favourites',
      label: 'Favourites',
      icon: <FavouriteIcon />,
    },
    {
      id: 'liked',
      label: 'Liked',
      icon: <LikedIcon />,
    },
  ];

  return (
    <div className={cx(styles['profile-container'])}>
      <div className={cx(styles['profile-wrapper'])}>
        <div className={cx(styles['profile-content'])}>
          {/* Profile Header with Loading State */}
          {loadingProfile || !profile ? (
            <ProfileHeaderSkeleton />
          ) : (
            <ProfileHeader profile={profile} />
          )}

          {/* Navigation Tabs */}
          <div
            ref={navTabsRef}
            className={cx(styles['nav-tabs'])}
            onMouseLeave={handleNavLeave}
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                data-tab={tab.id}
                className={cx(styles['nav-tab'], {
                  [styles.active]: activeTab === tab.id,
                })}
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={handleTabHover}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            ))}
          </div>

          {/* Video Grid for Videos Tab */}
          {activeTab === 'videos' && (
            <VideoGrid
              videos={videos}
              loading={isLoading}
              hoveredVideo={hoveredVideo}
              setHoveredVideo={setHoveredVideo}
              EmptyComponent={VideosEmpty}
            />
          )}

          {/* Video Grid for Liked Tab */}
          {activeTab === 'liked' && (
            <VideoGrid
              videos={videos}
              loading={isLoading}
              hoveredVideo={hoveredVideo}
              setHoveredVideo={setHoveredVideo}
              EmptyComponent={LikedEmpty}
            />
          )}

          {/* Empty state for other tabs */}
          {activeTab === 'reposts' && <RepostsEmpty />}

          {activeTab === 'favourites' && <FavouritesEmpty />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
