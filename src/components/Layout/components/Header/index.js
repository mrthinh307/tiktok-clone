import { useEffect, useState } from 'react';
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
        title: 'Language',
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
    },
]

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
