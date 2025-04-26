import { useState, useRef, useEffect } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './Search.module.scss';

import * as searchServies from '~/services/apiServices/searchService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccountItem from '~/components/AccountItem';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useDebounce } from '~/hooks';
import {
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { DEBOUNCE_DELAY } from '~/constants/common';

const cx = classNames.bind(styles);

function Search({
    className,
    inputClassName,
    iconClassName,
    searchButton = true,
    dropdownMenu = false,
    responsive = true,  // Mặc định là responsive
    onSearchResults = () => {},
}) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const debouncedValue = useDebounce(searchValue, DEBOUNCE_DELAY);

    const handleChangeInput = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    useEffect(() => {
        if (!searchValue.trim()) {
            setSearchResult([]);
            onSearchResults([]);
            return;
        }

        const fetchApi = async () => {
            setShowLoading(true);

            const searchResult = await searchServies.search(
                debouncedValue,
                'more',
            );

            dropdownMenu
                ? setSearchResult(searchResult)
                : onSearchResults(searchResult);

            setShowLoading(false);
        };

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

    const inputRef = useRef();

    const handleClearInput = () => {
        setSearchValue('');
        setSearchResult([]);
        setShowResult(false);
        onSearchResults([]);
        inputRef.current.focus();
    };

    const classes = {
        search: cx('search', {
            responsive: responsive,  
        }, className),
        input: cx(inputClassName),
        icon: cx('icon', iconClassName),
    };

    return (
        <>
            {dropdownMenu ? (
                <HeadlessTippy
                    interactive={true}
                    visible={!!searchResult.length && showResult}
                    appendTo={() => document.body}
                    render={(attrs) => (
                        <div
                            className={cx('search-result', {
                                responsive: responsive,
                            })}
                            tabIndex="-1"
                            {...attrs}
                        >
                            <PopperWrapper>
                                <h4 className={cx('search-title')}>Accounts</h4>
                                <div className={cx('accounts-list')}>
                                    {searchResult.map((result) => (
                                        <AccountItem
                                            key={result.id}
                                            data={result}
                                            onClick={() => {
                                                setShowResult(false);
                                                setSearchValue('');
                                            }}
                                        />
                                    ))}
                                </div>
                            </PopperWrapper>
                        </div>
                    )}
                    onClickOutside={() => setShowResult(false)}
                >
                    <div className={classes.search}>
                        <input
                            ref={inputRef}
                            value={searchValue}
                            onChange={handleChangeInput}
                            placeholder="Search"
                            spellCheck={false}
                            onFocus={() => setShowResult(true)}
                            className={classes.input}
                        />
                        {!!searchValue.length > 0 && !showLoading && (
                            <button
                                className={classes.icon}
                                onClick={handleClearInput}
                            >
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                        )}
                        {showLoading && (
                            <FontAwesomeIcon
                                className={cx('loading', classes.icon)}
                                icon={faSpinner}
                            />
                        )}
                        {searchButton && (
                            <button className={cx('search-btn')}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                        )}
                    </div>
                </HeadlessTippy>
            ) : (
                <div className={classes.search}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        onChange={handleChangeInput}
                        placeholder="Search"
                        spellCheck={false}
                        onFocus={() => setShowResult(true)}
                        className={classes.input}
                    />
                    {!!searchValue.length > 0 && !showLoading && (
                        <button
                            className={classes.icon}
                            onClick={handleClearInput}
                        >
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {showLoading && (
                        <FontAwesomeIcon
                            className={cx('loading', classes.icon)}
                            icon={faSpinner}
                        />
                    )}
                    {searchButton && (
                        <button className={cx('search-btn')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    )}
                </div>
            )}
        </>
    );
}

Search.propTypes = {
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    searchButton: PropTypes.bool,
    dropdownMenu: PropTypes.bool,
    responsive: PropTypes.bool,
    onSearchResults: PropTypes.func,
};

export default Search;