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

    useEffect(() => {
        setTimeout(() => {
            setSearchResult([1, 2, 3]);
        }, 0);
    }, []);

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
            visible={searchResult.length > 0 && showResult}
            appendTo={() => document.body}
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>Accounts</h4>
                        <div className={cx('accounts-list')}>
                            <AccountItem />
                            <AccountItem />
                            <AccountItem />
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
                {!!searchValue.length > 0 && (
                    <button className={cx('clear')} onClick={handleClearInput}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
                <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />

                <button className={cx('search-btn')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
