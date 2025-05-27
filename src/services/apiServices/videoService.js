import * as request from '~/utils/httpRequest';

export const fetchVideos = async (type = 'for-you', page = 1) => {
    try {
        const response = await request.get('videos', {
            params: {
                // type,
                page,
                videosPerPage: 10,
            },
        });

        console.log(response.data);

        // Trả về cả data và meta từ response
        return {
            data: response.data,
            meta: response.meta
        };
    } catch (error) {
        console.error('Error fetching videos:', error);
        // Trả về kết quả rỗng với meta mặc định
        return {
            data: [],
            meta: {
                pagination: {
                    page,
                    videosPerPage: 10,
                }
            }
        };
    }
};

// Hàm hỗ trợ lấy tổng số trang từ API
export const fetchTotalPages = async (type = 'for-you') => {
    try {
        const response = await request.get('videos', {
            params: {
                page: 1,
                videosPerPage: 10
            },
        });
        return response.meta?.pagination.totalPages || 10; // Default to 10 if API doesn't provide this info
    } catch (error) {
        console.error('Error fetching total pages:', error);
        return 10; // Default value
    }
};
