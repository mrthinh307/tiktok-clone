import * as request from '~/utils/httpRequest';

export const fetchVideos = async (type = 'for-you', page = 1) => {
    try {
        const response = await request.get('videos', {
            params: {
                type,
                page,
            },
        });

        // Trả về cả data và meta từ response
        return {
            data: response.data,
            meta: response.meta || {
                total_pages: 10, // Giá trị mặc định nếu API không trả về
                current_page: page,
                per_page: response.data?.length || 10,
            },
        };
    } catch (error) {
        console.error('Error fetching videos:', error);
        // Trả về kết quả rỗng với meta mặc định
        return {
            data: [],
            meta: {
                total_pages: 10,
                current_page: page,
                per_page: 10,
            },
        };
    }
};

// Hàm hỗ trợ lấy tổng số trang từ API
export const fetchTotalPages = async (type = 'for-you') => {
    try {
        const response = await request.get('videos', {
            params: { type, page: 1 },
        });
        return response.meta?.pagination.total_pages || 10; // Default to 10 if API doesn't provide this info
    } catch (error) {
        console.error('Error fetching total pages:', error);
        return 10; // Default value
    }
};
