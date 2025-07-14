import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import {
  useState,
  memo,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  Fragment,
} from 'react';
import { Link } from 'react-router-dom';

import config from '~/config';
import Menu from './Menu';
import { useDrawer } from '~/hooks';
import DrawerContainer from './DrawContainer';
import {
  BackIcon,
  DarkLogoIcon,
  OnlyDarkLogoIcon,
} from '~/assets/images/icons';
import Button from '~/components/Button';
import { useAuth } from '~/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import coinAdsImage from '~/assets/images/coin-ads.png';
import supabase from '~/config/supabaseClient';
import FollowingAccount from './FollowingAccount/FollowingAccount';
import Frame from './FollowingAccount/Frame';

const cx = classNames.bind(styles);

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResponsiveCollapsed, setIsResponsiveCollapsed] = useState(false);
  const [currentMenuTitle, setCurrentMenuTitle] = useState({});

  // Persistent search state
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const menuRef = useRef(null);
  const sidebarRef = useRef(null);
  const drawerOptions = useMemo(
    () => ({
      className: cx('show'),
      animationDuration: 400,
      animationDelay: 50,
    }),
    [],
  );
  const { showDrawer, drawerRef } = useDrawer(isCollapsed, drawerOptions);
  const { user, toggleLoginForm } = useAuth();

  const [followingUsers, setFollowingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const excludedUserIdsRef = useRef(new Set());

  // Handle fetching following users
  const fetchFollowingUsers = useCallback(
    async (isInitial = true) => {
      if (!user || (!hasMore && !isInitial)) return;

      if (isInitial) setIsLoading(true);
      else setIsFetchingMore(true);

      try {
        const { data, error } = await supabase.rpc('get_following_users', {
          current_user_id: user.sub,
          excluded_user_ids: Array.from(excludedUserIdsRef.current),
          limit_users: 5,
        });

        if (error) throw error;

        if (data.has_more === false) {
          setHasMore(false);
        }

        const users = data.users ?? [];
        users.forEach((user) => excludedUserIdsRef.current.add(user.id));

        if (isInitial) {
          setFollowingUsers(users);
        } else {
          setFollowingUsers((prev) => [...prev, ...users]);
        }
      } catch (err) {
        console.error('Error fetching following users:', err);
      } finally {
        if (isInitial) setIsLoading(false);
        else setIsFetchingMore(false);
      }
    },
    [user, hasMore],
  );

  useEffect(() => {
    fetchFollowingUsers(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeeMoreFollowingUsers = useCallback(() => {
    if (hasMore && !isFetchingMore && !isLoading) {
      fetchFollowingUsers(false);
    }
  }, [hasMore, isFetchingMore, isLoading, fetchFollowingUsers]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsResponsiveCollapsed(window.innerWidth < 1024);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle toggle collapse
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prevState) => !prevState);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsCollapsed(false);
    // deactivate index of menu item
    if (
      menuRef.current &&
      typeof menuRef.current.deactivateItems === 'function'
    ) {
      menuRef.current.deactivateItems();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCollapsed && !sidebarRef.current?.contains(event.target)) {
        handleCloseDrawer();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollapsed, handleCloseDrawer]);

  const handleMenuTitleChange = useCallback((title, index) => {
    setCurrentMenuTitle({
      title,
      index,
    });
  }, []);

  // Handle search state changes
  const handleSearchValueChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const handleSearchResultsChange = useCallback((results) => {
    setSearchResults(results);
  }, []);

  const menuProps = useMemo(
    () => ({
      user: user,
      collapsed: isCollapsed,
      onToggleCollapse: handleToggleCollapse,
      onSetTitle: handleMenuTitleChange,
      ref: menuRef,
    }),
    [user, isCollapsed, handleToggleCollapse, handleMenuTitleChange],
  );

  const drawerProps = useMemo(
    () => ({
      onClose: handleCloseDrawer,
      titleData: currentMenuTitle,
      // Persistent search state
      searchValue,
      searchResults,
      onSearchValueChange: handleSearchValueChange,
      onSearchResultsChange: handleSearchResultsChange,
    }),
    [
      handleCloseDrawer,
      currentMenuTitle,
      searchValue,
      searchResults,
      handleSearchValueChange,
      handleSearchResultsChange,
    ],
  );

  // Handle button click
  const handleLoginButtonClick = useCallback(() => {
    toggleLoginForm();
  }, [toggleLoginForm]);

  return (
    <aside
      className={cx('wrapper', { collapsed: isCollapsed })}
      ref={sidebarRef}
    >
      <div
        className={cx('container')}
        style={{ overflow: 'auto', scrollbarWidth: 'none' }}
      >
        <Link to={config.routes.home} className={cx('header-logo')}>
          {!isCollapsed && !isResponsiveCollapsed ? (
            <DarkLogoIcon className={cx('logo')} />
          ) : (
            <OnlyDarkLogoIcon className={cx('logo')} />
          )}
        </Link>

        <Menu {...menuProps} />

        {user && followingUsers.length > 0 && !isCollapsed && (
          <div
            className={`hidden lg:flex relative w-full flex-col items-start justify-start py-[16px] my-[12px] after:content-[''] after:h-[1px] after:bg-[#1618231F] after:top-[0px] after:left-[8px] after:right-[8px] after:absolute before:content-[''] before:h-[1px] before:bg-[#1618231F] before:bottom-[0px] before:left-[8px] before:right-[8px] before:absolute`}
          >
            <p className="w-[208px] px-[8px] mb-[8px] font-bold text-[#161823BF]">
              Following accounts
            </p>
            <div className="w-[208px] flex flex-col items-start justify-center gap-[4px]">
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Frame key={index} />
                  ))
                : followingUsers.map((user) => (
                    <FollowingAccount key={user.id} user={user} />
                  ))}
              {isFetchingMore && <Frame />}
            </div>
            <button
              className={`flex items-center justify-start w-full h-[40px] mt-[4px] text-[#161823BF] hover:bg-[#f2f2f2] transition-colors duration-200 rounded-[8px] ${
                !hasMore || isLoading || isFetchingMore ? 'hidden' : ''
              }`}
              onClick={handleSeeMoreFollowingUsers}
            >
              <div className="w-[26px] h-[26px] mr-[8px] ml-[8px] flex relative">
                <BackIcon
                  style={{
                    position: 'absolute',
                    rotate: '-90deg',
                    left: '50%',
                    top: '-20%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
              <span className="ml-[4px] text-[1.6rem]">See more</span>
            </button>
          </div>
        )}

        <Button
          primary
          className={cx('login-btn', { hidden: !!user })}
          onClick={handleLoginButtonClick}
        >
          {isCollapsed ? (
            <FontAwesomeIcon icon={faArrowRightToBracket} />
          ) : (
            'Log in'
          )}
        </Button>

        <Fragment>
          <div
            className={cx('coin-ads-container', {
              hidden: isResponsiveCollapsed || isCollapsed,
            })}
          >
            <img src={coinAdsImage} alt="Coin Ads" className={cx('coin-ads')} />
            <div className={cx('ads-text-container')}>
              <h4>Create TikTok effects, get a reward</h4>
            </div>
          </div>
          <div
            className={`w-[208px] mt-[28px] ml-[4px] flex-col items-start justify-center text-[1.5rem] text-[#8c8c8c] font-bold leading-[22px] gap-2 ${
              isCollapsed || isResponsiveCollapsed ? 'hidden' : 'flex'
            }`}
          >
            <h4 className="cursor-pointer">Company</h4>
            <h4 className="cursor-pointer">Program</h4>
            <h4 className="cursor-pointer">Term & Policies</h4>
            <span className="text-[1.2rem] font-medium leading-[18px]">
              © 2025 TikTok
            </span>
          </div>
        </Fragment>
      </div>

      {showDrawer && <DrawerContainer ref={drawerRef} {...drawerProps} />}
      {/* </div> */}
    </aside>
  );
}

export default memo(SideBar);
