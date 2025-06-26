import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdventurousBackground from './AdventurousBackground';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px); /* Only accounting for navbar */
  padding: 80px 0 2rem; /* Added top padding to prevent overlap with navbar */
  margin: 0 auto;
  
  /* When used as a child of another component with className home-embedded */
  .home-embedded & {
    min-height: unset;
    padding: 0;
    margin: 0;
  }

  @media (max-height: 700px) {
    align-items: flex-start;
    padding-top: 100px;
  }
`;

const PlanFormContainer = styled.div`
  position: relative;
  max-width: 600px; /* Reduced max width for a more compact form */
  width: 90%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  background: white;
  
  @media (max-width: 640px) {
    width: 95%;
  }
  
  @media (max-height: 800px) {
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }
`;

const PlanContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  @media (max-height: 700px) {
    padding-bottom: 1rem;
  }
`;

const Plan = () => {
  console.log('Plan component rendering');

  useEffect(() => {
    console.log('Plan component mounted');
    return () => console.log('Plan component unmounted');
  }, []);

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude},${longitude}`);
      });
    }
  };

  const handleRoundTripToggle = () => {
    setIsRoundTrip(!isRoundTrip);
    if (!isRoundTrip) {
      setDestination(location);
    }
  };

  return (
    <PageWrapper>
      <PlanFormContainer>
        {/* New adventurous background */}
        {/* No longer need background here as container has white background */}
        
        <PlanContainer>
          <div className="w-full">
            <div className="p-4 sm:p-6 relative">
                  <div className="relative">                <h1 className="mb-4 sm:mb-6 text-black text-lg sm:text-xl font-bold leading-tight flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Plan Your Microadventure
                  </h1>
              
                <form className="space-y-3 sm:space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Start Location</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-1 text-sm h-8 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                        placeholder="Enter start location"
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="px-2 py-1 h-8 border border-[#FFD166] text-black rounded-lg hover:bg-[#FFD166]/10 transition-colors flex items-center gap-1 text-xs"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Current Location
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
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full text-sm h-8 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#FFD166] focus:ring-[#FFD166]"
                      placeholder="Enter destination"
                    />
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
                    className="w-full px-6 py-2 mt-2 bg-[#FFD166] text-black rounded-lg hover:bg-[#F4A261] font-bold transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Create My Adventure Plan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </PlanContainer>
      </PlanFormContainer>
    </PageWrapper>
  );
};

export default Plan;
