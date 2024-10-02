// src/utils/axiosInstance.js

import axios from 'axios';
import { useAuth } from './AuthContext'; 

const axiosInstance = axios.create({
  baseURL: 'https://wd79p.com/backend/public/api/', // Set your base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const { authState } = useAuth();
    
    // Attach user_id and token to headers if available
    if (authState && authState.token) {
      config.headers['Authorization'] = `Bearer ${authState.token}`; // or whatever your server expects
      config.headers['User-ID'] = authState.user_id; // Optional: if your API expects user_id as a header
    }
    
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
