import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './Search.module.scss';

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
import supabase from '~/config/supabaseClient';

const cx = classNames.bind(styles);

const Search = forwardRef(function Search(
  {
    className,
    inputClassName,
    iconClassName,
    searchButton = true,
    dropdownMenu = false,
    responsive = true, // Mặc định là responsive
    onSearchResults = () => {},
    // New props for persistent state
    searchValue: propSearchValue,
    onSearchValueChange,
  },
  ref,
) {
  // Use controlled state when props are provided, otherwise use internal state
  const isControlled =
    propSearchValue !== undefined && onSearchValueChange !== undefined;
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const searchValue = isControlled ? propSearchValue : internalSearchValue;
  const debouncedValue = useDebounce(searchValue, DEBOUNCE_DELAY);
  const inputRef = useRef(null);

  // Expose focus method via ref
  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
    }),
    [],
  );

  useEffect(() => {
    if (!dropdownMenu && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 300);

      return () => clearTimeout(timer);
    } else {
      console.warn('Input reference is not set');
    }
  }, [dropdownMenu]);
  const handleChangeInput = (e) => {
    const newSearchValue = e.target.value;
    if (!newSearchValue.startsWith(' ')) {
      if (isControlled) {
        onSearchValueChange(newSearchValue);
      } else {
        setInternalSearchValue(newSearchValue);
      }
    }
  };

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResult([]);
      onSearchResults([]);
      return;
    }

    const fetchApi = async () => {
      try {
        setShowLoading(true);
        const { data: searchResult, error } = await supabase.rpc(
          'search_users',
          {
            query_string: debouncedValue,
            limit_users: 10,
          },
        );

        if (error) {
          throw error;
        }

        dropdownMenu
          ? setSearchResult(searchResult)
          : onSearchResults(searchResult);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResult([]);
      } finally {
        setShowLoading(false);
      }
    };

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  const handleClearInput = () => {
    if (isControlled) {
      onSearchValueChange('');
    } else {
      setInternalSearchValue('');
    }
    setSearchResult([]);
    setShowResult(false);
    onSearchResults([]);
    inputRef.current.focus();
  };

  const classes = {
    search: cx(
      'search',
      {
        responsive: responsive,
      },
      className,
    ),
    input: cx(inputClassName),
    icon: cx('icon', iconClassName),
  };

  return (
    <>
      {dropdownMenu ? (
        // Search bar in Setting page
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
                        if (isControlled) {
                          onSearchValueChange('');
                        } else {
                          setInternalSearchValue('');
                        }
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
              <button className={classes.icon} onClick={handleClearInput}>
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
        // Search bar in Home page (Sidebar)
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
            <button className={classes.icon} onClick={handleClearInput}>
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
      )}{' '}
    </>
  );
});

Search.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  searchButton: PropTypes.bool,
  dropdownMenu: PropTypes.bool,
  responsive: PropTypes.bool,
  onSearchResults: PropTypes.func,
  // New props for persistent state
  searchValue: PropTypes.string,
  onSearchValueChange: PropTypes.func,
};

export default Search;
