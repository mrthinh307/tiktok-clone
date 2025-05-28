/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import { useState, useCallback, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { SIDEBAR_MENU_ITEMS, UNAUTHENTICATED_SIDEBAR_MENU_ITEMS } from '~/constants/sidebarConstants';

const cx = classNames.bind(styles);

const Menu = forwardRef(function Menu({ user, collapsed, onToggleCollapse, onSetTitle }, ref) {
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

    const filteredMenuItems = useMemo(() => {
        if (user) {
            return SIDEBAR_MENU_ITEMS;
        } else {
            return SIDEBAR_MENU_ITEMS.filter(item => UNAUTHENTICATED_SIDEBAR_MENU_ITEMS.includes(item.title));
        }
    }, [user]);

    return (
        <div className={cx('menu-wrapper')}>
            {filteredMenuItems.map((item, index) => {
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
