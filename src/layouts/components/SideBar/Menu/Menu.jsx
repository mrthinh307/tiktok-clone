/* eslint-disable react-hooks/exhaustive-deps */
import {
    useState,
    useCallback,
    useImperativeHandle,
    forwardRef,
    useMemo,
} from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { useAuth } from '~/contexts/AuthContext';
import {
    SIDEBAR_MENU_ITEMS,
    UNAUTHENTICATED_SIDEBAR_MENU_ITEMS,
} from '~/constants/sidebarConstants';
import { DEFAULT_AVATAR } from '~/constants/common';

const cx = classNames.bind(styles);

const Menu = forwardRef(function Menu(
    { user, collapsed, onToggleCollapse, onSetTitle },
    ref,
) {
    const [activeItemIndex, setActiveItemIndex] = useState(null);
    const { toggleLoginForm } = useAuth();

    const hasNonNavLinkActive = activeItemIndex !== null && collapsed;

    useImperativeHandle(ref, () => ({
        deactivateItems: () => {
            setActiveItemIndex(null);
        },
    }));

    const getClickHandler = useCallback(
        (item, index) => {
            if (item.title === 'Profile' && !user) {
                return () => {
                    toggleLoginForm();
                };
            }
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
            // Tạo bản sao của SIDEBAR_MENU_ITEMS và cập nhật Profile item với avatar của user
            return SIDEBAR_MENU_ITEMS.map((item) => {
                if (item.title === 'Profile') {
                    return {
                        ...item,
                        to: `/user/${user.nickname}`,
                        icon: (
                            <img
                                alt="user"
                                src={user.avatar_url || DEFAULT_AVATAR}
                            />
                        ),
                        activeIcon: (
                            <img
                                alt="user"
                                src={user.avatar_url || DEFAULT_AVATAR}
                            />
                        ),
                    };
                }
                return item;
            });
        } else {
            return SIDEBAR_MENU_ITEMS.filter((item) =>
                UNAUTHENTICATED_SIDEBAR_MENU_ITEMS.includes(item.title),
            );
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
