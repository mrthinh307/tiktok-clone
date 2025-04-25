import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import { useState, useCallback } from 'react';
import config from '~/config';
import {
    EllipsisIcon,
    ExploreIcon,
    ExploreSolidIcon,
    FollowingIcon,
    FollowingSolidIcon,
    FriendsIcon,
    FriendsSolidIcon,
    HomeIcon,
    HomeSolidIcon,
    InboxRegularIcon,
    InboxSolidIcon,
    LiveIcon,
    MessageReuglarIcon,
    MessageSolidIcon,
    UploadIcon,
    SearchIcon,
} from '~/assets/images/icons';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

const SIDEBAR_MENU_ITEMS = [
    {
        title: 'Search',
        icon: <SearchIcon />,
        activeIcon: <SearchIcon />,
        iconSize: 'small',
        isSearchItem: true,
    },
    {
        title: 'For You',
        to: config.routes.home,
        icon: <HomeIcon />,
        activeIcon: <HomeSolidIcon />,
        iconSize: 'large',
    },
    {
        title: 'Explore',
        to: config.routes.explore,
        icon: <ExploreIcon />,
        activeIcon: <ExploreSolidIcon />,
        iconSize: 'large',
    },
    {
        title: 'Following',
        to: config.routes.following,
        icon: <FollowingIcon />,
        activeIcon: <FollowingSolidIcon />,
        iconSize: 'medium',
    },
    {
        title: 'Friends',
        to: config.routes.friends,
        icon: <FriendsIcon />,
        activeIcon: <FriendsSolidIcon />,
        iconSize: 'large',
    },
    {
        title: 'Upload',
        to: config.routes.upload,
        icon: <UploadIcon />,
        iconSize: 'medium',
    },
    {
        title: 'Activity',
        icon: <InboxRegularIcon />,
        activeIcon: <InboxSolidIcon />,
        iconSize: 'large',
    },
    {
        title: 'Messages',
        to: config.routes.messages,
        icon: <MessageReuglarIcon />,
        activeIcon: <MessageSolidIcon />,
        iconSize: 'medium',
    },
    {
        title: 'LIVE',
        to: config.routes.live,
        icon: (
            <div className={cx('live-icon-wrapper')}>
                <LiveIcon />
                <img
                    loading="lazy"
                    alt=""
                    src="https://p9-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/81dbf011111004f2b9b3275b3808a749~tplv-tiktokx-cropcenter:100:100.webp?dr=14579&amp;refresh_token=87c72164&amp;x-expires=1745643600&amp;x-signature=s62m6hGqxMD6ZoCofAfPAlH0JnQ%3D&amp;t=4d5b0474&amp;ps=13740610&amp;shp=a5d48078&amp;shcp=fdd36af4&amp;idc=my"
                    class="css-1zpj2q-ImgAvatar e1e9er4e1"
                ></img>
            </div>
        ),
        iconSize: 'large',
    },
    {
        title: 'Profile',
        to: config.routes.profile,
        icon: (
            <img
                alt="user"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&amp;s"
            />
        ),
        activeIcon: (
            <img
                alt="user"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&amp;s"
            />
        ),
    },
    {
        title: 'More',
        icon: <EllipsisIcon />,
        activeIcon: <EllipsisIcon />,
        iconSize: 'medium',
    },
];

function Menu({ collapsed, onToggleCollapse }) {
    const [activeItemIndex, setActiveItemIndex] = useState(null);
    const hasNonNavLinkActive = activeItemIndex !== null && collapsed;

    const getClickHandler = useCallback((item, index) => {
        if (item.to) {
            return () => {
                setActiveItemIndex(index);
                if (collapsed) {
                    onToggleCollapse();
                }
            };
        } else {
            return () => {
                if (activeItemIndex === index) {
                    setActiveItemIndex(null);
                    if (collapsed) {
                        onToggleCollapse();
                    }
                } else {
                    setActiveItemIndex(index);
                    if (!collapsed) {
                        onToggleCollapse();
                    }
                }
            };
        }
    }, [activeItemIndex, collapsed, onToggleCollapse]);

    return (
        <div className={cx('menu-wrapper')}>
            {SIDEBAR_MENU_ITEMS.map((item, index) => {
                const clickHandler = getClickHandler(item, index);

                return (
                    <MenuItem
                        key={index}
                        title={item.title}
                        to={item.to}
                        icon={item.icon}
                        activeIcon={item.activeIcon}
                        iconSize={item.iconSize || 'large'}
                        collapsed={collapsed}
                        onClick={clickHandler}
                        isActive={activeItemIndex === index}
                        disableNavLinkActive={hasNonNavLinkActive}
                    />
                );
            })}
        </div>
    );
}

Menu.propTypes = {
    collapsed: PropTypes.bool,
    onToggleCollapse: PropTypes.func,
};

export default Menu;
