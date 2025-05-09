import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import { useState, memo, useCallback, useMemo, useRef, useEffect } from 'react';

import { Link } from 'react-router-dom';
import config from '~/config';
import Menu from './Menu';
import { useDrawer } from '~/hooks';
import DrawerContainer from './DrawContainer';
import { DarkLogoIcon, OnlyDarkLogoIcon } from '~/assets/images/icons';
import Button from '~/components/Button';
import { useAuth } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

function SideBar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isResponsiveCollapsed, setIsResponsiveCollapsed] = useState(false);
    const [currentMenuTitle, setCurrentMenuTitle] = useState({});
    const menuRef = useRef(null);
    const sidebarRef = useRef(null);

    const drawerOptions = useMemo(
        () => ({
            className: cx('show'),
            animationDuration: 400,
            animationDelay: 50,
        }),
        [],
    );

    const { showDrawer, drawerRef } = useDrawer(isCollapsed, drawerOptions);
    const { toggleLoginForm } = useAuth();

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsResponsiveCollapsed(window.innerWidth < 1024);
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleToggleCollapse = useCallback(() => {
        setIsCollapsed((prevState) => !prevState);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsCollapsed(false);
        // deactivate index of menu item
        if (
            menuRef.current &&
            typeof menuRef.current.deactivateItems === 'function'
        ) {
            menuRef.current.deactivateItems();
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isCollapsed && !sidebarRef.current?.contains(event.target)) {
                handleCloseDrawer();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCollapsed, handleCloseDrawer]);

    const handleMenuTitleChange = useCallback((title, index) => {
        setCurrentMenuTitle({
            title,
            index,
        });
    }, []);

    const menuProps = useMemo(
        () => ({
            collapsed: isCollapsed,
            onToggleCollapse: handleToggleCollapse,
            onSetTitle: handleMenuTitleChange,
            ref: menuRef,
        }),
        [isCollapsed, handleToggleCollapse, handleMenuTitleChange],
    );

    const drawerProps = useMemo(
        () => ({
            onClose: handleCloseDrawer,
            titleData: currentMenuTitle,
        }),
        [handleCloseDrawer, currentMenuTitle],
    );

    const handleLoginButtonClick = useCallback(() => {
        toggleLoginForm();
    }, [toggleLoginForm]);

    return (
        <aside
            className={cx('wrapper', { collapsed: isCollapsed })}
            ref={sidebarRef}
        >
            <div className={cx('container')}>
                <Link to={config.routes.home} className={cx('header-logo')}>
                    {!isCollapsed && !isResponsiveCollapsed ? (
                        <DarkLogoIcon className={cx('logo')} />
                    ) : (
                        <OnlyDarkLogoIcon className={cx('logo')} />
                    )}
                </Link>
                <Menu {...menuProps} />
                <Button
                    primary
                    className={cx('login-btn')}
                    onClick={handleLoginButtonClick}
                >
                    Log in
                </Button>
                {showDrawer && (
                    <DrawerContainer ref={drawerRef} {...drawerProps} />
                )}
            </div>
        </aside>
    );
}

export default memo(SideBar);
