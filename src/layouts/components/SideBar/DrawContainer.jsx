import { forwardRef, useState, useMemo, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import PropTypes from 'prop-types';

import { MORE_CONTENTS } from '~/constants/sidebarConstants';
import Search from '../Search';
import AccountItem from '~/components/AccountItem';
import { BackIcon, CloseIcon } from '~/assets/images/icons';

const cx = classNames.bind(styles);

const DrawerContainer = forwardRef(function DrawerContainer(
    { onClose, titleData = {
        title: '',
        indexTitle: null
    } },
    ref,
) {
    const [searchResults, setSearchResults] = useState([]);
    const [history, setHistory] = useState([{ data: MORE_CONTENTS }]);

    const current = useMemo(() => history[history.length - 1], [history]);

    // useEffect(() => {
    //     if (titleData && titleData.title && history.length === 1) {
    //         setHistory([{ title: titleData.title, data: MORE_CONTENTS }]);
    //     }
    // }, [titleData, history]);

    const handleSearchResults = useCallback((results) => {
        setSearchResults(results);
    }, []);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleItemClick = (item, isParent) => {
        if (isParent) {
            setHistory((prev) => [...prev, item.children]);
        }
    };

    const handleBack = () => {
        setHistory((prev) => prev.slice(0, prev.length - 1));
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
            <div className={cx('search-container')}>
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
    }, [searchResults, handleSearchResults]);

    const renderMoreContent = () => {
        return (
            <div className={cx('more-contents')}>
                {current.data.map((item, index) => {
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

    return (
        <div ref={ref} className={cx('drawer-container')}>
            <div className={cx('header-search-bar')}>
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
