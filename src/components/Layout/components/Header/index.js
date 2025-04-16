import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

import styles from './Header.module.scss';
import { InboxIcon, MessageIcon, PlusIcon, DarkLogoIcon } from '~/assets/images/icons';

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner-content')}>
                <div className={cx('logo')}>
                    <DarkLogoIcon className={cx('logo-icon')} />
                </div>
                <div className={cx('search')}>
                    <input placeholder="Seach" spellCheck={false} />
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
                <div className={cx('action')}>
                    <a href="#" className={cx('action-upload')}>
                        <PlusIcon className={cx('plus')} />
                        <span>Upload</span>
                    </a>
                    <a href="#" className={cx('action-message')}>
                        <MessageIcon className={cx('message')} />
                    </a>
                    <a href="#" className={cx('action-inbox')}>
                        <InboxIcon className={cx('inbox')} />
                    </a>
                    <div className={cx('action-user')}>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&s"
                            alt="user"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
