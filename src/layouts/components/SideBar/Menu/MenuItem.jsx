import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function MenuItem({
    title,
    to,
    icon,
    activeIcon,
    collapsed,
    iconSize = 'large',
    onClick,
    isActive = false,
    disableNavLinkActive = false,
}) {
    const location = useLocation();

    const isPathActive = to && location.pathname === to;

    const activeState = to ? isPathActive && !disableNavLinkActive : isActive;

    const Component = to ? Link : 'div';

    const componentProps = {
        ...(to && { to }),
        className: cx('menu-item', {
            collapsed,
            active: activeState,
        }),
        onClick,
    };

    return (
        <Component {...componentProps}>
            <span
                className={cx('icon', `icon-${iconSize}`, {
                    'keep-visible': title === 'LIVE',
                })}
            >
                {icon}
            </span>
            {activeIcon && (
                <span className={cx('active-icon', `icon-${iconSize}`)}>
                    {activeIcon}
                </span>
            )}
            <span className={cx('title')}>{title}</span>
        </Component>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string,
    icon: PropTypes.node.isRequired,
    activeIcon: PropTypes.node,
    collapsed: PropTypes.bool,
    iconSize: PropTypes.oneOf(['small', 'medium', 'large']),
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
    disableNavLinkActive: PropTypes.bool,
};

export default MenuItem;
