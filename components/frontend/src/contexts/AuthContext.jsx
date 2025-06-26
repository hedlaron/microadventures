import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, fetchUserProfile } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userProfile = await fetchUserProfile(token);
          setCurrentUser(userProfile);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        // If token is invalid or expired, clear it
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  async function login(email, password) {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const { access_token } = await loginUser({ username: email, password });
      localStorage.setItem('token', access_token);
      
      const userProfile = await fetchUserProfile(access_token);
      setCurrentUser(userProfile);
      return userProfile;
    } catch (error) {
      // Set a context error but let the original error propagate
      setError(error.userMessage || error.message);
      throw error;
    }
  }
  
  async function register(userData) {
    try {
      await registerUser(userData);
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
      throw error;
    }
  }

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setShowLoginForm(true);
    setShowSignUpForm(false);
  };
  
  const openSignUpModal = () => {
    setIsLoginModalOpen(true);
    setShowLoginForm(false);
    setShowSignUpForm(true);
  };
  
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setError('');
  };
  
  const switchToSignUp = () => {
    setShowLoginForm(false);
    setShowSignUpForm(true);
  };
  
  const switchToLogin = () => {
    setShowLoginForm(true);
    setShowSignUpForm(false);
  };

  const getUserName = () => {
    return currentUser ? currentUser.username : null;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        register,
        logout,
        isAuthenticated: !!currentUser,
        getUserName,
        error,
        loading,
        isLoginModalOpen,
        showLoginForm,
        showSignUpForm,
        openLoginModal,
        openSignUpModal,
        closeLoginModal,
        switchToLogin,
        switchToSignUp,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
