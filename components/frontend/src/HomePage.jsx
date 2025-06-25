import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import Plan from './components/Plan';  // Updated import path
import styled from 'styled-components';

// Add these styled components after imports and before HomePage component
const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
`;

const HeroContainer = styled.div`
  position: relative;
  max-width: 1200px;
  width: 90%;
  height: 75vh;
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
  const { isAuthenticated, login, register } = useAuth(); // Add register to destructuring

  if (isAuthenticated) {
    return <Plan />;
  }

  const [isCardVisible, setIsCardVisible] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef();

  const closeCard = () => {
    setIsCardVisible(false);
    setShowLoginForm(false);
    setShowSignUpForm(false);
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeCard();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeCard();
      }
    };

    if (isCardVisible) {
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCardVisible]);

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleSignUpClick = () => {
    setShowSignUpForm(true);
  };

  const handleBackClick = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
  };

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
        setIsCardVisible(false);
        setShowLoginForm(false);
        setLoginSuccess(false);
      }, 2000);
    } catch (error) {
      setError(error.message);
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
            setShowSignUpForm(false);
            setShowLoginForm(true);
            setLoginSuccess(false);
        }, 2000);
    } catch (error) {
        console.error('Signup error:', error);
        setError(error.response?.data?.detail || 'Registration failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <HeroContainer>
        <HeroImage 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80" 
          alt="Hero background"
        />
        <HeroOverlay />
        <HeroContent>
          <div className="text-center space-y-4 max-w-[960px] px-5">
            <h1 className="text-5xl font-bold text-white mb-4">Discover Your Next Adventure</h1>
            <p className="text-xl text-white/90 mb-8">Plan your perfect microadventure in minutes</p>
            <button
              onClick={() => setIsCardVisible(true)}
              className="inline-flex items-center justify-center rounded-full h-14 px-10 bg-white text-[#121714] text-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Start Planning
            </button>
          </div>
        </HeroContent>

        {/* Modal */}
        {isCardVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
              ref={modalRef}
              className="bg-white rounded-lg p-6 w-[90%] max-w-md relative"
            >
              {showLoginForm ? (
                <>
                  <div className="flex items-center mb-4">
                    <button onClick={handleBackClick} className="text-gray-600 hover:text-gray-800">
                      ← Back
                    </button>
                    <h2 className="text-xl font-bold text-[#121714] absolute left-1/2 transform -translate-x-1/2">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        className="w-full rounded-full border-[#ebefed] px-4 h-10 @[480px]:h-12 focus:border-[#121714] focus:ring-[#121714]"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        className="w-full rounded-full border-[#ebefed] px-4 h-10 @[480px]:h-12 focus:border-[#121714] focus:ring-[#121714]"
                        placeholder="Enter your password"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="mt-2 flex min-w-[84px] w-full items-center justify-center rounded-full h-10 px-4 bg-[#121714] text-white text-sm font-bold"
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  </form>
                </>
              ) : showSignUpForm ? (
                <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="rounded-full border-[#ebefed] px-4 h-10"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="rounded-full border-[#ebefed] px-4 h-10"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="rounded-full border-[#ebefed] px-4 h-10"
                  />
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="rounded-full bg-[#121714] text-white px-4 h-10"
                  >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </button>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#121714] mb-4 text-center">
                    Start Your Journey
                  </h2>
                  <div className="flex flex-col gap-3">
                    <button onClick={handleLoginClick} className="w-full px-4 py-2 border border-[#121714] rounded-full">
                      Login
                    </button>
                    <button onClick={handleSignUpClick} className="w-full px-4 py-2 bg-[#121714] text-white rounded-full">
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </HeroContainer>
    </PageWrapper>
  );
};

export default HomePage;