import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import { useState, memo, useCallback, useMemo, useRef } from 'react';

import { Link } from 'react-router-dom';
import config from '~/config';
import Menu from './Menu';
import { useDrawer } from '~/hooks';
import DrawerContainer from './DrawContainer';
import { DarkLogoIcon, OnlyDarkLogoIcon } from '~/assets/images/icons';

const cx = classNames.bind(styles);

function SideBar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentMenuTitle, setCurrentMenuTitle] = useState({});
    const menuRef = useRef(null);

    const drawerOptions = useMemo(() => ({
        className: cx('show'),
        animationDuration: 400,
        animationDelay: 50
    }), []);

    const { showDrawer, drawerRef } = useDrawer(isCollapsed, drawerOptions);

    const handleToggleCollapse = useCallback(() => {
        setIsCollapsed(prevState => !prevState);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsCollapsed(false);
        // deactivate index of menu item
        if (menuRef.current && typeof menuRef.current.deactivateItems === 'function') {
            menuRef.current.deactivateItems();
        }
    }, []);

    const handleMenuTitleChange = useCallback((title, index) => {
        setCurrentMenuTitle({
            title,
            index
        });
    }, []);

    const menuProps = useMemo(() => ({
        collapsed: isCollapsed,
        onToggleCollapse: handleToggleCollapse,
        onSetTitle: handleMenuTitleChange,
        ref: menuRef,
    }), [isCollapsed, handleToggleCollapse, handleMenuTitleChange]);

    const drawerProps = useMemo(() => ({
        onClose: handleCloseDrawer,
        titleData: currentMenuTitle
    }), [handleCloseDrawer, currentMenuTitle]);

    return (
        <aside className={cx('wrapper', { collapsed: isCollapsed })}>
            <div className={cx('container')}>
                <Link to={config.routes.home} className={cx('header-logo')}>
                    {!isCollapsed ? (
                        <DarkLogoIcon className={cx('logo')} />
                    ) : (
                        <OnlyDarkLogoIcon className={cx('logo')} />
                    )}
                </Link>
                <Menu
                    {...menuProps}
                />
                {showDrawer && <DrawerContainer ref={drawerRef} {...drawerProps} />}
            </div>
        </aside>
    );
}

export default memo(SideBar);
