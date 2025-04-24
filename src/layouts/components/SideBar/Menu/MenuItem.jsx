import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function MenuItem({ title, to, icon, collapsed, iconSize = 'large' }) {
    
    return (
        <NavLink className={cx('menu-item', { collapsed })} to={to}>
            <span className={cx('icon', `icon-${iconSize}`)}>{icon}</span>
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    collapsed: PropTypes.bool,
    iconSize: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default MenuItem;
