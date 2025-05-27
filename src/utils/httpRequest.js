import axios from 'axios';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

// httpRequest.interceptors.request.use(
//     (config) => {
//         const projectId = process.env.REACT_APP_SUPABASE_PROJECT_ID;
//         const tokens = localStorage.getItem(`sb-${projectId}-auth-token`);
//         if (tokens) {
//             config.headers.Authorization = `Bearer ${tokens.access_token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export const get = async (path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data;
};

export const post = async (path, options = {}) => {
    const response = await httpRequest.post(path, options);
    return response.data;
};

export default httpRequest;
