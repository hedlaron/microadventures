import axios from 'axios';
import { useCallback } from 'react';

const API_URL = 'http://localhost:8000/api';

const loginUser = async (credentials) => {
    try {
        const params = new URLSearchParams();
        for (const key in credentials) {
            params.append(key, credentials[key]);
        }

        const response = await axios.post(
            `${API_URL}/auth/token`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

const registerUser = async (userData) => {
    try {
        await axios.post(`${API_URL}/auth/register`, userData);
    } catch (error) {
        console.error("Registration error:", error);
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