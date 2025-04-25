import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import { Link } from 'react-router-dom';
import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';

import config from '~/config';
import {
    InboxSemiBoldIcon,
    MessageSemiBoldIcon,
    PlusIcon,
    DarkLogoIcon,
} from '~/assets/images/icons';
import {
    USER_OPTIONS,
    USER_MENU_BUTTON_PROPS,
} from '~/constants/headerConstants';
import styles from './Header.module.scss';
import Menu from '~/components/Popper/Menu';
import Search from '../Search';

const cx = classNames.bind(styles);

function Header() {
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
                    <Link to={config.routes.home} style={{ cursor: 'pointer' }}>
                        <DarkLogoIcon />
                    </Link>
                </div>

                {/* Search */}
                <Search />

                <div className={cx('action')}>
                    <a href={config.routes.upload} className={cx('action-upload')}>
                        <PlusIcon className={cx('plus')} />
                        <span>Upload</span>
                    </a>
                    <Tippy content="Message" arrow={true} duration={0}>
                        <a href={config.routes.home} className={cx('action-message')}>
                            <MessageSemiBoldIcon className={cx('message')} />
                        </a>
                    </Tippy>
                    <Tippy content="Inbox" arrow={true} duration={0}>
                        <a href={config.routes.home} className={cx('action-inbox')}>
                            <InboxSemiBoldIcon className={cx('inbox')} />
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
