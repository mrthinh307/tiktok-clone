import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DarkLogoIcon, OnlyDarkLogoIcon } from '~/assets/images/icons';
import config from '~/config';
import Menu from './Menu';
import { useDrawer } from '~/hooks';

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

    const DrawerContainer = function DrawerContainer() {
        return (
            <div ref={drawerRef} className={cx('drawer-container')}>
                Hello World
            </div>
        );
    };

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
                {showDrawer && <DrawerContainer />}
            </div>
        </aside>
    );
}

export default memo(SideBar);
