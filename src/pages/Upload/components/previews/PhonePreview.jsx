import React from 'react';
import classNames from 'classnames/bind';
import styles from '../../Upload.module.scss';

const cx = classNames.bind(styles);

const PhonePreview = React.memo(
  ({ videoUrl, description, user, isVertical }) => {
    const tabs = ['Feed', 'Profile', 'Web/TV'];
    const [currentTab, setCurrentTab] = React.useState('Feed');

    return (
      <div className={cx('preview-section')}>
        {/* Preview Tabs */}
        <div className={cx('preview-tabs')}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={cx('tab-button', {
                active: currentTab === tab,
              })}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Phone Preview */}
        <div className={cx('phone-preview')}>
          <div className={cx('phone-frame')}>
            <div className={cx('phone-header')}>
              <img src="/images/header-phone.png" alt="header-phone" />
              <img src="/images/header-tiktok-phone.png" alt="header-tiktok" />
            </div>
            <div className={cx('video-overlay-container')}>
              <video
                src={videoUrl}
                className={cx('video-overlay', {
                  'vertical-video': isVertical,
                })}
                autoPlay
                muted
                loop
              />
              <div className={cx('sidebar-overlay')}>
                <div className={cx('avatar-container')}>
                  <img src={user.avatar_url} alt="avatar" />
                </div>
                <img
                  src="/images/sidebar-tiktok-phone.png"
                  alt="sidebar-tiktok-phone"
                  className={cx('sidebar-item')}
                ></img>
                <div className={cx('music-container')}>
                  <img
                    src="https://avatar-ex-swe.nixcdn.com/song/2024/09/17/i/O/M/T/1726557845569_640.jpg"
                    alt="sound-default"
                  />
                </div>
              </div>
              <div className={cx('meta-data-overlay')}>
                <div className={cx('username')}>
                  <strong>{user.nickname}</strong>
                </div>
                <div className={cx('description')}>{description}</div>
              </div>
              <div className={cx('nav-bar-overlay')}>
                <img src="/images/no-hope.jpg" alt="nav-bar-tiktok-phone" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default PhonePreview;
