import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import MenuItem from '~/components/Popper/Menu/MenuItem';
import { SETTING_SIDEBAR_ITEMS, SETTING_SIDEBAR_ITEM_PROPS } from './constants';

const cx = classNames.bind(styles);

function Sidebar({ activeSidebar, onItemClick }) {
    const renderSidebars = (items) => {
        return items.map((item, index) => (
            <MenuItem
                key={index}
                data={item}
                active={activeSidebar === index}
                onClick={() => onItemClick(index)}
                {...SETTING_SIDEBAR_ITEM_PROPS}
            />
        ));
    };

    return (
        <nav className={cx('setting-sidebar')}>
            <div className={cx('sidebar-container')}>
                {renderSidebars(SETTING_SIDEBAR_ITEMS)}
            </div>
        </nav>
    );
}

Sidebar.propTypes = {
    activeSidebar: PropTypes.number.isRequired,
    onItemClick: PropTypes.func.isRequired,
};

export default Sidebar;
