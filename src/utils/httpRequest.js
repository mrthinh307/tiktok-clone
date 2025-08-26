import axios from 'axios';
import supabase from '../config/supabaseClient';

const httpRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Request Interceptor để tự động thêm Authorization header
httpRequest.interceptors.request.use(
  async (config) => {
    try {
      // Use Supabase session instead of manual token parsing
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      } else {
        console.log('⚠️ No valid session found');
      }
    } catch (error) {
      console.error('❌ Error getting session:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor để handle token expiration
httpRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the session
        const { data, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !data.session) {
          // Refresh failed, redirect to login
          console.error('Session refresh failed:', refreshError?.message);
          await supabase.auth.signOut();
          return Promise.reject(error);
        }

        // Retry the original request with new token
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return httpRequest(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        await supabase.auth.signOut();
      }
    }

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
