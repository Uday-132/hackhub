import axios from 'axios';

// IMPORTANT: SELECT THE CORRECT API URL
// ---------------------------------------------------------------------------

import { Capacitor } from '@capacitor/core';

// AUTO-DETECT ENVIRONMENT
const API_URL = 'http://localhost:5000/api';

// NOTE: If using a PHYSICAL Android device, you must replace the above with your computer's IP:
// const API_URL = 'http://192.168.x.x:5000/api';
// const API_URL = 'https://hackhub-alpha.vercel.app/api';

// ---------------------------------------------------------------------------

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
            console.log('Attaching token:', user.token);
        } else {
            console.log('No token found in localStorage');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
