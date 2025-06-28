import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createAdventure, fetchAdventureQuota } from '../utils/api';
import AdventurousBackground from './AdventurousBackground';
import AdventureResult from './AdventureResult';
import MapPicker from './MapPicker';
import { useCountdown } from '../hooks/useCountdown';
import styled from 'styled-components';

const PageWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: ${props => props.$isEmbedded ? '0' : '1rem 0'}; /* No padding when embedded */
  
  /* Ensure consistent behavior in all contexts */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${props => props.$isEmbedded ? 'flex-start' : 'center'};
  min-height: ${props => props.$isEmbedded ? 'auto' : 'calc(100vh - 3rem)'};
  
  @media (max-height: 600px) {
    justify-content: flex-start;
    padding-top: ${props => props.$isEmbedded ? '0' : '1rem'};
  }
`;

const PlanFormContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  background: white;
  
  /* Adaptive height based on context */
  max-height: ${props => props.$isEmbedded 
    ? 'none' /* No height restriction when embedded - let content determine height */
    : 'calc(100vh - 5rem)' /* Account for navbar + padding when standalone */
  };
  overflow-y: ${props => props.$isEmbedded ? 'visible' : 'auto'};
  
  /* Custom scrollbar styling - only when scrollable */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #FFD166;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #F4A261;
  }
  
  @media (max-width: 640px) {
    max-height: ${props => props.$isEmbedded ? 'none' : 'calc(100vh - 6rem)'};
    margin: ${props => props.$isEmbedded ? '0' : '0 1rem'};
  }
  
  @media (max-height: 600px) {
    max-height: ${props => props.$isEmbedded ? 'none' : 'calc(100vh - 4rem)'};
  }
`;

const PlanContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Plan = ({ isEmbedded = false }) => {
  console.log('Plan component rendering', { isEmbedded });

  const { currentUser } = useAuth();
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [duration, setDuration] = useState('few-hours');
  const [activityType, setActivityType] = useState('surprise-me');
  const [customActivity, setCustomActivity] = useState('');
  const [isCustomActivity, setIsCustomActivity] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [weather, setWeather] = useState(null);
  
  // New state for adventure handling
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedAdventure, setGeneratedAdventure] = useState(null);
  const [quotaInfo, setQuotaInfo] = useState(null);

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

  // Load quota info and auto-location on component mount
  useEffect(() => {
    loadQuotaInfo();
    // Auto-load current location if location is empty
    if (!location.trim()) {
      getCurrentLocation();
    }
  }, []);

  const loadQuotaInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const quota = await fetchAdventureQuota(token);
        setQuotaInfo(quota);
        // Reset countdown with new time
        if (quota?.time_until_reset) {
          resetCountdown(quota.time_until_reset);
        }
      }
    } catch (err) {
      console.error('Failed to load quota info:', err);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use OpenStreetMap Nominatim for reverse geocoding (free alternative to Google Maps)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
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
              addressParts.push(address.city || address.town || address.village);
            }
            
            if (address.state) {
              addressParts.push(address.state);
            }
            
            // Create a clean, readable address
            const readableAddress = addressParts.length > 0 
              ? addressParts.join(', ')
              : data.display_name || `${latitude},${longitude}`;
            
            setLocation(readableAddress);
          } else {
            // Fallback to coordinates if geocoding fails
            setLocation(`${latitude},${longitude}`);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          // Fallback to coordinates if geocoding fails
          setLocation(`${latitude},${longitude}`);
        } finally {
          setLocationLoading(false);
        }
      }, (error) => {
        console.error('Geolocation error:', error);
        setLocationLoading(false);
        alert('Unable to get your location. Please enter your location manually.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
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
      setError('Please enter a start location to create your adventure.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to create an adventure');
      }

      // Prepare adventure data
      const adventureData = {
        start_location: location,
        destination: isRoundTrip ? location : destination,
        duration: duration,
        activity_type: isCustomActivity ? customActivity : activityType,
        is_round_trip: isRoundTrip,
        // Add time context for the backend AI service
        is_immediate: !isCustomDate
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
      console.error('Failed to create adventure:', err);
      setError(err.userMessage || err.message || 'Failed to create adventure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAdventure = () => {
    setGeneratedAdventure(null);
    setError(null);
    // Reset form to defaults
    setLocation('');
    setDestination('');
    setIsRoundTrip(false);
    setDuration('few-hours');
    setActivityType('surprise-me');
    setCustomActivity('');
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

  // If adventure is generated, show the result with full-width layout like history
  if (generatedAdventure) {
    return (
      <div className="absolute inset-0 bg-[#f8fcfa]">
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

  return (
    <PageWrapper $isEmbedded={isEmbedded}>
      <PlanFormContainer $isEmbedded={isEmbedded}>
        <PlanContainer>
          <div className="w-full">
            <div className="p-4 sm:p-6 relative">
                  <div className="relative">                <h1 className="mb-4 sm:mb-6 text-black text-lg sm:text-xl font-bold leading-tight flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Plan Your Microadventure
                  </h1>

                  {/* Quota Display */}
                  {quotaInfo && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-[#FFD166]/10 to-[#F4A261]/10 rounded-lg border border-[#FFD166]/20">
                      <div className="flex items-center justify-center gap-2 text-sm mb-2">
                        <svg className="w-4 h-4 text-[#F4A261]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-[#0c1c17] font-medium">
                          {quotaInfo.adventures_remaining} adventures remaining today
                        </span>
                      </div>
                      {quotaInfo.time_until_reset && timeLeft > 0 && (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <svg className="w-3 h-3 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[#666]">
                            {quotaInfo.adventures_remaining === 0 ? 'Quota resets in:' : 'Next reset in:'} <span className="font-mono font-medium text-[#F4A261]">{formatTime(timeLeft)}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
              
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Start Location</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-1 text-sm h-8 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                        placeholder="Enter start location"
                        required
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className={`px-2 py-1 h-8 border border-[#FFD166] text-black rounded-lg hover:bg-[#FFD166]/10 transition-colors flex items-center gap-1 text-xs ${
                          locationLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {locationLoading ? (
                          <>
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Getting...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Current Location
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowStartMapPicker(true)}
                        className="px-2 py-1 h-8 border border-[#FFD166] text-black rounded-lg hover:bg-[#FFD166]/10 transition-colors flex items-center gap-1 text-xs"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Map
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-medium text-gray-700">Destination</label>
                      <button
                        type="button"
                        onClick={handleRoundTripToggle}
                        className={`text-xs px-2 py-0.5 rounded-full transition-all ${isRoundTrip ? 'bg-[#FFD166] text-black font-medium' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        <span className="flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Round Trip
                        </span>
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="flex-1 text-sm h-8 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                        placeholder="Enter destination"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEndMapPicker(true)}
                        className="px-2 py-1 h-8 border border-[#FFD166] text-black rounded-lg hover:bg-[#FFD166]/10 transition-colors flex items-center gap-1 text-xs"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Map
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Duration</label>
                    <div className="flex gap-1.5">
                      {['Few Hours', 'Half Day', 'Full Day', 'Few Days'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setDuration(option.toLowerCase().replace(' ', '-'))}
                          className={`flex-1 px-3 py-1.5 rounded-lg border ${
                            duration === option.toLowerCase().replace(' ', '-')
                              ? 'bg-[#FFD166] text-black shadow-sm'
                              : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                          } transition-colors duration-100 text-sm`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Activity Type</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActivityType('surprise-me');
                          setIsCustomActivity(false);
                        }}
                        className={`col-span-3 px-4 py-1.5 rounded-lg border ${
                          activityType === 'surprise-me'
                            ? 'bg-[#FFD166] text-black shadow-sm'
                            : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                        } transition-colors duration-100 font-medium`}
                      >
                        <span className="flex items-center justify-center gap-1">I feel adventurous 🤩</span>
                      </button>
                      {['Hiking', 'Cycling', 'Running', 'Picnic', 'Photography', 'Foodie Trip', 'Bird Watching', 'City Tour'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setActivityType(option.toLowerCase().replace(' ', '-'));
                            setIsCustomActivity(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg border ${
                            activityType === option.toLowerCase().replace(' ', '-')
                              ? 'bg-[#FFD166] text-black shadow-sm'
                              : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                          } transition-colors duration-100 text-sm`}
                        >
                          {option}
                        </button>
                      ))}
                      {!isCustomActivity ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomActivity(true);
                            setActivityType('custom');
                          }}
                          className={`px-3 py-1.5 rounded-lg border ${
                            activityType === 'custom'
                              ? 'bg-[#FFD166] text-black shadow-sm'
                              : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                          } transition-colors duration-100 text-sm`}
                        >
                          Custom...
                        </button>
                      ) : (
                        <div className="col-span-3 flex gap-1">
                          <input
                            type="text"
                            value={customActivity}
                            onChange={(e) => setCustomActivity(e.target.value)}
                            placeholder="Enter custom activity"
                            className="flex-1 px-2 py-1 text-sm bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setIsCustomActivity(false)}
                            className="px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-500 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">When to start?</label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setStartDate(new Date());
                          setIsCustomDate(false);
                        }}
                        className={`flex-1 px-3 py-1.5 rounded-lg border ${
                          !isCustomDate ? 'bg-[#FFD166] text-black shadow-sm' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                        } transition-colors duration-100 text-sm`}
                      >
                        Let's go now!
                      </button>
                      {isCustomDate ? (
                          <div className="flex-1 flex flex-col gap-1 p-1.5 border rounded-lg border-[#FFD166] bg-white">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-gray-700 w-8">Start:</span>
                              <input
                                type="datetime-local"
                                value={startDate.toISOString().slice(0, 16)}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                className="flex-1 text-xs bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-gray-700 w-8">End:</span>
                              <input
                                type="datetime-local"
                                value={endDate.toISOString().slice(0, 16)}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                                className="flex-1 text-xs bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                              />
                            </div>
                          </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsCustomDate(true)}
                          className="px-3 py-1.5 border border-[#FFD166] rounded-lg bg-white hover:bg-[#FFD166]/10 transition-colors duration-100 flex items-center gap-1 text-black text-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Pick a date/time
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !location.trim() || (quotaInfo && quotaInfo.adventures_remaining === 0)}
                    className="w-full px-6 py-2 mt-2 bg-[#FFD166] text-black rounded-lg hover:bg-[#F4A261] font-bold transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        Creating Your Adventure...
                      </>
                    ) : !location.trim() ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Enter Start Location
                      </>
                    ) : quotaInfo && quotaInfo.adventures_remaining === 0 ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Daily Limit Reached
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Create My Adventure Plan
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
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
