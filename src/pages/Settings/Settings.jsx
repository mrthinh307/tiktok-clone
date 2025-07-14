import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import ContentItem from './ContentItem';
import { useState, useRef, useCallback, useMemo } from 'react';
import { ArrowBackIcon } from '~/assets/images/icons';
import { SETTING_CONTENT_ITEMS } from './constants';
import Sidebar from './Sidebar';

const cx = classNames.bind(styles);

function Settings() {
  const [activeSidebar, setActiveSidebar] = useState(0);

  const contentRefs = useRef([]);

  const handleSidebarClick = useCallback((index) => {
    setActiveSidebar(index);

    if (contentRefs.current[index]) {
      contentRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  const renderedContents = useMemo(() => {
    return SETTING_CONTENT_ITEMS.map((item, index) => (
      <div
        key={index}
        ref={(el) => {
          contentRefs.current[index] = el;
        }}
        className={cx('content-section')}
      >
        <ContentItem data={item} />
      </div>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SETTING_CONTENT_ITEMS]);

  return (
    <div className={cx('setting-wrapper')}>
      <div className={cx('setting-container')}>
        <ArrowBackIcon className={cx('back-button')} />
        <div className={cx('setting-main')}>
          <Sidebar
            activeSidebar={activeSidebar}
            onItemClick={handleSidebarClick}
          />
          <div className={cx('setting-content', 'hide-scrollbar')}>
            {renderedContents}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
