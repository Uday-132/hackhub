import axios from 'axios';

// IMPORTANT: SELECT THE CORRECT API URL
// ---------------------------------------------------------------------------

// OPTION 1: FOR ANDROID EMULATOR (Use this if running in Android Studio)
const API_URL = 'http://10.0.2.2:5000/api';

// OPTION 2: FOR PHYSICAL DEVICE (Use this if running on a real phone)
// Replace with your computer's IP address (run 'ipconfig' to find it)
// const API_URL = 'http://192.168.0.4:5000/api'; 

// OPTION 3: FOR WEB BROWSER
// const API_URL = 'http://localhost:5000/api';

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
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
