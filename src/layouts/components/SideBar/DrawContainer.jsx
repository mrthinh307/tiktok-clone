import { forwardRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import PropTypes from 'prop-types';
import Search from '../Search';
import AccountItem from '~/components/AccountItem';
import { CloseIcon } from '~/assets/images/icons';

const cx = classNames.bind(styles);

const DrawerContainer = forwardRef(function DrawerContainer(
    { children, onClose },
    ref,
) {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    const handleAccountClick = (data) => {};

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div ref={ref} className={cx('drawer-container')}>
            <div className={cx('title-container')}>
                <h2 className={cx('title')}>Search</h2>
            </div>
            <CloseIcon className={cx('close-icon')} onClick={handleClose} />
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
                                <li key={result.id}>
                                    <AccountItem
                                        data={result}
                                        onClick={() =>
                                            handleAccountClick(result)
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {children}
        </div>
    );
});

DrawerContainer.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default DrawerContainer;
