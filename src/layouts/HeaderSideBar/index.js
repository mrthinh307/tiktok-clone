import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './HeaderSideBar.module.scss';
import Header from '~/layouts/components/Header';
import SideBar from './SideBar';

const cx = classNames.bind(styles);

function HeaderOnly({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <SideBar />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

HeaderOnly.propTypes = {
    children: PropTypes.node.isRequired,
};

export default HeaderOnly;
