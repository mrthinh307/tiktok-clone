/* eslint-disable react-hooks/exhaustive-deps */
import supabase from '~/config/supabaseClient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import Home from '../Home';
import { SuggestedAccount, Frame } from './components';
import { TiktokLoading } from '~/components/Animations';

const LIMIT_USERS = 9; // Number of users to fetch per page

function Following() {
    const { user } = useAuth();
    const [suggestedUserList, setSuggestedUserList] = useState([]);
    const [isLoading, setLoading] = useState(true); // For the very first load
    const [isFetchingMore, setIsFetchingMore] = useState(false); // For subsequent "load more" actions
    const [hasMore, setHasMore] = useState(true); // To track if there are more users to load
    const [hoveredItem, setHoveredItem] = useState(null); // Track which item is being hovered
    const excludedUserIdsRef = useRef(new Set()); // To keep track of already fetched user IDs

    const loadSuggestedUsers = useCallback(async (isInitial = true) => {
        if (isInitial) setLoading(true);
        else setIsFetchingMore(true);

        try {
            const {
                data: { videos, has_more },
                error,
            } = await supabase.rpc('get_latest_video_by_random_users', {
                limit_users: LIMIT_USERS,
                excluded_user_ids: Array.from(excludedUserIdsRef.current),
            });

            if (error) throw error;

            if (!has_more) setHasMore(false);

            videos.forEach((item) =>
                excludedUserIdsRef.current.add(item.user_id),
            );

            if (isInitial) {
                setSuggestedUserList(videos);
            } else {
                setSuggestedUserList((prev) => [...prev, ...videos]);
            }
        } catch (err) {
            console.error('Error loading suggested users:', err);
        } finally {
            isInitial ? setLoading(false) : setIsFetchingMore(false);
        }
    }, []);

    useEffect(() => {
        // Load suggested users on initial mount
        loadSuggestedUsers();
    }, []);

    // Handle infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            // Check if user has scrolled near the bottom
            const threshold = 0; // Load more when 0px from bottom
            const scrolledToBottom =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - threshold;

            if (scrolledToBottom && hasMore && !isFetchingMore && !isLoading) {
                loadSuggestedUsers(false); // Load more users
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isFetchingMore, isLoading]);

    return user ? (
        <Home queryPage="following" />
    ) : (
        <div className="w-full pt-[20px] flex flex-col items-center px-4">
            <div className="max-w-[736px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-start relative">
                {isLoading ? (
                    // Initial loading state
                    Array.from({ length: LIMIT_USERS }).map((_, index) => (
                        <Frame key={index} />
                    ))
                ) : (
                    <>
                        {suggestedUserList.map((item) => (
                            <SuggestedAccount
                                key={item.user_id}
                                item={item}
                                hoveredItem={hoveredItem}
                                setHoveredItem={setHoveredItem}
                            />
                        ))}
                    </>
                )}
            </div>
            {isFetchingMore && (
                <div className="col-span-full py-8 pl-8">
                    <TiktokLoading />
                </div>
            )}
        </div>
    );
}

export default Following;
