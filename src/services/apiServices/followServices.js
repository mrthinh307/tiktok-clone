import * as request from '~/utils/httpRequest';

export const followUser = async (userId) => {
    try {
        const response = await request.post(`users/${userId}/follow`);
        console.log(response);

        return response.data;
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
};

export const unfollowUser = async (userId) => {
    try {
        const response = await request.post(`users/${userId}/unfollow`);
        console.log(response);

        return response.data;
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
};

export const getFollowingsList = async (page = 1) => {
    try {
        const response = await request.get('me/followings', {
            params: {
                page,
            },
        });
        return response;
    } catch (error) {
        console.error('Error getting followings list:', error);
        throw error;
    }
};

export const getAllFollowingIds = async () => {
    const allFollowingIds = [];
    let page = 1;
    let totalPages = 0;

    do {
        const response = await getFollowingsList(page);
        totalPages = response.meta?.pagination?.totalPages || 0;
        
        // Sửa lại để tương thích với structure mới
        if (Array.isArray(response.data)) {
            // Nếu data là array IDs
            allFollowingIds.push(...response.data);
        } else if (response.data && response.data.following_ids) {
            // Nếu data là object với following_ids
            allFollowingIds.push(...response.data.following_ids);
        }
        
        page++;
    } while (page <= totalPages);    return allFollowingIds;
};
