import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import HomePlan from "../components/features/HomePlan";
import styled from "styled-components";
import {
  primaryButtonLarge,
  brandGradientText,
  focusRing,
  cardAccent,
  legacyColors,
} from "../utils/colors";

// Styled components
const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  height: 100%;
  padding: 3rem 0;
  width: 100%;
  background: #ffffff;
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 500px;
`;

const HeroVisual = styled.div`
  flex: 1;
  max-width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AdventureSVG = () => (
  <svg
    width="500"
    height="400"
    viewBox="0 0 500 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background circle */}
    <circle cx="250" cy="200" r="180" fill="url(#bgGradient)" opacity="0.1" />

    {/* Main adventure path - a winding trail */}
    <path
      d="M50 300 Q150 250 200 200 Q250 150 300 180 Q350 210 400 160 Q430 140 450 120"
      stroke="url(#pathGradient)"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="10,5"
    />

    {/* Location pins along the path */}
    <g>
      {/* Pin 1 - Start */}
      <circle cx="70" cy="285" r="12" fill={legacyColors.primaryOrange} />
      <circle cx="70" cy="285" r="6" fill="white" />
      <path
        d="M70 275 L70 265 M65 270 L75 270"
        stroke={legacyColors.primaryOrange}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Pin 2 - Middle */}
      <circle cx="220" cy="190" r="12" fill={legacyColors.secondaryOrange} />
      <circle cx="220" cy="190" r="6" fill="white" />
      <path
        d="M220 180 L220 170 M215 175 L225 175"
        stroke={legacyColors.secondaryOrange}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Pin 3 - Adventure spot */}
      <circle cx="350" cy="195" r="12" fill={legacyColors.primaryOrange} />
      <circle cx="350" cy="195" r="6" fill="white" />
      <path
        d="M350 185 L350 175 M345 180 L355 180"
        stroke={legacyColors.primaryOrange}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    {/* Simple mountain silhouette */}
    <path
      d="M100 320 L140 280 L180 300 L220 260 L260 290 L300 250 L340 280 L380 240 L420 270 L420 350 L100 350 Z"
      fill="url(#mountainGradient)"
      opacity="0.3"
    />

    {/* Adventure icons */}
    {/* Hiking boot */}
    <g transform="translate(120,240)">
      <ellipse
        cx="0"
        cy="8"
        rx="18"
        ry="8"
        fill={legacyColors.primaryOrange}
        opacity="0.8"
      />
      <path
        d="M-15 5 Q-10 0 0 2 Q10 0 15 5 L15 12 L-15 12 Z"
        fill={legacyColors.secondaryOrange}
      />
      <circle cx="-8" cy="8" r="2" fill="white" opacity="0.8" />
      <circle cx="0" cy="8" r="2" fill="white" opacity="0.8" />
      <circle cx="8" cy="8" r="2" fill="white" opacity="0.8" />
    </g>

    {/* Camera */}
    <g transform="translate(280,140)">
      <rect
        x="-12"
        y="-8"
        width="24"
        height="16"
        rx="4"
        fill={legacyColors.primaryOrange}
      />
      <circle cx="0" cy="0" r="8" fill="white" opacity="0.9" />
      <circle cx="0" cy="0" r="5" fill={legacyColors.secondaryOrange} />
      <rect
        x="-15"
        y="-6"
        width="6"
        height="4"
        rx="2"
        fill={legacyColors.secondaryOrange}
      />
      <circle cx="8" cy="-6" r="2" fill={legacyColors.lightYellow} />
    </g>

    {/* Compass rose - simplified */}
    <g transform="translate(380,120)">
      <circle
        cx="0"
        cy="0"
        r="16"
        fill="white"
        stroke={legacyColors.secondaryOrange}
        strokeWidth="2"
        opacity="0.9"
      />
      <path d="M0,-10 L4,0 L0,10 L-4,0 Z" fill={legacyColors.secondaryOrange} />
      <path d="M0,-6 L2,0 L0,6 L-2,0 Z" fill="white" />
      <text
        x="0"
        y="-22"
        textAnchor="middle"
        fontSize="10"
        fill="#6B7280"
        fontWeight="600"
      >
        N
      </text>
    </g>

    {/* Floating adventure elements */}
    {/* Map piece */}
    <g transform="translate(150,120) rotate(15)">
      <rect
        x="-10"
        y="-8"
        width="20"
        height="16"
        rx="2"
        fill="white"
        stroke={legacyColors.primaryOrange}
        strokeWidth="2"
      />
      <path
        d="M-6 -4 L6 -4 M-8 0 L8 0 M-6 4 L6 4"
        stroke={legacyColors.primaryOrange}
        strokeWidth="1"
        opacity="0.6"
      />
      <circle
        cx="2"
        cy="-2"
        r="2"
        fill={legacyColors.secondaryOrange}
        opacity="0.8"
      />
    </g>

    {/* Coffee cup */}
    <g transform="translate(320,320)">
      <rect
        x="-6"
        y="-8"
        width="12"
        height="12"
        rx="2"
        fill="white"
        stroke={legacyColors.primaryOrange}
        strokeWidth="2"
      />
      <path
        d="M6 -4 Q12 -4 12 0 Q12 4 6 4"
        stroke={legacyColors.primaryOrange}
        strokeWidth="2"
        fill="none"
      />
      <ellipse
        cx="0"
        cy="-6"
        rx="4"
        ry="2"
        fill={legacyColors.primaryOrange}
        opacity="0.3"
      />
    </g>

    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={legacyColors.primaryOrange} />
        <stop offset="100%" stopColor={legacyColors.secondaryOrange} />
      </linearGradient>
      <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={legacyColors.primaryOrange} />
        <stop offset="50%" stopColor={legacyColors.secondaryOrange} />
        <stop offset="100%" stopColor={legacyColors.darkOrange} />
      </linearGradient>
      <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6B7280" />
        <stop offset="100%" stopColor="#9CA3AF" />
      </linearGradient>
    </defs>
  </svg>
);

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
    error,
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
      showSignUpForm,
    });
  }, [
    isAuthenticated,
    loading,
    isLoginModalOpen,
    showLoginForm,
    showSignUpForm,
  ]);

  // Modal events effects
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closeLoginModal();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeLoginModal();
      }
    };

    if (isLoginModalOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.removeEventListener("mousedown", handleClickOutside);
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
    const email = formData.get("email");
    const password = formData.get("password");

    setIsLoading(true);
    setError("");
    setLoginSuccess(false);

    try {
      await login(email, password);
      setLoginSuccess(true);
      setTimeout(() => {
        closeLoginModal();
        setLoginSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.userMessage || error.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    setIsLoading(true);
    setError("");

    try {
      await register(userData);
      setLoginSuccess(true);
      setTimeout(() => {
        switchToLogin();
        setLoginSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data?.detail || "Registration failed");
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
      {/* Conditionally render Plan component or hero section based on authentication status */}
      {isAuthenticated ? (
        <div className="w-full h-full flex flex-col">
          <HomePlan />
        </div>
      ) : (
        <HeroContainer>
          <HeroContent>
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                  Plan your next{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4A261] to-[#E76F51] font-extrabold">
                    microadventure
                  </span>
                </h1>
                <p className="text-2xl text-gray-700 leading-relaxed font-light max-w-lg">
                  Discover amazing local experiences and create unforgettable
                  memories with our intelligent adventure planning platform.
                </p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="inline-block">
                  <button
                    onClick={openLoginModal}
                    className="inline-flex items-center justify-center px-12 py-6 text-xl font-semibold text-white bg-gradient-to-r from-[#F4A261] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D84B40] transition-[background,box-shadow] duration-200 shadow-xl hover:shadow-2xl border-0 rounded-2xl focus:ring-4 focus:ring-orange-300/25 min-w-[280px]"
                  >
                    <svg
                      className="w-6 h-6 mr-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Start Your Adventure
                  </button>
                </div>

                <div className="flex items-center space-x-8 text-base text-gray-500 pt-2">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-[#F4A261]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Free to start
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-[#F4A261]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    AI-powered planning
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-[#F4A261]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Local discoveries
                  </div>
                </div>
              </div>
            </div>
          </HeroContent>

          <HeroVisual>
            <AdventureSVG />
          </HeroVisual>
        </HeroContainer>
      )}

      {/* Login/Signup Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="modal bg-white rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl"
            style={{ padding: "0" }}
          >
            {showLoginForm && (
              <>
                <div className="bg-gradient-to-r from-[#F4A261] to-[#E76F51] p-6 text-center relative">
                  <button
                    onClick={closeLoginModal}
                    className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors text-2xl font-light bg-transparent border-none outline-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                  >
                    ×
                  </button>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome Back!
                  </h2>
                  <p className="text-white/90 text-sm">
                    Sign in to continue your adventure
                  </p>
                </div>

                <div style={{ padding: "2rem" }}>
                  <form
                    onSubmit={handleLoginSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    {error && (
                      <div className="bg-orange-50 text-orange-700 p-4 rounded-lg text-sm border border-orange-200">
                        {error}
                      </div>
                    )}
                    {loginSuccess && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        style={{
                          height: "3.25rem",
                          padding: "0.875rem 1.25rem",
                          borderRadius: "0.875rem",
                        }}
                        className="w-full text-sm bg-gray-50/80 rounded-xl border-2 border-gray-200 shadow-sm focus:border-[#F4A261] focus:ring-0 focus:bg-white transition-all duration-200 hover:bg-white hover:border-gray-300"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        style={{
                          height: "3.25rem",
                          padding: "0.875rem 1.25rem",
                          borderRadius: "0.875rem",
                        }}
                        className="w-full text-sm bg-gray-50/80 rounded-xl border-2 border-gray-200 shadow-sm focus:border-[#F4A261] focus:ring-0 focus:bg-white transition-all duration-200 hover:bg-white hover:border-gray-300"
                        placeholder="Enter your password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        height: "3.5rem",
                        padding: "1rem 2rem",
                        marginTop: "0.75rem",
                        borderRadius: "0.875rem",
                      }}
                      className="w-full bg-gradient-to-r from-[#F4A261] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D84B40] text-white font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:brightness-110 border-0 focus:ring-4 focus:ring-orange-300/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign In
                        </>
                      )}
                    </button>
                    <div
                      className="text-center"
                      style={{ marginTop: "1.5rem" }}
                    >
                      <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <span
                          onClick={switchToSignUp}
                          className="text-[#F4A261] font-medium hover:text-[#E76F51] transition-colors cursor-pointer hover:underline"
                        >
                          Create one here
                        </span>
                      </p>
                    </div>
                  </form>
                </div>
              </>
            )}

            {showSignUpForm && (
              <>
                <div className="bg-gradient-to-r from-[#F4A261] to-[#E76F51] p-6 text-center relative">
                  <button
                    onClick={closeLoginModal}
                    className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors text-2xl font-light bg-transparent border-none outline-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                  >
                    ×
                  </button>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Join the Adventure!
                  </h2>
                  <p className="text-white/90 text-sm">
                    Create your account to start exploring
                  </p>
                </div>

                <div style={{ padding: "2rem" }}>
                  <form
                    onSubmit={handleSignUpSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    {error && (
                      <div className="bg-orange-50 text-orange-700 p-4 rounded-lg text-sm border border-orange-200">
                        {error}
                      </div>
                    )}
                    {loginSuccess && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Username
                      </label>
                      <input
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        style={{
                          height: "3.25rem",
                          padding: "0.875rem 1.25rem",
                          borderRadius: "0.875rem",
                        }}
                        className="w-full text-sm bg-gray-50/80 rounded-xl border-2 border-gray-200 shadow-sm focus:border-[#F4A261] focus:ring-0 focus:bg-white transition-all duration-200 hover:bg-white hover:border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        style={{
                          height: "3.25rem",
                          padding: "0.875rem 1.25rem",
                          borderRadius: "0.875rem",
                        }}
                        className="w-full text-sm bg-gray-50/80 rounded-xl border-2 border-gray-200 shadow-sm focus:border-[#F4A261] focus:ring-0 focus:bg-white transition-all duration-200 hover:bg-white hover:border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        style={{
                          height: "3.25rem",
                          padding: "0.875rem 1.25rem",
                          borderRadius: "0.875rem",
                        }}
                        className="w-full text-sm bg-gray-50/80 rounded-xl border-2 border-gray-200 shadow-sm focus:border-[#F4A261] focus:ring-0 focus:bg-white transition-all duration-200 hover:bg-white hover:border-gray-300"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        height: "3.5rem",
                        padding: "1rem 2rem",
                        marginTop: "0.75rem",
                        borderRadius: "0.875rem",
                      }}
                      className="w-full bg-gradient-to-r from-[#F4A261] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D84B40] text-white font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:brightness-110 border-0 focus:ring-4 focus:ring-orange-300/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          Create Account
                        </>
                      )}
                    </button>
                    <div
                      className="text-center"
                      style={{ marginTop: "1.5rem" }}
                    >
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <span
                          onClick={switchToLogin}
                          className="text-[#F4A261] font-medium hover:text-[#E76F51] transition-colors cursor-pointer hover:underline"
                        >
                          Sign in here
                        </span>
                      </p>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default HomePage;
