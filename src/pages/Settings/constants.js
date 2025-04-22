import {
    AdsIcon,
    BusinessIcon,
    ContentPreferencesIcon,
    NotificationIcon,
    PrivacyIcon,
    ProfileIcon,
    ScreenTimeIcon,
} from '~/assets/images/icons';
import {
    ClearIcon,
    DisconnectAdsIcon,
    DownArrowIcon,
    InfoIcon,
    ManageAdsIcon,
    MuteAdsIcon,

    RightArrowIcon,
    SettingShareIcon,
    UsingOffIcon,
} from '~/assets/images/icons';
import ToggleButton from '~/components/Button/ToggleButton';


export const SETTING_SIDEBAR_ITEMS = [
    {
        icon: <ProfileIcon />,
        title: 'Manage account',
    },
    {
        icon: <PrivacyIcon />,
        title: 'Privacy',
    },
    {
        icon: <NotificationIcon />,
        title: 'Push notifications',
    },
    {
        icon: <BusinessIcon />,
        title: 'Business account',
    },
    {
        icon: <AdsIcon />,
        title: 'Ads',
    },
    {
        icon: <ScreenTimeIcon />,
        title: 'Screen time',
    },
    {
        icon: <ContentPreferencesIcon />,
        title: 'Content preferences',
    },
];

export const SETTING_SIDEBAR_ITEM_PROPS = {
    buttonSize: 'large',
    iconSize: 'medium',
    titleSize: 'large',
};

