import httpRequest from '~/utils/httpRequest';
import { mockupVideo, mockupVideo2 } from '~/assets/videos';

// Giả định API endpoint
export const fetchVideos = async (page = 1, perPage = 10) => {
    try {
        // Uncomment dòng dưới khi có API thật
        // const response = await httpRequest.get(`/videos?page=${page}&per_page=${perPage}`);
        // return response.data;
        
        // Mock data
        return MOCK_VIDEOS;
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
    }
};

// Mock data để sử dụng khi chưa có API
const MOCK_VIDEOS = [
    {
        id: '1',
        user: {
            id: 'designertom',
            nickname: 'designertom',
            avatar: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/651f773def2501f5f2d6c1390499e8b9~c5_100x100.jpeg?x-expires=1714608000&x-signature=CZcYTJOvVJIl9uGq0NvkNVzDM8U%3D',
            verified: false
        },
        description: 'watching designers discover what\'s possible with new tools...',
        music: 'original sound',
        video: {
            cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-useast5-p-0068-tx/470e7757182144b189c308dc60705e9f_1714356490?x-expires=1714608000&x-signature=cyC%2BDerhviDKJpE30KZbSbuO42g%3D',
            playAddr: mockupVideo,
            width: 576,
            height: 1024,
            duration: 15.12
        },
        stats: {
            likes: 20800,
            comments: 174,
            saves: 18700,
            shares: 3411
        },
        caption: 'IMAGINE'
    },
    {
        id: '2',
        user: {
            id: 'techcreator',
            nickname: 'TechCreator',
            avatar: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/a63b67ab75d4d651b0c1d58681bb1638~c5_100x100.jpeg?x-expires=1714608000&x-signature=soMeFakeSignature%3D',
            verified: true
        },
        description: 'Check out this new AI toolllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll! #tech #ai #future',
        music: 'original sound - TechCreator',
        video: {
            cover: 'https://p16-sign-va.tiktokcdn.com/obj/tos-useast5-p-0068-tx/someothercover_1714356123?x-expires=1714608000&x-signature=anotherFakeSignature%3D',
            playAddr: mockupVideo2,
            width: 576,
            height: 1024,
            duration: 22.5
        },
        stats: {
            likes: 45600,
            comments: 312,
            saves: 12300,
            shares: 2800
        },
        caption: 'THE FUTURE IS NOW'
    }
];