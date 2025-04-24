import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import config from '~/config';
import {
    EllipsisIcon,
    ExploreIcon,
    FollowingIcon,
    FriendsIcon,
    HomeIcon,
    InboxIcon,
    LiveIcon,
    MessageIcon,
    UploadIcon,
} from '~/assets/images/icons';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

const SIDEBAR_MENU_ITEMS = [
    {
        title: 'For You',
        to: config.routes.home,
        icon: <HomeIcon />,
        iconSize: 'large',
    },
    {
        title: 'Explore',
        to: config.routes.home,
        icon: <ExploreIcon />,
        iconSize: 'large',
    },
    {
        title: 'Following',
        to: config.routes.home,
        icon: <FollowingIcon />,
        iconSize: 'medium',
    },
    {
        title: 'Friends',
        to: config.routes.home,
        icon: <FriendsIcon />,
        iconSize: 'large',
    },
    {
        title: 'Upload',
        to: config.routes.home,
        icon: <UploadIcon />,
        iconSize: 'medium',
    },
    {
        title: 'Activity',
        to: config.routes.home,
        icon: <InboxIcon />,
        iconSize: 'medium',
    },
    {
        title: 'Messages',
        to: config.routes.home,
        icon: <MessageIcon />,
        iconSize: 'medium',
    },
    {
        title: 'LIVE',
        to: config.routes.home,
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
        to: config.routes.home,
        icon: (
            <img
                alt="user"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&amp;s"
            />
        ),
    },
    {
        title: 'More',
        to: config.routes.home,
        icon: <EllipsisIcon />,
        iconSize: 'medium',
    },
];

function Menu({ collapsed }) {
    return (
        <div className={cx('menu-wrapper')}>
            {SIDEBAR_MENU_ITEMS.map((item, index) => (
                <MenuItem
                    key={index}
                    title={item.title}
                    to={item.to}
                    icon={item.icon}
                    iconSize={item.iconSize || 'large'}
                    collapsed={collapsed}
                />
            ))}
        </div>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Menu;
