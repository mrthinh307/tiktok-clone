import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import { useState } from 'react';
import MenuItem from '~/components/Popper/Menu/MenuItem';
import { SETTING_SIDEBAR_ITEMS, SETTING_SIDEBAR_ITEM_PROPS } from './constants';

const cx = classNames.bind(styles);

function Sidebar() {
    const [activeSidebar, setActiveSidebar] = useState(0);

    const renderSidebars = (items) => {
        return (
            items.map((item, index) => (
                <MenuItem
                    key={index}
                    data={item}
                    active={activeSidebar === index}
                    onClick={() => setActiveSidebar(index)}
                    {...SETTING_SIDEBAR_ITEM_PROPS}
                />
            ))
        )
    };

    return (
        <nav className={cx('setting-sidebar')}>
            <div className={cx('sidebar-container')}>
                {renderSidebars(SETTING_SIDEBAR_ITEMS)}
            </div>
        </nav>
    );
}

export default Sidebar;
