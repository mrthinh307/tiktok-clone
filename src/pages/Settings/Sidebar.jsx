import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import MenuItem from '~/components/Popper/Menu/MenuItem';
import { SETTING_SIDEBAR_ITEMS, SETTING_SIDEBAR_ITEM_PROPS } from './constants';

const cx = classNames.bind(styles);

const Sidebar = memo(function Sidebar({ activeSidebar, onItemClick }) {
  const renderedSidebars = useMemo(() => {
    return SETTING_SIDEBAR_ITEMS.map((item, index) => (
      <MenuItem
        key={index}
        data={item}
        active={activeSidebar === index}
        onClick={() => onItemClick(index)}
        {...SETTING_SIDEBAR_ITEM_PROPS}
      />
    ));
  }, [activeSidebar, onItemClick]);

  return (
    <nav className={cx('setting-sidebar')}>
      <div className={cx('sidebar-container')}>{renderedSidebars}</div>
    </nav>
  );
});

Sidebar.propTypes = {
  activeSidebar: PropTypes.number.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default Sidebar;
