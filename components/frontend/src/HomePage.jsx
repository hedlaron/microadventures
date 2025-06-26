import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import HomePlan from './components/HomePlan';
import styled from 'styled-components';

// Styled components
const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 128px); /* Accounting for both navbar and footer */
  padding: 3rem 0;
  margin: auto 0;
  width: 100%;
`;

const HeroContainer = styled.div`
  position: relative;
  max-width: 800px;
  width: 85%;
  aspect-ratio: 16/9;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 20px;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
`;

const HeroContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 1;
`;

const HomePage = () => {
  const { 
    isAuthenticated, 
    login, 
    register, 
    loading,
    isLoginModalOpen,
    showLoginForm,
    showSignUpForm,
    closeLoginModal,
    openLoginModal,
    switchToLogin,
    switchToSignUp,
    setError,
    error
  } = useAuth();

  // Local state for the form handling
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef();

  // For debugging
  useEffect(() => {
    console.log("HomePage state:", {
      isAuthenticated,
      loading,
      isLoginModalOpen,
      showLoginForm,
      showSignUpForm
    });
  }, [isAuthenticated, loading, isLoginModalOpen, showLoginForm, showSignUpForm]);

  // Modal events effects
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeLoginModal();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeLoginModal();
      }
    };

    if (isLoginModalOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLoginModalOpen, closeLoginModal]);

  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#121714]"></div>
      </div>
    );
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    setIsLoading(true);
    setError('');
    setLoginSuccess(false);

    try {
      await login(email, password);
      setLoginSuccess(true);
      setTimeout(() => {
        closeLoginModal();
        setLoginSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.userMessage || error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    setIsLoading(true);
    setError('');

    try {
        await register(userData);
        setLoginSuccess(true);
        setTimeout(() => {
            switchToLogin();
            setLoginSuccess(false);
        }, 2000);
    } catch (error) {
        console.error('Signup error:', error);
        setError(error.response?.data?.detail || 'Registration failed');
    } finally {
        setIsLoading(false);
    }
  };

  // Check if styled components are defined properly
  if (!PageWrapper || !HeroContainer) {
    console.error("Styled components not defined properly");
    return <div className="p-8">Error loading styled components</div>;
  }

  return (
    <PageWrapper>
      {/* Conditionally render Plan component or hero image based on authentication status */}
      {isAuthenticated ? (
        <HomePlan />
      ) : (
        <HeroContainer>
          <HeroImage 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80" 
            alt="Hero background"
          />
          <HeroOverlay />
          <HeroContent>
            <div className="text-center space-y-3 max-w-[800px] px-4">
              <h1 className="text-4xl font-bold text-white mb-3">Discover Your Next Adventure</h1>
              <p className="text-lg text-white/90 mb-6">Plan your perfect microadventure in minutes</p>
              <button
                onClick={openLoginModal}
                className="inline-flex items-center justify-center rounded-full h-12 px-8 bg-white text-[#121714] text-base font-bold hover:bg-gray-100 transition-colors"
              >
                Start Planning
              </button>
            </div>
          </HeroContent>
        </HeroContainer>
      )}

      {/* Login/Signup Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-[90%] max-w-md relative"
          >
            {showLoginForm && (
              <>
                <div className="relative w-full mb-4">
                  <button 
                    onClick={closeLoginModal} 
                    className="absolute left-0 text-gray-600 hover:text-gray-800"
                  >
                    ✕ Close
                  </button>
                  <h2 className="text-xl font-bold text-[#121714] text-center">
                    Login
                  </h2>
                </div>
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {loginSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                      Login successful! Redirecting...
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="w-full text-sm h-8 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      className="w-full text-sm h-8 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                      placeholder="Enter your password"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-2 mt-2 bg-[#FFD166] text-black rounded-lg hover:bg-[#F4A261] font-bold transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                  <div className="text-center mt-2">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={switchToSignUp}
                        className="text-[#121714] font-medium hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </form>
              </>
            )}
            
            {showSignUpForm && (
              <>
                <div className="relative w-full mb-4">
                  <button 
                    onClick={closeLoginModal} 
                    className="absolute left-0 text-gray-600 hover:text-gray-800"
                  >
                    ✕ Close
                  </button>
                  <h2 className="text-xl font-bold text-[#121714] text-center">
                    Sign Up
                  </h2>
                </div>
                <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-3">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {loginSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                      Account created! Please log in.
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Username</label>
                    <input
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      className="w-full text-sm h-8 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Email</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full text-sm h-8 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Password</label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="w-full text-sm h-8 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-2 mt-2 bg-[#FFD166] text-black rounded-lg hover:bg-[#F4A261] font-bold transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </button>
                  <div className="text-center mt-2">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={switchToLogin}
                        className="text-[#121714] font-medium hover:underline"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default HomePage;