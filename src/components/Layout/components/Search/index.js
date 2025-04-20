import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import AccountItem from '~/components/AccountItem';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import {
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner, 
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Search() {
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleInputFocus = () => {
        setShowResult(true);
    };

    return (
        <HeadlessTippy
            interactive={true}
            visible={searchResult.length > 0 || showResult}
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
            onClickOutside={handleHideResult}
        >
            <div className={cx('search')}>
                <input
                    value={searchResult}
                    onChange={(e) => setSearchResult(e.target.value)}
                    placeholder="Seach"
                    spellCheck={false}
                    onFocus={handleInputFocus}
                />
                <button className={cx('clear')}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                </button>
                <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />

                <button className={cx('search-btn')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
