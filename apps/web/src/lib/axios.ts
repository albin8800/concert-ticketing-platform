import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
  // Points to our Next.js proxy which forwards it to the Gateway
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Automatically send cookies with requests (useful for refresh tokens or session-based auth)
  withCredentials: true, 
});

// Optional: Add a request interceptor to automatically attach authorization tokens
api.interceptors.request.use(
  (config) => {
    // If you are storing JWTs in localStorage, you can retrieve and attach them here:
    // const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    // if (token && config.headers) {
    //   config.headers.Authorization = \`Bearer \${token}\`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: If the user gets a 401 Unauthorized, automatically log them out
    if (error.response && error.response.status === 401) {
      // Handle logout logic here
      console.warn("Unauthorized! User needs to log in.");
    }
    return Promise.reject(error);
  }
);

export default api;
