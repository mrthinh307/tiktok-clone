import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { Link } from 'react-router-dom';
import {
    BlueTickIcon,
    EllipsisIcon,
} from '~/assets/images/icons';
import Menu from '../Popper/Menu';
import {} from '~/assets/images/icons';
import { createContext } from 'react';
import {
    SEARCH_ACCOUNT_BUTTON_PROPS,
    SEARCH_ACCOUNT_OPTIONS,
} from '~/constants/headerConstants';

const cx = classNames.bind(styles);

export const ConfigureButtonContext = createContext();

function AccountItem({ data }) {


    return (
        <Link to={`/@${data.nickname}`} className={cx('wrapper')}>
            <img className={cx('avatar')} src={data.avatar} alt={data.full_name} />
            <div className={cx('info')}>
                <p className={cx('nickname')}>
                    <strong>{data.nickname}</strong>
                    {data.tick && <BlueTickIcon className={cx('blue-tick')} />}
                </p>
                <p className={cx('name')}>{data.full_name}</p>
            </div>
            <Menu
                items={SEARCH_ACCOUNT_OPTIONS}
                className={cx('account-item-menu')}
                {...SEARCH_ACCOUNT_BUTTON_PROPS}
            >
                <EllipsisIcon className={cx('ellipsis')} />
            </Menu>
        </Link>
    );
}

export default AccountItem;
