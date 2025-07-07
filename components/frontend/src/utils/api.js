import axios from 'axios';
import { useCallback } from 'react';

// Global variable to store logout function
let globalLogout = null;

// Function to set the global logout function
export const setGlobalLogout = (logoutFn) => {
  globalLogout = logoutFn;
};

// Dynamic API URL detection
const getApiUrl = () => {
    // Check if we're in development (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000/api';
    }
    
    // For production/deployed environments, use the same domain with /backend prefix
    // Always use the same protocol as the current page to avoid mixed content issues
    const protocol = window.location.protocol;
    const host = window.location.host;
    const baseUrl = `${protocol}//${host}/backend/api`;
    
    console.log('Production API URL construction:', {
        protocol,
        host,
        baseUrl
    });
    
    return baseUrl;
};

const API_URL = getApiUrl();

// Debug logging
console.log('Environment detection:', {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    host: window.location.host,
    detectedApiUrl: API_URL
});

// Set up axios response interceptor for global 401 handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 && globalLogout) {
            console.log('401 detected, logging out user and redirecting to homepage');
            // Clear token and call logout to update auth state
            localStorage.removeItem('token');
            globalLogout();
            // Redirect to homepage - use window.location to ensure it works from anywhere
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

const loginUser = async (credentials) => {
    try {
        console.log('Making request to:', `${API_URL}/auth/token`);
        
        const params = new URLSearchParams();
        params.append('username', credentials.username);
        params.append('password', credentials.password);

        const response = await axios.post(
            `${API_URL}/auth/token`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        console.log('Response received:', response);
        return response.data;
    } catch (error) {
        let message = 'Login request failed.';
        if (error.response) {
            if (error.response.status === 401) {
                message = 'Invalid username or password. Please try again.';
            } else if (error.response.data && error.response.data.detail) {
                message = error.response.data.detail;
            }
        }
        console.error(message, {
            url: `${API_URL}/auth/token`,
            error: error.message,
            response: error.response?.data
        });
        // Attach the user-friendly message to the error object
        error.userMessage = message;
        throw error;
    }
};

const registerUser = async (userData) => {
    try {
        console.log('Making registration request to:', `${API_URL}/users/register`);
        
        const response = await axios.post(
            `${API_URL}/users/register`,
            userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Registration response:', response);
        return response.data;
    } catch (error) {
        console.error("Registration failed:", {
            error: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error);
        // Add more specific error handling for token issues
        if (error.response && error.response.status === 401) {
            error.userMessage = "Your session has expired. Please log in again.";
        }
        throw error;
    }
};

export function useApi() {
    // Generic API request function
    const makeRequest = useCallback(async (endpoint, options = {}) => {
        const url = `${API_URL}/${endpoint}`;
        const { method = 'GET', body, headers = {} } = options;
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: body ? body : undefined,
            });
            if (!response.ok) throw new Error(await response.text());
            return await response.json();
        } catch (err) {
            throw err;
        }
    }, []);
    return { makeRequest };
}

// Adventure API functions
const createAdventure = async (adventureData, token) => {
    try {
        // Transform frontend data to match backend schema
        const backendData = {
            location: adventureData.start_location,
            destination: adventureData.destination,
            duration: adventureData.duration,
            activity_type: adventureData.activity_type,
            is_round_trip: adventureData.is_round_trip
        };

        // Add time context if available
        if (adventureData.start_time) {
            backendData.start_time = adventureData.start_time;
        }
        if (adventureData.is_immediate !== undefined) {
            backendData.is_immediate = adventureData.is_immediate;
        }

        const response = await axios.post(
            `${API_URL}/adventures/generate`,
            backendData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Create adventure failed:", {
            error: error.message,
            response: error.response?.data
        });
        
        let message = 'Failed to create adventure.';
        if (error.response) {
            if (error.response.status === 429) {
                message = 'You have reached your daily adventure limit. Please try again tomorrow.';
            } else if (error.response.data && error.response.data.detail) {
                message = error.response.data.detail;
            }
        }
        error.userMessage = message;
        throw error;
    }
};

const fetchUserAdventures = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/adventures/my-history`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.adventures; // Extract adventures array from response
    } catch (error) {
        console.error("Fetch user adventures error:", error);
        if (error.response && error.response.status === 401) {
            error.userMessage = "Your session has expired. Please log in again.";
        }
        throw error;
    }
};

const fetchAdventureQuota = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/adventures/quota`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            adventures_remaining: response.data.adventures_remaining,
            total_quota: response.data.total_quota,
            reset_time: response.data.reset_time,
            time_until_reset: response.data.time_until_reset
        };
    } catch (error) {
        console.error("Fetch adventure quota error:", error);
        if (error.response && error.response.status === 401) {
            error.userMessage = "Your session has expired. Please log in again.";
        }
        throw error;
    }
};

// Share an adventure publicly
const shareAdventure = async (adventureId, makePublic) => {
    try {
        const token = localStorage.getItem('token');
        
        const response = await axios.post(
            `${API_URL}/adventures/${adventureId}/share`,
            {
                adventure_id: adventureId,
                make_public: makePublic
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error("Share adventure error:", error);
        if (error.response && error.response.status === 401) {
            error.userMessage = "Your session has expired. Please log in again.";
        } else if (error.response && error.response.status === 404) {
            error.userMessage = "Adventure not found or you don't have permission to share it.";
        }
        throw error;
    }
};

// Get a publicly shared adventure (no auth required)
const getSharedAdventure = async (shareToken) => {
    try {
        const response = await axios.get(`${API_URL}/adventures/shared/${shareToken}`);
        return response.data;
    } catch (error) {
        console.error("Get shared adventure error:", error);
        if (error.response && error.response.status === 404) {
            error.userMessage = "This shared adventure is no longer available or was made private.";
        }
        throw error;
    }
};

export { loginUser, registerUser, fetchUserProfile, createAdventure, fetchUserAdventures, fetchAdventureQuota, shareAdventure, getSharedAdventure };