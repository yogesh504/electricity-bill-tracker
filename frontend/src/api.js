import axios from "axios";

// Get API base URL from environment variable and trim whitespace
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "https://electricity-bill-tracker.onrender.com/api").trim();

// Remove trailing slash if present (but keep /api)
const cleanApiUrl = API_BASE_URL.endsWith('/') && API_BASE_URL !== 'https://electricity-bill-tracker.onrender.com/api/' 
  ? API_BASE_URL.slice(0, -1) 
  : API_BASE_URL;

// Log API URL in development to help debug
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', cleanApiUrl);
}

const API = axios.create({
  baseURL: cleanApiUrl,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    if (error.response) {
      // Server responded with error
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else if (error.request) {
      // Request made but no response (network error, CORS, etc.)
      console.error('Network Error:', {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else {
      console.error('Error:', error.message);
    }

    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("token");
      // Dispatch custom event for AuthContext to listen to
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export default API;
