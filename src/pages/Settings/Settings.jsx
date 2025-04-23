import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import ContentItem from './ContentItem';
import { useState, useRef } from 'react';
import { ArrowBackIcon } from '~/assets/images/icons';
import { SETTING_CONTENT_ITEMS } from './constants';
import Sidebar from './Sidebar';

const cx = classNames.bind(styles);

function Settings() {
    const [activeSidebar, setActiveSidebar] = useState(0);

    const contentRefs = useRef([]);

    const handleSidebarClick = (index) => {
        setActiveSidebar(index);

        if (contentRefs.current[index]) {
            contentRefs.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const renderContents = (items) => {
        return items.map((item, index) => (
            <div
                key={index}
                ref={(el) => (contentRefs.current[index] = el)}
                className={cx('content-section')}
            >
                <ContentItem data={item} />
            </div>
        ));
    };

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
                        {renderContents(SETTING_CONTENT_ITEMS)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
