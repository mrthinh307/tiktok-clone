import axios from 'axios';

const httpRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Interceptor để tự động thêm Authorization header
httpRequest.interceptors.request.use(
  (config) => {
    const projectId = process.env.REACT_APP_SUPABASE_PROJECT_ID;
    const tokens = localStorage.getItem(`sb-${projectId}-auth-token`);

    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens);
        const accessToken = parsedTokens.access_token;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          console.log('✅ Added Authorization header:');
        }
      } catch (error) {
        console.error('❌ Error parsing tokens:', error);
      }
    } else {
      console.log('⚠️ No tokens found in localStorage');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const get = async (path, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response.data;
};

export const post = async (path, options = {}) => {
  const response = await httpRequest.post(path, options);
  return response.data;
};

export default httpRequest;
