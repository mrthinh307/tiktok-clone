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

export const getTotalFollowingPages = async () => {
    try {
        const response = await request.get('me/followings', {
            params: {
                page: 1,
            }
        });
        return response.meta?.pagination?.total_pages || 0;
    } catch (error) {
        console.error('Error getting total following pages:', error);
        throw error;
    }
}

export const getFollowingsList = async (page = 1) => {
    try {
        const response = await request.get('me/followings', {
            params: {
                page,
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error getting followings list:', error);
        throw error;
    }
}

export const getAllFollowingIds = async (totalPages) => {
    const allFollowingIds = [];
    let page = 1;

    do {
        const respone = await getFollowingsList(page);
        allFollowingIds.push(...respone.map(user => user.id));
        totalPages = respone.total_pages;
        page++;
    } while (page <= totalPages);

    return allFollowingIds;
}

