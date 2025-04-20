import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';

import {
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import {
    InboxIcon,
    MessageIcon,
    PlusIcon,
    DarkLogoIcon,
    ProfileIcon,
    CoinIcon,
    CreatorIcon,
    SettingIcon,
    LanguageIcon,
    FeedbackIcon,
    DarkModeIcon,
    LogoutIcon,
} from '~/assets/images/icons';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './Header.module.scss';
import AccountItem from '~/components/AccountItem';
import Menu from '~/components/Popper/Menu';

const cx = classNames.bind(styles);

const LANGUAGE_BUTTON_PROPS = {
    titleSize: 'small',
    fontType: 'regular',
};

const USER_OPTIONS = [
    {
        icon: <ProfileIcon />,
        title: 'View profile',
    },
    {
        icon: <CoinIcon />,
        title: 'Get coins',
    },
    {
        icon: <CreatorIcon />,
        title: 'Creator tools',
    },
    {
        icon: <SettingIcon />,
        title: 'Settings',
    },
    {
        icon: <LanguageIcon />,
        title: 'English (US)',
        children: {
            title: 'Language',
            data: [
                {
                    field: 'language',
                    code: 'ar',
                    title: 'Arabic',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'bn',
                    title: 'Bengali',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'bg',
                    title: 'Bulgarian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'my',
                    title: 'Burmese',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'ceb',
                    title: 'Cebuano',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'zh-CN',
                    title: 'Chinese (Simplified)',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'zh-TW',
                    title: 'Chinese (Traditional)',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'hr',
                    title: 'Croatian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'cs',
                    title: 'Czech',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'da',
                    title: 'Danish',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'nl',
                    title: 'Dutch',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'en',
                    title: 'English',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'fil',
                    title: 'Filipino',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'fi',
                    title: 'Finnish',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'fr',
                    title: 'French',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'de',
                    title: 'German',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'el',
                    title: 'Greek',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'gu',
                    title: 'Gujarati',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'hi',
                    title: 'Hindi',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'hu',
                    title: 'Hungarian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'id',
                    title: 'Indonesian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'it',
                    title: 'Italian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'ja',
                    title: 'Japanese',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'jv',
                    title: 'Javanese',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'kn',
                    title: 'Kannada',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'kk',
                    title: 'Kazakh',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'km',
                    title: 'Khmer',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'ko',
                    title: 'Korean',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'lv',
                    title: 'Latvian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'lt',
                    title: 'Lithuanian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'ms',
                    title: 'Malay',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'ml',
                    title: 'Malayalam',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'mr',
                    title: 'Marathi',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'or',
                    title: 'Odia',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'pl',
                    title: 'Polish',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'pt',
                    title: 'Portuguese (Brazilian)',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'pa',
                    title: 'Punjabi',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'ro',
                    title: 'Romanian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'ru',
                    title: 'Russian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'es',
                    title: 'Spanish',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'sv',
                    title: 'Swedish',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'ta',
                    title: 'Tamil',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'te',
                    title: 'Telugu',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'th',
                    title: 'Thai',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'tr',
                    title: 'Turkish',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'uk',
                    title: 'Ukrainian',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'uz',
                    title: 'Uzbek',
                    ...LANGUAGE_BUTTON_PROPS,
                },
                {
                    field: 'language',
                    code: 'vi',
                    title: 'Vietnamese',
                    ...LANGUAGE_BUTTON_PROPS,
                },
            ],
        },
    },
    {
        icon: <FeedbackIcon />,
        title: 'Feedback and help',
    },
    {
        icon: <DarkModeIcon />,
        title: 'Dark mode',
    },
    {
        icon: <LogoutIcon />,
        title: 'Log out',
        seperate: true,
    },
];

const USER_MENU_BUTTON_PROPS = {
    buttonSize: 'medium',
    iconSize: 'small',
    hoverType: 'background',
    hiddenDelayTime: 700,
};

function Header() {
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setSearchResult([1, 2, 3]);
    //     }, 0);
    // }, []);

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleInputFocus = () => {
        setShowResult(true);
    };

    const handleMenuChange = (menuItem) => {
        switch (menuItem.field) {
            default:
                break;
        }
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner-content')}>
                <div className={cx('logo')}>
                    <DarkLogoIcon />
                </div>
                <HeadlessTippy
                    interactive={true}
                    visible={searchResult.length > 0 || showResult}
                    appendTo={() => document.body}
                    render={(attrs) => (
                        <div
                            className={cx('search-result')}
                            tabIndex="-1"
                            {...attrs}
                        >
                            <PopperWrapper>
                                <h4 className={cx('search-title')}>Accounts</h4>
                                <div className={cx('accounts-list')}>
                                    <AccountItem />
                                    <AccountItem />
                                    <AccountItem />
                                    <AccountItem />
                                    <AccountItem />
                                    <AccountItem />
                                    <AccountItem />
                                    <AccountItem />
                                    <AccountItem />
                                </div>
                            </PopperWrapper>
                        </div>
                    )}
                    onClickOutside={handleHideResult}
                >
                    <div className={cx('search')}>
                        <input
                            value={searchResult}
                            onChange={(e) => setSearchResult(e.target.value)}
                            placeholder="Seach"
                            spellCheck={false}
                            onFocus={handleInputFocus}
                        />
                        <button className={cx('clear')}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                        <FontAwesomeIcon
                            className={cx('loading')}
                            icon={faSpinner}
                        />

                        <button className={cx('search-btn')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                </HeadlessTippy>
                <div className={cx('action')}>
                    <a href="/" className={cx('action-upload')}>
                        <PlusIcon className={cx('plus')} />
                        <span>Upload</span>
                    </a>
                    <Tippy content="Message" arrow={true} duration={0}>
                        <a href="/" className={cx('action-message')}>
                            <MessageIcon className={cx('message')} />
                        </a>
                    </Tippy>
                    <Tippy content="Inbox" arrow={true} duration={0}>
                        <a href="/" className={cx('action-inbox')}>
                            <InboxIcon className={cx('inbox')} />
                        </a>
                    </Tippy>

                    <Menu
                        items={USER_OPTIONS}
                        {...USER_MENU_BUTTON_PROPS}
                        onChange={handleMenuChange}
                    >
                        <div className={cx('action-user')}>
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&s"
                                alt="user"
                            />
                        </div>
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
