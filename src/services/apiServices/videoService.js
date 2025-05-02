import httpRequest from '~/utils/httpRequest';
import { mockupVideo, mockupVideo2 } from '~/assets/videos';

import axios from 'axios';

const API_KEY = 'Zt79hHjfyhriILpaQydBUaBWsVqwZH5gotXpzRCleQv8yEllRV9oD6Eq';
const BASE_URL = 'https://api.pexels.com/videos/search';

export const fetchVideos = async (query = 'nature', perPage = 10, page = 1) => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: API_KEY,
      },
      params: {
        query,
        per_page: perPage,
        page,
      },
    });
    return response.data.videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
