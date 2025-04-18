import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { BlueTickIcon, EllipsisIcon } from '~/assets/images/icons';
import Menu from '../Popper/Menu';
import { ProfileIcon, CoinIcon } from '~/assets/images/icons';

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
]

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
            <EllipsisIcon className={cx('ellipsis')} />
        </div>
    );
}

export default AccountItem;
