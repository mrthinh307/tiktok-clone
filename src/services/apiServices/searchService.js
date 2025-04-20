import * as request from '~/utils/request';

export const search = async (q, type = 'less') => {
    try {
        const response = await request.get('users/search', {
            params: {
                q,
                type,
            },
        });
        return response.data;
    } catch (error) {
        // setShowLoading(false);
        // setSearchResult([]);  
        console.error('Error fetching search results:', error);
    }
};
