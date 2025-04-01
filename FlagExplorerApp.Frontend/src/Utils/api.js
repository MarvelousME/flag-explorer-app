import axios from 'axios';
import logger from '../logger';

// Create an axios instance with the base URL
const api = axios.create({
    baseURL: '', // The proxy in package.json will handle this (https://localhost:5001)
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
});

// Add a request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            logger.info(`Added Authorization header with token for request to ${config.url}`);
        } else {
            logger.warn(`No token found in localStorage for request to ${config.url}`);
        }
        return config;
    },
    (error) => {
        logger.error(`Request interceptor error: ${error.message}`);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        logger.error(`API request failed: ${error.message}`);
        if (error.response) {
            logger.error(`Response status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        }
        return Promise.reject(error);
    }
);

export default api;