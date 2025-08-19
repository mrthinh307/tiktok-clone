import { useParams } from 'react-router-dom';
import { useState } from 'react';
import cx from 'clsx';
import styles from './Profile.module.scss';
import useSlidingTabs from '~/hooks/useSlidingTabs';
import { RepostsEmpty, LikedEmpty, ProfileHeader } from './components';
import {
  LikedIcon,
  PlayOutlineIcon,
  RepostIcon,
  VideoListIcon,
} from '~/assets/images/icons';
import VideosEmpty from './components/EmptyState/VideosEmpty';

function Profile() {
  const { nickname } = useParams();
  const [activeTab, setActiveTab] = useState('videos');

  // Custom hook for sliding tabs animation
  const { navTabsRef, handleTabHover, handleNavLeave } =
    useSlidingTabs(activeTab);

  // Mock video data
  const videos = [
    {
      id: 1,
      thumbnail:
        'https://p16-sign-sg.tiktokcdn.com/tos-alisg-i-photomode-sg/8d56635191da4ee7b26d9fbc8afaf890~tplv-photomode-image.jpeg?dr=14555&x-expires=1755759600&x-signature=OazyobcpzRW0zRz0p9e%2Fm%2FEnqAU%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=my&ftpl=1',
      views: '283.7K',
      isPinned: true,
      title: '7 LỐI KHUYÊN DÀNH CHO BẠN NẾU BẠN MUỐN HỌC TIẾNG ANH LẠI TỪ ĐẦU',
    },
    {
      id: 2,
      thumbnail:
        'https://p16-sign-sg.tiktokcdn.com/tos-alisg-v-2774/oUAAEn5O0wJ~tplv-tiktokx-360p.jpeg',
      views: '430.5K',
      isPinned: true,
      title: 'Mình Đã Tự Học Speaking Như Thế Nào?',
    },
    {
      id: 3,
      thumbnail:
        'https://p16-sign-sg.tiktokcdn.com/tos-alisg-v-2774/oUAAEn5O0wJ~tplv-tiktokx-360p.jpeg',
      views: '245.1K',
      isPinned: true,
      title: 'Top Những Sai Khuyêt Khi Học Speaking Tiếng Anh',
    },
    {
      id: 4,
      thumbnail:
        'https://p16-sign-sg.tiktokcdn.com/tos-alisg-v-2774/oUAAEn5O0wJ~tplv-tiktokx-360p.jpeg',
      views: '6524',
      isPinned: false,
    },
    {
      id: 5,
      thumbnail:
        'https://p16-sign-sg.tiktokcdn.com/tos-alisg-v-2774/oUAAEn5O0wJ~tplv-tiktokx-360p.jpeg',
      views: '27.1K',
      isPinned: false,
    },
    {
      id: 6,
      thumbnail:
        'https://p16-sign-sg.tiktokcdn.com/tos-alisg-v-2774/oUAAEn5O0wJ~tplv-tiktokx-360p.jpeg',
      views: '3018',
      isPinned: false,
    },
  ];

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
      id: 'liked',
      label: 'Liked',
      icon: <LikedIcon />,
    },
  ];

  return (
    <div className={cx(styles['profile-container'])}>
      <div className={cx(styles['profile-wrapper'])}>
        <div className={cx(styles['profile-content'])}>
          <ProfileHeader nickname={nickname} />

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

          {/* Video Grid */}
          {activeTab === 'videos' &&
            (videos.length > 0 ? (
              <div className={cx(styles['videos-grid'])}>
                {videos.map((video) => (
                  <div key={video.id} className={cx(styles['video-item'])}>
                    <img
                      src={video.thumbnail}
                      alt={video.title || 'Video thumbnail'}
                      className={cx(styles['video-thumbnail'])}
                    />
                    <div className={cx(styles['video-overlay'])}>
                      <div className={cx(styles['video-stats'])}>
                        <div className={cx(styles['video-stat-item'])}>
                          <PlayOutlineIcon />
                          <span>{video.views}</span>
                        </div>
                      </div>
                    </div>
                    {video.isPinned && (
                      <div className={cx(styles['video-pinned'])}>Pinned</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <VideosEmpty />
            ))}

          {/* Empty state for other tabs */}
          {activeTab === 'reposts' && <RepostsEmpty />}

          {activeTab === 'liked' && <LikedEmpty />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
