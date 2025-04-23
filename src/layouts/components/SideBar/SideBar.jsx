import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import Button from '~/components/Button';
import {
    DarkLogoIcon,
    OnlyDarkLogoIcon,
    SearchIcon,
} from '~/assets/images/icons';

const cx = classNames.bind(styles);

function SideBar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const drawerRef = useRef(null);

    // Control animation of drawer base on isCollapsed
    useEffect(() => {
        if (isCollapsed) {
            // Make sure drawer is mounted before adding show class for animation to work properly
            setShowDrawer(true);
            // Add a small amount of time for DOM to update
            setTimeout(() => {
                if (drawerRef.current) {
                    drawerRef.current.classList.add(cx('show'));
                }
            }, 50);
        } else {
            // Firstly remove show class to animate before unmount
            if (drawerRef.current) {
                drawerRef.current.classList.remove(cx('show'));
                // Waiting for animation finished then unmount
                setTimeout(() => {
                    setShowDrawer(false);
                }, 400);
            } else {
                setShowDrawer(false);
            }
        }
    }, [isCollapsed]);

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
                <header className={cx('header-wrapper')}>
                    <div className={cx('header-logo')}>
                        <Link to="/">
                            {!isCollapsed ? (
                                <DarkLogoIcon className={cx('logo')} />
                            ) : (
                                <OnlyDarkLogoIcon className={cx('logo')} />
                            )}
                        </Link>
                    </div>
                    <div className={cx('search-container')}>
                        <Button
                            rounded
                            buttonPadding={'none'}
                            leftIcon={<SearchIcon />}
                            iconSize={'small'}
                            titleSize={'small'}
                            className={cx('search-btn')}
                            // Collapse the sidebar when clicking on search button
                            onClick={() => setIsCollapsed(!isCollapsed)} 
                            collapsed={isCollapsed}
                        >
                            Search
                        </Button>
                    </div>
                </header>
            </div>
            {showDrawer && <DrawerContainer />}
        </aside>
    );
}


export default memo(SideBar);
