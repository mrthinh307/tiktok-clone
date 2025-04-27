/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { SIDEBAR_MENU_ITEMS } from '~/constants/sidebarConstants';

const cx = classNames.bind(styles);

const Menu = forwardRef(function Menu({ collapsed, onToggleCollapse, onSetTitle }, ref) {
    const [activeItemIndex, setActiveItemIndex] = useState(null);
    
    const hasNonNavLinkActive = activeItemIndex !== null && collapsed;

    useImperativeHandle(ref, () => ({
        deactivateItems: () => {
            setActiveItemIndex(null);
        }
    }));

    const getClickHandler = useCallback(
        (item, index) => {
            if (item.to) {
                return () => {
                    setActiveItemIndex(index);
                    if (collapsed) {
                        onToggleCollapse();
                    }
                };
            } else {
                return () => {
                    if (activeItemIndex === index) {
                        setActiveItemIndex(null);
                        if (collapsed) {
                            onToggleCollapse();
                        }
                    } else {
                        setActiveItemIndex(index);
                        if (!collapsed) {
                            onToggleCollapse();
                        }
                    }

                    if (onSetTitle) {
                        onSetTitle(item.title, index);
                    }
                };
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [activeItemIndex, collapsed],
    );

    return (
        <div className={cx('menu-wrapper')}>
            {SIDEBAR_MENU_ITEMS.map((item, index) => {
                const clickHandler = getClickHandler(item, index);

                return (
                    <MenuItem
                        key={index}
                        title={item.title}
                        to={item.to}
                        icon={item.icon}
                        activeIcon={item.activeIcon}
                        iconSize={item.iconSize || 'large'}

                        collapsed={collapsed}
                        onClick={clickHandler}
                        isActive={activeItemIndex === index}
                        disableNavLinkActive={hasNonNavLinkActive}
                    />
                );
            })}
        </div>
    );
});

Menu.propTypes = {
    collapsed: PropTypes.bool,
    onToggleCollapse: PropTypes.func,
    onSetTitle: PropTypes.func,
};

export default Menu;
