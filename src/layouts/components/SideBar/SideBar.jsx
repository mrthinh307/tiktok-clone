import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DarkLogoIcon, OnlyDarkLogoIcon } from '~/assets/images/icons';
import config from '~/config';
import Menu from './Menu';
import { useDrawer } from '~/hooks';
import DrawerContainer from './DrawContainer';

const cx = classNames.bind(styles);

function SideBar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { showDrawer, drawerRef } = useDrawer(isCollapsed, {
        className: cx('show'),
        animationDuration: 400,
        animationDelay: 50
    });

    const handleToggleCollapse = useCallback(() => {
        setIsCollapsed(prevState => !prevState);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsCollapsed(false);
    }, []);

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
                    collapsed={isCollapsed}
                    onToggleCollapse={handleToggleCollapse}
                />
                {showDrawer && <DrawerContainer ref={drawerRef} onClose={handleCloseDrawer} />}
            </div>
        </aside>
    );
}

export default memo(SideBar);
