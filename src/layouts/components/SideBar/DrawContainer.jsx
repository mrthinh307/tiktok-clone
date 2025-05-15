import { forwardRef, useState, useMemo, useCallback, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import PropTypes from 'prop-types';

import Search from '../Search';
import AccountItem from '~/components/AccountItem';
import LogoutConfirmation from '~/components/LogoutConfirmation';
import { BackIcon, CloseIcon } from '~/assets/images/icons';
import { useAuth } from '~/contexts/AuthContext';
import {
    MORE_CONTENTS,
    UNAUTHENTICATED_MORE_CONTENTS,
} from '~/constants/sidebarConstants';

const cx = classNames.bind(styles);

const DrawerContainer = forwardRef(function DrawerContainer(
    {
        onClose,
        titleData = {
            title: '',
            indexTitle: null,
        },
    },
    ref,
) {
    const [searchResults, setSearchResults] = useState([]);
    const [history, setHistory] = useState([{ data: MORE_CONTENTS }]);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    const { user, logout } = useAuth();

    const current = useMemo(() => history[history.length - 1], [history]);

    // Add effect to handle content visibility with a slight delay
    useEffect(() => {
        // Set content to visible with a delay after drawer is mounted
        const timer = setTimeout(() => {
            setContentVisible(true);
        }, 100);

        return () => {
            clearTimeout(timer);
            // Reset contentVisible state when component unmounts
            setContentVisible(false);
        };
    }, []);

    const handleSearchResults = useCallback((results) => {
        setSearchResults(results);
    }, []);

    const handleClose = () => {
        // Hide content before closing drawer
        setContentVisible(false);
        setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 100);
    };

    const handleBack = () => {
        setTimeout(() => {
            setHistory((prev) => prev.slice(0, prev.length - 1));
        }, 50);
    };

    const getTitle = () => {
        if (history.length > 1) {
            return current.title;
        } else {
            return titleData.title;
        }
    };

    const renderSearchContent = useCallback(() => {
        return (
            <div
                className={cx('search-container', {
                    'content-visible': contentVisible,
                })}
            >
                <Search
                    className={cx('search-form')}
                    inputClassName={cx('search-input')}
                    iconClassName={cx('clear-icon')}
                    searchButton={false}
                    responsive={false}
                    onSearchResults={handleSearchResults}
                />
                {searchResults.length > 0 && (
                    <div className={cx('search-results-wrapper')}>
                        <h4 className={cx('search-results-title')}>Accounts</h4>
                        <ul className={cx('search-result-list')}>
                            {searchResults.map((result) => (
                                <li
                                    key={result.id}
                                    className={cx('search-result-item')}
                                >
                                    <AccountItem data={result} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }, [searchResults, handleSearchResults, contentVisible]);

    const renderMoreContent = () => {
        return (
            <div
                className={cx('more-contents', {
                    'content-visible': contentVisible,
                })}
            >
                {(user
                    ? current.data
                    : current.data.filter((item) =>
                          UNAUTHENTICATED_MORE_CONTENTS.includes(item.title),
                      )
                ).map((item, index) => {
                    const isParent = !!item.children;
                    return (
                        <div
                            key={index}
                            className={cx('more-content-item')}
                            onClick={() => handleItemClick(item, isParent)}
                        >
                            <span className={cx('title')}>{item.title}</span>
                            {item.icon && (
                                <span className={cx('icon')}>{item.icon}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderContent = () => {
        switch (titleData.title) {
            case 'Search':
                return renderSearchContent();
            case 'More':
                return renderMoreContent();
            default:
                return null;
        }
    };

    const handleItemClick = (item, isParent) => {
        if (isParent) {
            setHistory((prev) => [...prev, item.children]);
        } else if (item.field === 'logout') {
            // Show logout confirmation dialog
            setShowLogoutConfirmation(true);
        }
    };

    const handleConfirmLogout = () => {
        // Handle logout after confirmation
        logout();
        setShowLogoutConfirmation(false);
        handleClose();
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirmation(false);
    };

    return (
        <div ref={ref} className={cx('drawer-container')}>
            <div
                className={cx('header-search-bar', {
                    'content-visible': contentVisible,
                })}
            >
                <div className={cx('title-container')}>
                    {history.length > 1 && (
                        <BackIcon
                            className={cx('back-icon')}
                            onClick={handleBack}
                        />
                    )}
                    <h2 className={cx('title')}>{getTitle()}</h2>
                </div>
                {history.length === 1 && (
                    <CloseIcon
                        className={cx('close-icon')}
                        onClick={handleClose}
                    />
                )}
            </div>
            {renderContent()}

            {/* Logout confirmation dialog */}
            {showLogoutConfirmation && (
                <LogoutConfirmation
                    onConfirm={handleConfirmLogout}
                    onCancel={handleCancelLogout}
                />
            )}
        </div>
    );
});

DrawerContainer.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClose: PropTypes.func,
    titleData: PropTypes.shape({
        title: PropTypes.string,
        index: PropTypes.number,
    }),
};

export default DrawerContainer;
