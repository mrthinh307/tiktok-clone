import { forwardRef } from 'react';
import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

const DrawerContainer = forwardRef(function DrawerContainer({ children }, ref) {
    return (
        <div ref={ref} className={cx('drawer-container')}>
            {children || 'Hello World'}
        </div>
    );
});

DrawerContainer.propTypes = {
    children: PropTypes.node
};

export default DrawerContainer;