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
import { useAuth } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

function Header() {
  const { user } = useAuth();

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
        <Search dropdownMenu={true} />

        <div className={cx('action')}>
          {!window.location.href.includes('/upload') && (
            <Link to={config.routes.upload} className={cx('action-upload')}>
              <PlusIcon className={cx('plus')} />
              <span>Upload</span>
            </Link>
          )}
          <Tippy content="Message" arrow={true} duration={0}>
            <Link to={config.routes.messages} className={cx('action-message')}>
              <MessageSemiBoldIcon className={cx('message')} />
            </Link>
          </Tippy>
          <Tippy content="Inbox" arrow={true} duration={0}>
            <Link to={config.routes.inbox} className={cx('action-inbox')}>
              <InboxSemiBoldIcon className={cx('inbox')} />
            </Link>
          </Tippy>

          <Menu
            items={USER_OPTIONS}
            {...USER_MENU_BUTTON_PROPS}
            onChange={handleMenuChange}
          >
            <div className={cx('action-user')}>
              <img
                src={
                  user?.avatar_url ||
                  'https://www.svgrepo.com/show/508699/user.svg'
                }
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
