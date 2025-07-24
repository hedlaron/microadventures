import React, { useState, useEffect, useCallback } from "react";
import LocationAutocomplete from "../ui/LocationAutocomplete";
import { useAuth } from "../../contexts/AuthContext";
import { createAdventure, fetchAdventureQuota } from "../../utils/api";
import AdventurousBackground from "./AdventurousBackground";
import AdventureResult from "./AdventureResult";
import MapPicker from "./MapPicker";
import { useCountdown } from "../../hooks/useCountdown";
import styled from "styled-components";
import {
  primaryButtonRounded as _PRIMARY_BUTTON_ROUNDED,
  errorText as _ERROR_TEXT,
  errorBg as _ERROR_BG,
  errorBorder as _ERROR_BORDER,
  focusRing as _FOCUS_RING,
} from "../../utils/colors";

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100%;
  height: 100%;
  padding: 1rem 0;

  @media (max-width: 640px) {
    padding: 0.5rem 0;
  }
`;

const PlanFormContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  border-radius: 18px;
  background: white;
  border: 2px solid rgba(244, 162, 97, 0.22);
  box-shadow:
    0 8px 24px -2px rgba(0, 0, 0, 0.12),
    0 2px 8px -1px rgba(0, 0, 0, 0.08);
  max-height: calc(100vh - 5rem);
  overflow-y: auto;

  /* Custom scrollbar for the form */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #f4a261;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #e76f51;
  }

  @media (max-width: 900px) {
    max-width: 99vw;
    border-radius: 12px;
  }
  @media (max-width: 640px) {
    max-width: 100vw;
    border-radius: 8px;
    max-height: calc(100vh - 2rem);
  }
  @media (max-height: 600px) {
    max-height: calc(100vh - 4rem);
  }
`;

const PlanContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 20px;
  border: 2px solid rgba(244, 162, 97, 0.2);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 10px 20px rgba(244, 162, 97, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 500px;
  width: 90%;
  backdrop-filter: blur(10px);
  position: relative;
`;

const LoadingAnimation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;

  .adventure-icon {
    width: 5rem;
    height: 5rem;
    background: linear-gradient(135deg, #f4a261 0%, #e76f51 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 8px 25px rgba(244, 162, 97, 0.4),
      0 4px 12px rgba(231, 111, 81, 0.2);
    position: relative;

    /* Add a subtle pulse ring */
    &::before {
      content: "";
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      border: 2px solid rgba(244, 162, 97, 0.3);
      border-radius: 50%;
    }
  }

  .adventure-icon svg {
    width: 2.5rem;
    height: 2.5rem;
    color: white;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0) scale(1);
    }
    40% {
      transform: translateY(-12px) scale(1.05);
    }
    60% {
      transform: translateY(-6px) scale(1.02);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.6;
    }
  }

  .loading-dots {
    display: flex;
    gap: 0.375rem;
  }

  .dot {
    width: 0.625rem;
    height: 0.625rem;
    background: linear-gradient(135deg, #f4a261, #e76f51);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(244, 162, 97, 0.3);
    opacity: 0.5;
    animation: dot-bounce 1.2s infinite;
  }
  .dot:nth-child(1) {
    animation-delay: 0s;
  }
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes dot-bounce {
    0%,
    80%,
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.4);
      opacity: 1;
    }
  }
`;

const LoadingText = styled.div`
  .main-text {
    font-size: 1.75rem;
    font-weight: 800;
    color: #0c1c17;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, #f4a261 0%, #e76f51 50%, #f4a261 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% 100%;
    letter-spacing: -0.02em;
  }

  .sub-text {
    font-size: 1.1rem;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 2rem;
    line-height: 1.6;
    opacity: 0.9;
  }

  .fun-facts {
    background: linear-gradient(
      135deg,
      rgba(244, 162, 97, 0.1),
      rgba(231, 111, 81, 0.1)
    );
    border: 1px solid rgba(244, 162, 97, 0.2);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: #374151;
    transition: all 0.5s ease-in-out;
    min-height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    /* Add a subtle icon or decoration */
    &::before {
      content: "✨";
      position: absolute;
      left: 0.75rem;
      font-size: 1.1rem;
    }

    /* Padding to make room for the icon */
    padding-left: 2.5rem;
  }
`;

// Helper to format a Date object as yyyy-MM-ddTHH:mm in local time for datetime-local input
function toLocalInputValue(date) {
  if (!date) return "";
  const pad = (n) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const Plan = () => {
  console.log("Plan component rendering");

  useEffect(() => {
    console.log("Plan component mounted");
    return () => console.log("Plan component unmounted");
  }, []);

  const { currentUser: _currentUser } = useAuth();
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [duration, setDuration] = useState("few-hours");
  const [activityType, setActivityType] = useState("surprise-me");
  const [customActivity, setCustomActivity] = useState("");
  const [isCustomActivity, setIsCustomActivity] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [_weather, _setWeather] = useState(null);

  // New state for adventure handling
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedAdventure, setGeneratedAdventure] = useState(null);
  const [quotaInfo, setQuotaInfo] = useState(null);

  // Fun facts for loading screen
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const funFacts = [
    "💡 Did you know? The best adventures often happen within 30 minutes of home!",
    "🌟 Microadventures can boost creativity by up to 60% according to recent studies!",
    "🚶‍♀️ A 2-hour adventure can be as refreshing as a full day vacation!",
    "🌍 There are hidden gems within 5 miles of almost every location!",
    "⏰ Most successful adventurers plan their trips in under 5 minutes!",
    "🎒 The best adventures require less gear than you think!",
    "🌅 Early morning adventures often lead to the most surprising discoveries!",
    "📱 50% of great adventures are found by people who just started exploring!",
  ];

  // Rotate facts during loading
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading, funFacts.length]);

  // Countdown timer for quota reset
  const { timeLeft, formatTime, reset: resetCountdown } = useCountdown(0);

  // Update countdown when quotaInfo changes
  useEffect(() => {
    if (quotaInfo?.time_until_reset) {
      resetCountdown(quotaInfo.time_until_reset);
    }
  }, [quotaInfo?.time_until_reset, resetCountdown]);

  // Map picker state
  const [showStartMapPicker, setShowStartMapPicker] = useState(false);
  const [showEndMapPicker, setShowEndMapPicker] = useState(false);

  const loadQuotaInfo = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const quota = await fetchAdventureQuota(token);
        setQuotaInfo(quota);
        // Reset countdown with new time
        if (quota?.time_until_reset) {
          resetCountdown(quota.time_until_reset);
        }
      }
    } catch (err) {
      console.error("Failed to load quota info:", err);
    }
  }, [resetCountdown]);

  // Load quota info and auto-location on component mount
  useEffect(() => {
    loadQuotaInfo();
    // Auto-load current location if location is empty
    if (!location.trim()) {
      getCurrentLocation();
    }
  }, [location, loadQuotaInfo]); // Add loadQuotaInfo as dependency

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Use OpenStreetMap Nominatim for reverse geocoding (free alternative to Google Maps)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            );

            if (response.ok) {
              const data = await response.json();

              // Extract readable address components
              const address = data.address || {};
              const addressParts = [];

              // Build a human-readable address
              if (address.house_number && address.road) {
                addressParts.push(`${address.house_number} ${address.road}`);
              } else if (address.road) {
                addressParts.push(address.road);
              }

              if (address.neighbourhood || address.suburb) {
                addressParts.push(address.neighbourhood || address.suburb);
              }

              if (address.city || address.town || address.village) {
                addressParts.push(
                  address.city || address.town || address.village,
                );
              }

              if (address.state) {
                addressParts.push(address.state);
              }

              // Create a clean, readable address
              const readableAddress =
                addressParts.length > 0
                  ? addressParts.join(", ")
                  : data.display_name || `${latitude},${longitude}`;

              setLocation(readableAddress);
            } else {
              // Fallback to coordinates if geocoding fails
              setLocation(`${latitude},${longitude}`);
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            // Fallback to coordinates if geocoding fails
            setLocation(`${latitude},${longitude}`);
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationLoading(false);
          alert(
            "Unable to get your location. Please enter your location manually.",
          );
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleRoundTripToggle = () => {
    setIsRoundTrip(!isRoundTrip);
    if (!isRoundTrip) {
      setDestination(location);
    }
  };

  // Map picker handlers
  const handleStartLocationFromMap = (locationData) => {
    setLocation(locationData.address);
  };

  const handleEndLocationFromMap = (locationData) => {
    setDestination(locationData.address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!location.trim()) {
      setError("Please enter a start location to create your adventure.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to create an adventure");
      }

      // Prepare adventure data
      const adventureData = {
        start_location: location,
        destination: isRoundTrip ? location : destination,
        duration: duration,
        activity_type: isCustomActivity ? customActivity : activityType,
        is_round_trip: isRoundTrip,
        // Add time context for the backend AI service
        is_immediate: !isCustomDate,
      };

      // Add start time if custom date is selected
      if (isCustomDate) {
        adventureData.start_time = startDate.toISOString();
      }

      const adventure = await createAdventure(adventureData, token);
      setGeneratedAdventure(adventure);

      // Refresh quota info
      await loadQuotaInfo();
    } catch (err) {
      console.error("Failed to create adventure:", err);
      setError(
        err.userMessage ||
          err.message ||
          "Failed to create adventure. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewAdventure = () => {
    setGeneratedAdventure(null);
    setError(null);
    // Reset form to defaults
    setLocation("");
    setDestination("");
    setIsRoundTrip(false);
    setDuration("few-hours");
    setActivityType("surprise-me");
    setCustomActivity("");
    setIsCustomActivity(false);
    setStartDate(new Date());
    setEndDate(new Date());
    setIsCustomDate(false);
    // Refresh quota
    loadQuotaInfo();
  };

  const handleBackToForm = () => {
    setGeneratedAdventure(null);
    setError(null);
  };

  // Removed unused isShrunk and headerRef, and scroll logic (no longer needed)
  // (All shrinking/scroll header logic is now removed for static header)

  // If adventure is generated, show the result with full-width layout like history
  if (generatedAdventure) {
    return (
      <div className="h-full">
        <AdventureResult
          adventure={generatedAdventure}
          onBack={handleBackToForm}
          onNewAdventure={handleNewAdventure}
          quotaInfo={quotaInfo}
          backText="Back to Plan"
        />
      </div>
    );
  }

  // Outer scroll container for edge-to-edge scrollbar
  return (
    <PageWrapper>
      {/* Loading Overlay */}
      {loading && (
        <LoadingOverlay>
          <LoadingCard>
            <LoadingAnimation>
              <div className="adventure-icon">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </LoadingAnimation>

            <LoadingText>
              <div className="main-text">We're working on your adventure!</div>
              <div className="sub-text">
                Our AI is exploring the best microadventures just for you...
              </div>
              <div className="fun-facts">{funFacts[currentFactIndex]}</div>
            </LoadingText>
          </LoadingCard>
        </LoadingOverlay>
      )}
      <PlanFormContainer
        style={{
          filter: loading ? "blur(8px)" : "none",
          opacity: loading ? 0.3 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <PlanContainer>
          {/* Static header and quota */}
          <div
            className="bg-white w-full py-6"
            style={{
              borderRadius: 18,
              minHeight: 40,
              boxShadow: "none",
              border: "none",
              width: "100%",
              margin: 0,
              maxWidth: "none",
              left: 0,
              right: 0,
            }}
          >
            <h1 className="w-full text-[#0c1c17] text-center font-bold leading-tight tracking-[-0.015em] text-2xl mb-2">
              Plan Your Microadventure
            </h1>
            {/* Quota Display */}
            {quotaInfo && (
              <div className="w-full bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/50 mb-6">
                <div className="flex items-center justify-center gap-2 font-medium">
                  <span className="text-orange-900">
                    {quotaInfo.adventures_remaining} adventures remaining today
                  </span>
                </div>
                {quotaInfo.time_until_reset && timeLeft > 0 && (
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="text-orange-700">
                      {quotaInfo.adventures_remaining === 0
                        ? "Quota resets in:"
                        : "Next reset in:"}{" "}
                      <span className="font-mono font-medium">
                        {formatTime(timeLeft)}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}
            {/* Error Display */}
            {error && (
              <div className="w-full mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <p className="text-orange-700 text-center">{error}</p>
              </div>
            )}
          </div>
          <div className="relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">
                  📍 Start Location
                </label>
                <div className="flex gap-2">
                  <div className="w-full">
                    <LocationAutocomplete
                      value={location}
                      onChange={setLocation}
                      className="w-full text-sm bg-white border-2 border-gray-200 text-gray-800 px-3 py-3 rounded-xl focus:border-orange-300 focus:ring-2 focus:ring-orange-200/50 focus:outline-none placeholder-gray-400"
                      placeholder="Where are you starting from?"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className={`border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-1 text-xs font-medium px-3 ${
                      locationLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {locationLoading ? (
                      <svg
                        className="w-3 h-3 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Current
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStartMapPicker(true)}
                    style={{
                      height: "3rem",
                      padding: "0 0.75rem",
                      minWidth: "70px",
                    }}
                    className="border-2 border-orange-300 text-orange-900 rounded-xl hover:bg-orange-50 flex items-center justify-center gap-1 text-xs font-medium"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    Map
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-800">
                    🎯 Destination
                  </label>
                  <button
                    type="button"
                    onClick={handleRoundTripToggle}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                      isRoundTrip
                        ? "bg-gradient-to-r from-orange-200 to-orange-300 text-orange-900 font-medium"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Round Trip
                    </span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="w-full">
                    <LocationAutocomplete
                      value={destination}
                      onChange={setDestination}
                      className="w-full text-sm bg-white border-2 border-gray-200 text-gray-800 px-3 py-3 rounded-xl focus:border-orange-300 focus:ring-2 focus:ring-orange-200/50 focus:outline-none placeholder-gray-400"
                      placeholder="Where would you like to go?"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEndMapPicker(true)}
                    className="border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-1 text-xs font-medium px-3"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    Map
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">
                  ⏰ Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Few Hours", "Half Day", "Full Day", "Few Days"].map(
                    (option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setDuration(option.toLowerCase().replace(" ", "-"))
                        }
                        className={`flex items-center justify-center text-center px-3 py-2 rounded-xl ${
                          duration === option.toLowerCase().replace(" ", "-")
                            ? "bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white border-2 border-orange-300"
                            : "bg-white border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700"
                        } text-sm font-medium`}
                      >
                        {option}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">
                  🎯 Activity Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActivityType("surprise-me");
                      setIsCustomActivity(false);
                    }}
                    className={`border-2 px-3 py-2 rounded-xl ${
                      activityType === "surprise-me"
                        ? "bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white border-orange-300"
                        : "bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700"
                    } transition-all duration-200 text-xs font-medium flex items-center justify-center text-center`}
                  >
                    ✨ Surprise me! ✨
                  </button>
                  {[
                    "Hiking",
                    "Cycling",
                    "Running",
                    "Picnic",
                    "Photography",
                    "Foodie Trip",
                    "City Tour",
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setActivityType(option.toLowerCase().replace(" ", "-"));
                        setIsCustomActivity(false);
                      }}
                      className={`border-2 px-2 py-2 rounded-xl ${
                        activityType === option.toLowerCase().replace(" ", "-")
                          ? "bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white border-orange-300"
                          : "bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700"
                      } text-xs font-medium flex items-center justify-center text-center`}
                    >
                      {option}
                    </button>
                  ))}
                  {!isCustomActivity ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomActivity(true);
                        setActivityType("custom");
                      }}
                      style={{
                        borderRadius: "12px",
                        padding: "0.5rem",
                        minHeight: "2.5rem",
                      }}
                      className={`border-2 ${
                        activityType === "custom"
                          ? "bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white shadow-sm border-orange-300"
                          : "bg-white border-gray-200 hover:bg-orange-50 text-gray-700"
                      } text-xs font-medium flex items-center justify-center`}
                    >
                      Custom...
                    </button>
                  ) : (
                    <div className="col-span-3 flex gap-2">
                      <input
                        type="text"
                        value={customActivity}
                        onChange={(e) => setCustomActivity(e.target.value)}
                        placeholder="Enter custom activity"
                        style={{
                          height: "2.5rem",
                          padding: "0.75rem",
                          borderRadius: "12px",
                        }}
                        className="flex-1 text-sm bg-white border-2 border-gray-200 text-gray-800 shadow-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-200/50 placeholder-gray-400"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomActivity(false)}
                        style={{
                          height: "2.5rem",
                          padding: "0 0.75rem",
                          borderRadius: "12px",
                        }}
                        className="border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-medium flex items-center justify-center"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">
                  🕐 When to start?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStartDate(new Date());
                      setIsCustomDate(false);
                    }}
                    className={`border-2 px-3 py-2 rounded-xl ${
                      !isCustomDate
                        ? "bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white border-orange-300"
                        : "bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700"
                    } text-sm font-medium flex items-center justify-center`}
                  >
                    🏃‍♂️ Let's go now!
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomDate(true)}
                    className={`border-2 px-3 py-2 rounded-xl ${
                      isCustomDate
                        ? "bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white border-orange-300"
                        : "bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700"
                    } text-sm font-medium flex items-center justify-center gap-2`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    📅 Pick date/time
                  </button>
                </div>
                {isCustomDate && (
                  <div className="p-3 border-2 border-orange-300 rounded-xl bg-orange-50/50 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-orange-900 w-12">
                        Start:
                      </span>
                      <input
                        type="datetime-local"
                        value={toLocalInputValue(startDate)}
                        onChange={(e) => {
                          const newStart = new Date(e.target.value);
                          setStartDate(newStart);
                          // If endDate is before newStart, set endDate = newStart
                          if (endDate < newStart) {
                            setEndDate(newStart);
                          }
                        }}
                        style={{
                          height: "2.5rem",
                          padding: "0.5rem",
                          borderRadius: "8px",
                        }}
                        className="flex-1 text-sm bg-white border border-orange-200 shadow-sm focus:border-orange-300 focus:ring-1 focus:ring-orange-300"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-orange-900 w-12">
                        End:
                      </span>
                      <input
                        type="datetime-local"
                        value={toLocalInputValue(endDate)}
                        min={toLocalInputValue(startDate)}
                        onChange={(e) => {
                          const newEnd = new Date(e.target.value);
                          // If newEnd < startDate, set to startDate
                          setEndDate(newEnd < startDate ? startDate : newEnd);
                        }}
                        style={{
                          height: "2.5rem",
                          padding: "0.5rem",
                          borderRadius: "8px",
                        }}
                        className="flex-1 text-sm bg-white border border-orange-200 shadow-sm focus:border-orange-300 focus:ring-1 focus:ring-orange-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !location.trim() ||
                  (quotaInfo && quotaInfo.adventures_remaining === 0)
                }
                className="w-full bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white font-bold text-lg hover:from-[#E76F51] hover:to-[#D84B40] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-0 px-8 py-4 rounded-xl mt-6 shadow-lg hover:shadow-xl hover:brightness-110"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : !location.trim() ? (
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Enter Start Location First</span>
                  </>
                ) : quotaInfo && quotaInfo.adventures_remaining === 0 ? (
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <span>Daily Limit Reached</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span>Create My Adventure Plan!</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </PlanContainer>
      </PlanFormContainer>
      {/* Map Picker Modals */}
      <MapPicker
        isOpen={showStartMapPicker}
        onClose={() => setShowStartMapPicker(false)}
        onLocationSelect={handleStartLocationFromMap}
        title="Select Start Location"
      />
      <MapPicker
        isOpen={showEndMapPicker}
        onClose={() => setShowEndMapPicker(false)}
        onLocationSelect={handleEndLocationFromMap}
        title="Select Destination"
      />
    </PageWrapper>
  );
};

export default Plan;
