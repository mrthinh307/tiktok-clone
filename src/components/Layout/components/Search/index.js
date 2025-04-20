import { useState, useRef, useEffect } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccountItem from '~/components/AccountItem';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import {
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        if (!searchValue.trim()) {
            setSearchResult([]);
            return;
        }

        setShowLoading(true);

        fetch(
            `https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURIComponent(
                searchValue,
            )}&type=less`,
        )
            .then((response) => response.json())
            .then((data) => {
                setSearchResult(data.data); // Assuming the API returns an array of users in 'data.data'
                setShowLoading(false);
            })
            .catch((error) => {
                setShowLoading(false);
                setSearchResult([]); // Clear results on error
                console.error('Error fetching search results:', error);
            });
    }, [searchValue]);

    const inputRef = useRef();

    const handleClearInput = () => {
        setSearchValue('');
        setSearchResult([]);
        setShowResult(false);
        inputRef.current.focus();
    };

    return (
        <HeadlessTippy
            interactive={true}
            visible={(searchResult.length > 0 && showResult)} 
            appendTo={() => document.body}
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
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
            <div className={cx('search')}>
                <input
                    ref={inputRef}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Seach"
                    spellCheck={false}
                    onFocus={() => setShowResult(true)}
                />
                {!!searchValue.length > 0 && !showLoading && (
                    <button className={cx('clear')} onClick={handleClearInput}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
                {showLoading && (
                    <FontAwesomeIcon
                        className={cx('loading')}
                        icon={faSpinner}
                    />
                )}

                <button className={cx('search-btn')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
