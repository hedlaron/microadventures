import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createAdventure, fetchAdventureQuota } from '../utils/api';
import AdventurousBackground from './AdventurousBackground';
import AdventureResult from './AdventureResult';
import MapPicker from './MapPicker';
import { useCountdown } from '../hooks/useCountdown';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: #f8fcfa;
  
  @media (max-height: 600px) {
    align-items: flex-start;
    padding-top: 1rem;
  }
`;

const PlanFormContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
  background: white;
  border: 1px solid #e6f4ef;
  
  /* Ensure it fits screen height properly */
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  
  /* Custom scrollbar for the form */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #46a080;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #019863;
  }
  
  @media (max-width: 640px) {
    max-width: 95vw;
    border-radius: 12px;
    max-height: calc(100vh - 1rem);
  }
`;

const PlanContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const Plan = () => {
  console.log('Plan component rendering');

  useEffect(() => {
    console.log('Plan component mounted');
    return () => console.log('Plan component unmounted');
  }, []);

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

  return (
    <PageWrapper>
      <PlanFormContainer>
        <PlanContainer>
          <div className="relative">
            <h1 className="mb-6 text-[#0c1c17] text-2xl sm:text-3xl font-bold leading-tight text-center tracking-[-0.015em]">
              Plan Your Microadventure
            </h1>

            {/* Quota Display */}
            {quotaInfo && (
              <div className="mb-6 p-4 bg-[#e6f4ef] rounded-xl border border-[#cde9df]">
                <div className="flex items-center justify-center gap-2 text-sm mb-2">
                  <span className="text-[#0c1c17] font-medium">
                    {quotaInfo.adventures_remaining} adventures remaining today
                  </span>
                </div>
                {quotaInfo.time_until_reset && timeLeft > 0 && (
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="text-[#46a080]">
                      {quotaInfo.adventures_remaining === 0 ? 'Quota resets in:' : 'Next reset in:'} <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                    </span>
                  </div>
                )}
              </div>
            )}

                  {/* Error Display */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}
              
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">📍 Start Location</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-1 text-sm bg-white border-2 border-[#e6f4ef] px-3 py-3 rounded-xl focus:border-[#46a080] focus:ring-2 focus:ring-[#46a080]/20 focus:outline-none transition-all duration-200 placeholder-[#46a080]"
                        placeholder="Where are you starting from?"
                        required
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className={`border-2 border-[#e6f4ef] text-[#0c1c17] rounded-xl hover:bg-[#e6f4ef] transition-colors flex items-center justify-center gap-1 text-xs font-medium px-3 ${
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
                            Current
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowStartMapPicker(true)}
                        style={{ height: '3rem', padding: '0 0.75rem', minWidth: '70px' }}
                        className="border-2 border-[#FFD166] text-black rounded-xl hover:bg-[#FFD166]/10 transition-colors flex items-center justify-center gap-1 text-xs font-medium"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Map
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-semibold text-gray-800">🎯 Destination</label>
                      <button
                        type="button"
                        onClick={handleRoundTripToggle}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all ${isRoundTrip ? 'bg-[#FFD166] text-black font-medium' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Round Trip
                        </span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="flex-1 text-sm bg-white border-2 border-[#e6f4ef] px-3 py-3 rounded-xl focus:border-[#46a080] focus:ring-2 focus:ring-[#46a080]/20 focus:outline-none transition-all duration-200 placeholder-[#46a080]"
                        placeholder="Where would you like to go?"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEndMapPicker(true)}
                        className="border-2 border-[#e6f4ef] text-[#0c1c17] rounded-xl hover:bg-[#e6f4ef] transition-colors flex items-center justify-center gap-1 text-xs font-medium px-3"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Map
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">⏰ Duration</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Few Hours', 'Half Day', 'Full Day', 'Few Days'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setDuration(option.toLowerCase().replace(' ', '-'))}
                          className={`flex items-center justify-center text-center px-3 py-2 rounded-xl ${
                            duration === option.toLowerCase().replace(' ', '-')
                              ? 'bg-[#46a080] text-white border-2 border-[#46a080]'
                              : 'bg-white border-2 border-[#e6f4ef] hover:border-[#46a080] hover:bg-[#e6f4ef] text-[#0c1c17]'
                          } transition-all duration-200 text-sm font-medium`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">🎯 Activity Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActivityType('surprise-me');
                          setIsCustomActivity(false);
                        }}
                        className={`border-2 px-3 py-2 rounded-xl ${
                          activityType === 'surprise-me'
                            ? 'bg-[#46a080] text-white border-[#46a080]'
                            : 'bg-white border-[#e6f4ef] hover:border-[#46a080] hover:bg-[#e6f4ef] text-[#0c1c17]'
                        } transition-all duration-200 text-xs font-medium flex items-center justify-center text-center`}
                      >
                        ✨ Surprise me! ✨
                      </button>
                      {['Hiking', 'Cycling', 'Running', 'Picnic', 'Photography', 'Foodie Trip', 'Bird Watching', 'City Tour'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setActivityType(option.toLowerCase().replace(' ', '-'));
                            setIsCustomActivity(false);
                          }}
                          className={`border-2 px-2 py-2 rounded-xl ${
                            activityType === option.toLowerCase().replace(' ', '-')
                              ? 'bg-[#46a080] text-white border-[#46a080]'
                              : 'bg-white border-[#e6f4ef] hover:border-[#46a080] hover:bg-[#e6f4ef] text-[#0c1c17]'
                          } transition-all duration-200 text-xs font-medium flex items-center justify-center text-center`}
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
                          style={{ borderRadius: '12px', padding: '0.5rem', minHeight: '2.5rem' }}
                          className={`border-2 ${
                            activityType === 'custom'
                              ? 'bg-[#FFD166] text-black shadow-sm border-[#FFD166]'
                              : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-700'
                          } transition-colors duration-200 text-xs font-medium flex items-center justify-center`}
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
                            style={{ height: '2.5rem', padding: '0.75rem', borderRadius: '12px' }}
                            className="flex-1 text-sm bg-white border-2 border-gray-100 shadow-sm focus:border-[#FFD166] focus:ring-2 focus:ring-[#FFD166]/20"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setIsCustomActivity(false)}
                            style={{ height: '2.5rem', padding: '0 0.75rem', borderRadius: '12px' }}
                            className="border-2 border-gray-100 bg-white hover:bg-gray-50 text-gray-500 text-xs font-medium flex items-center justify-center"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">🕐 When to start?</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setStartDate(new Date());
                            setIsCustomDate(false);
                          }}
                          className={`border-2 px-3 py-2 rounded-xl ${
                            !isCustomDate 
                              ? 'bg-[#46a080] text-white border-[#46a080]' 
                              : 'bg-white border-[#e6f4ef] hover:border-[#46a080] hover:bg-[#e6f4ef] text-[#0c1c17]'
                          } transition-all duration-200 text-sm font-medium flex items-center justify-center`}
                        >
                        🏃‍♂️ Let's go now!
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCustomDate(true)}
                        className={`border-2 px-3 py-2 rounded-xl ${
                          isCustomDate 
                            ? 'bg-[#46a080] text-white border-[#46a080]' 
                            : 'bg-white border-[#e6f4ef] hover:border-[#46a080] hover:bg-[#e6f4ef] text-[#0c1c17]'
                        } transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        📅 Pick date/time
                      </button>
                    </div>
                    {isCustomDate && (
                      <div className="p-3 border-2 border-[#FFD166] rounded-xl bg-white space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 w-12">Start:</span>
                          <input
                            type="datetime-local"
                            value={startDate.toISOString().slice(0, 16)}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                            style={{ height: '2.5rem', padding: '0.5rem', borderRadius: '8px' }}
                            className="flex-1 text-sm bg-white border border-gray-200 shadow-sm focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 w-12">End:</span>
                          <input
                            type="datetime-local"
                            value={endDate.toISOString().slice(0, 16)}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                            style={{ height: '2.5rem', padding: '0.5rem', borderRadius: '8px' }}
                            className="flex-1 text-sm bg-white border border-gray-200 shadow-sm focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !location.trim() || (quotaInfo && quotaInfo.adventures_remaining === 0)}
                    className="w-full bg-[#46a080] text-white font-bold text-lg hover:bg-[#019863] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-0 px-8 py-4 rounded-xl mt-6"
                  >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Creating Your Adventure...</span>
                        </>
                      ) : !location.trim() ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Enter Start Location First</span>
                        </>
                      ) : quotaInfo && quotaInfo.adventures_remaining === 0 ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span>Daily Limit Reached</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
