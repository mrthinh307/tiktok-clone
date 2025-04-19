import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import {
    BlueTickIcon,
    EllipsisIcon,
    MarkIrrelevantIcon,
    ReportIcon,
} from '~/assets/images/icons';
import Menu from '../Popper/Menu';
import {} from '~/assets/images/icons';
import { createContext } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core';

const cx = classNames.bind(styles);

const SEARCH_ACCOUNT_OPTIONS = [
    {
        icon: <ReportIcon />,
        title: 'Report',
    },
    {
        icon: <MarkIrrelevantIcon />,
        title: 'Mark as irrelevant',
    },
];

export const ConfigureButtonContext = createContext();

function AccountItem() {
    const examleImg =
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&s';

    return (
        <div className={cx('wrapper')}>
            <img className={cx('avatar')} src={examleImg} alt="Avatar" />
            <div className={cx('info')}>
                <p className={cx('nickname')}>
                    <strong>mixigaming</strong>
                    <BlueTickIcon className={cx('blue-tick')} />
                </p>
                <p className={cx('name')}>Do Phung</p>
            </div>
            <ConfigureButtonContext.Provider value={{ buttonSize: 'small', iconSize: 'medium', hoverType: 'font'}}>
                <Menu
                    items={SEARCH_ACCOUNT_OPTIONS}
                    className={cx('account-item-menu')}
                >
                    <EllipsisIcon className={cx('ellipsis')} />
                </Menu>
            </ConfigureButtonContext.Provider>
        </div>
    );
}

export default AccountItem;
