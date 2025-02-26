import axios from 'axios';
import { queryClient } from '../App';

// Create a custom axios instance with the correct base URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/api/v1',
  withCredentials: true,
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Handle 404 errors globally
    if (error.response && error.response.status === 404) {
      console.log('Resource not found:', error.config.url);
      
      // You could dispatch an action to your state management here
      // or handle the 404 in a specific way
    }
    
    // Any status codes outside the range of 2xx cause this function to trigger
    return Promise.reject(error);
  }
);

export default instance;
