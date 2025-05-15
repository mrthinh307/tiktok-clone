import { LiveIcon, LiveSolidIcon, RightArrowIcon } from '~/assets/images/icons';
import { LANGUAGE_LISTS } from '~/constants/headerConstants';
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
    MessageReuglarIcon,
    MessageSolidIcon,
    UploadIcon,
    SearchIcon,
} from '~/assets/images/icons';
import { DEFAULT_AVATAR } from './common';

export const SIDEBAR_MENU_ITEMS = [
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
        icon: <LiveIcon />,
        activeIcon: <LiveSolidIcon />,
        // icon: (
        //     <div className={cx('live-icon-wrapper')}>
        //         <LiveFrameIcon />
        //         <img
        //             loading="lazy"
        //             alt=""
        //             src="https://p9-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/81dbf011111004f2b9b3275b3808a749~tplv-tiktokx-cropcenter:100:100.webp?dr=14579&amp;refresh_token=87c72164&amp;x-expires=1745643600&amp;x-signature=s62m6hGqxMD6ZoCofAfPAlH0JnQ%3D&amp;t=4d5b0474&amp;ps=13740610&amp;shp=a5d48078&amp;shcp=fdd36af4&amp;idc=my"
        //             class="css-1zpj2q-ImgAvatar e1e9er4e1"
        //         ></img>
        //     </div>
        // ),
        iconSize: 'large',
    },
    {
        title: 'Profile',
        to: config.routes.profile,
        icon: (
            <img
                alt="user"
                src={DEFAULT_AVATAR}
            />
        ),
        activeIcon: (
            <img
                alt="user"
                src={DEFAULT_AVATAR}
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

export const DARK_MODE_LISTS = [
    {
        title: 'Automatic',
    },
    {
        title: 'Dark mode',
    },
    {
        title: 'Light mode',
    },
]

export const CREATOR_TOOLS_LISTS = [
    {
        title: 'Promote post',
    },
    {
        title: 'View Analytics',
    },
    {
        title: 'LIVE Creator Hub',
    },
    {
        title: 'LIVE Studio',
    },
]

export const MORE_CONTENTS = [
    {
        title: 'Get Coins',
    },
    {
        title: 'Create TikTok effects',
    },
    {
        title: 'Creator tools',
        icon: <RightArrowIcon />,
        children: {
            title: 'Creator tools',
            data: CREATOR_TOOLS_LISTS,
        },
    },
    {
        title: 'English (US)',
        icon: <RightArrowIcon />,
        children: {
            title: 'Language',
            data: LANGUAGE_LISTS,
        },
    },
    {
        title: 'Dark mode',
        icon: <RightArrowIcon />,
        children: {
            title: 'Theme mode',
            data: DARK_MODE_LISTS,
        },
    },
    {
        title: 'Settings',
    },
    {
        title: 'Feedback and help',
    },
    {
        title: 'Log out',
        field: 'logout',
        separate: true,
    },
];

export const UNAUTHENTICATED_SIDEBAR_MENU_ITEMS = [
    'Search',
    'For You',
    'Explore',
    'Following',
    'LIVE',
    'More',
];

export const UNAUTHENTICATED_MORE_CONTENTS = [
    'Create TikTok effects',
    'Creator tools',
    'English (US)',
    'Dark mode',
    'Feedback and help',
    ...LANGUAGE_LISTS.map(item => item.title),
    ...DARK_MODE_LISTS.map(item => item.title),
    ...CREATOR_TOOLS_LISTS.map(item => item.title),
]