export const SETTING_CONTENT_ITEMS = [
    {
        title: 'Manage account',
        items: [
            {
                title: 'Account control',
                children: [
                    {
                        title: 'Delete account',
                        action: {
                            type: 'button',
                            content: 'Delete',
                            onClick: () => {
                                // Handle delete account action
                            },
                        }
                    },
                ],
            },
            {
                title: 'Account information',
                children: [
                    {
                        title: 'Account region',
                        desc: 'Your account region is initially set based on the time and place of registration.',
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            text: 'Vietnam', // This should be dynamic based on the user's account region
                            onClick: () => {
                                // Handle change account region action
                            },
                        }
                    },
                ],
            },
        ],
    },
    {
        title: 'Privacy',
        items: [
            {
                title: 'Discoverability',
                children: [
                    {
                        title: 'Private account',
                        desc: 'With a private account, only users you approve can follow you and watch your videos. Your existing followers won’t be affected.',
                        action: {
                            type: 'toggle-button',
                            content: <ToggleButton />,
                            onClick: () => {
                                // Handle toggle private account action
                            },
                        },
                    },
                ],
            },
            {
                title: 'Data',
                children: [
                    {
                        title: 'Download your data',
                        desc: 'Get a copy of your Tiktok data.',
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            onClick: () => {
                                // Handle download data action
                            },
                        }
                    },
                ],
            },
        ],
    },
    {
        title: 'Push notifications',
        items: [
            {
                title: 'Desktop notifications',
                children: [
                    {
                        title: 'Allow in browser',
                        desc: 'Stay on top of notifications for likes, comments, the latest videos, and more on desktop. You can turn them off anytime.',
                        action: {
                            type: 'toggle-button',
                            content: <ToggleButton />,
                            onClick: () => {
                                // Handle toggle desktop notifications action
                            },
                        },
                    },
                ],
            },
            {
                title: 'Your preferences',
                desc: 'Your preferences will be synced automatically to the TikTok app.',
                children: [
                    {
                        title: 'Interactions',
                        desc: 'Likes, comments, new followers, mentions and tags',
                        action: {
                            type: 'dropdown-icon',
                            content: <DownArrowIcon />,
                            onClick: () => {
                                // Handle interactions action
                            },
                        }
                    },
                ],
            },
            {
                title: 'In-app notifications',
                action: {
                    type: 'dropdown-icon',
                    content: <DownArrowIcon />,
                    onClick: () => {
                        // Handle in-app notifications action
                    },
                }
            },
        ],
    },
    {
        title: 'Business account',
        items: [
            
            {
                title: 'Business account',
                desc: 'Access marketing tools & exclusive features through your business account to better connect with viewers.',
                action: {
                    type: 'toggle-button',
                    content: <ToggleButton />,
                    onClick: () => {
                        // Handle business account action
                    },
                }
            },
            
        ],
    },
    {
        title: 'Ads',
        items: [
            {
                title: 'Manage the ads you see',
                children: [
                    {
                        title: 'Manage ads topics',
                        desc: 'Change factors that influence the ads you see on TikTok.',
                        icon: <ManageAdsIcon />,
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            onClick: () => {
                                // Handle manage ads topics action
                            },
                        }
                    },
                    {
                        title: 'Mute ads',
                        desc: 'Mute ads you don’t want to see.',
                        icon: <MuteAdsIcon />,
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            onClick: () => {
                                // Handle mute ads action
                            },
                        }
                    },
                ],
            },
            {
                title: 'Manage your off-TikTok data',
                children: [
                    {
                        title: 'Using Off-TikTok activity for ad targeting',
                        desc: 'With this setting, the ads you see on TikTok can be more tailored to your interests based on data that advertising partners share with us about your activity on their apps and websites. You will always see ads on TikTok based on what you do on TikTok or other data described in our privacy policy.',
                        icon: <UsingOffIcon />,
                        action: {
                            type: 'toggle-button',
                            content: <ToggleButton />,
                            onClick: () => {
                                // Handle toggle off-TikTok activity for ad targeting action
                            },
                        },
                    },
                    {
                        title: 'Disconect advertising partners',
                        desc: 'Stop sharing your activity with advertising partners.',
                        icon: <DisconnectAdsIcon />,
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            onClick: () => {
                                // Handle disconnect advertising partners action
                            },
                        }
                    },
                    {
                        title: 'Clear off-TikTok data',
                        desc: 'Clear off-TikTok data that advertising partners have shared with us.',
                        icon: <ClearIcon />,
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            onClick: () => {
                                // Handle clear off-TikTok data action
                            },
                        }
                    },
                ],
            },
        ],
    },
    {
        title: 'Screen time',
        tooltip: {
            icon: <InfoIcon />,
            desc: 'Updates to your settings will also appear on the app',
        },
        items: [
            {
                children: [
                    {
                        title: 'Daily screen time',
                        strongTitle: true,
                        desc: 'Get notified if you reach your time on TikTok.',
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            text: 'Off',
                            onClick: () => {
                                // Handle toggle daily screen time action
                            },
                        },
                    },
                    {
                        title: 'Screen time breaks',
                        strongTitle: true,
                        desc: 'Get reminded to take breaks from scrolling.',
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            text: 'Off',
                            onClick: () => {
                                // Handle toggle screen time breaks action
                            },
                        }
                    },
                    {
                        title: 'Sleep reminders',
                        strongTitle: true,
                        desc: 'Get reminded about your sleep time.',
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            text: 'Off',
                            onClick: () => {
                                // Handle toggle sleep reminders action
                            },
                        }
                    },
                    {
                        title: 'Weekly screen time updates',
                        strongTitle: true,
                        desc: 'Stay updated on your time from your Inbox.',
                        action: {
                            type: 'toggle-button',
                            content: <ToggleButton />,
                            onClick: () => {
                                // Handle toggle weekly screen time updates action
                            },
                        }
                    },
                ],
            },
            {
                title: 'Summary',
                desc: 'Your weekly metrics include your time on the app and on tiktok.com.',
                action: {
                    type: 'dropdown-icon',
                    content: <DownArrowIcon />,
                    onClick: () => {
                        // Handle view summary action
                    }
                },
                children: [
                    {
                        title: 'Help and resources',
                        strongTitle: true,
                        desc: 'Digital wellbeing tips',
                        action: {
                            type: 'icon',
                            content: <SettingShareIcon />,
                            onClick: () => {
                                // Handle help and resources action
                            },
                        }
                    }
                ]
            }
        ],
    },
    {
        title: 'Content preferences',
        items: [
            {
                children: [
                    {
                        title: 'Filter keywords',
                        desc: 'When you filter a keyword, you won’t see posts in your selected feeds that contain that word in any titles, descriptions, or stickers. Certain keywords can’t be filtered.',
                        action: {
                            type: 'arrow-icon',
                            content: <RightArrowIcon />,
                            onClick: () => {
                                // Handle filter keywords action
                            }
                        }
                    }
                ]
            }
        ],
    },
];
