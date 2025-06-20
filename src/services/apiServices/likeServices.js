import * as request from '~/utils/httpRequest';

export const likeVideo = async (videoId) => {
    try {
        const response = await request.post(`users/${videoId}/like`);

        return response.data;
    } catch (error) {
        console.error('Error like video: ', error);
        throw error;
    }
};

export const cancelLikeVideo = async (videoId) => {
    try {
        const response = await request.post(`users/${videoId}/unlike`);

        return response.data;
    } catch (error) {
        console.error('Error unlike video: ', error);
        throw error;
    }
}

export const getLikedVideosList = async (page = 1) => {
    try {
        const response = await request.get('me/likes', {
            params: {
                page,
            },
        });
        return response;
    } catch (error) {
        console.error('Error getting liked videos list:', error);
        throw error;
    }
};

export const getAllLikedVideoIds = async () => {
    const allLikedVideoIds = [];
    let page = 1;
    let totalPages = 0;

    do {
        const response = await getLikedVideosList(page);
        totalPages = response.meta?.pagination?.totalPages || 0;

        // Sửa lại để tương thích với structure mới
        if (Array.isArray(response.data)) {
            // Nếu data là array IDs
            allLikedVideoIds.push(...response.data);
        } else if (response.data && response.data.following_ids) {
            // Nếu data là object với following_ids
            allLikedVideoIds.push(...response.data.following_ids);
        }

        page++;
    } while (page <= totalPages);
    return allLikedVideoIds;
};
