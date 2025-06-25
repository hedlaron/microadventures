import axios from 'axios';
import { useCallback } from 'react';

const API_URL = 'http://localhost:8000/api';

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
        console.error("Login request failed:", {
            url: `${API_URL}/auth/token`,
            error: error.message,
            response: error.response?.data
        });
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
        const response = await axios.get(`${API_URL}/users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error);
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

export { loginUser, registerUser, fetchUserProfile };