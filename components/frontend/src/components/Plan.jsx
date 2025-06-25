import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ScrollingVerticalBars from './ScrollingVerticalBars';
import styled from 'styled-components';

const PlanContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
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
  const [activityType, setActivityType] = useState('hiking');
  const [startDate, setStartDate] = useState(new Date());
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
    <PlanContainer>
      <div className="fixed inset-0 -z-10">
        <ScrollingVerticalBars />
      </div>
      
      <div className="layout-container h-full">
        <main className="flex-1 pt-16"> {/* Reduced from pt-24 */}
          <div className="mx-auto max-w-[960px] px-5">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6"> {/* Reduced from p-8 */}
              <h1 className="mb-4 text-[#121714] text-xl font-bold leading-tight"> {/* Reduced from text-2xl and mb-8 */}
                Plan Your Adventure
              </h1>
              
              <form className="space-y-4"> {/* Reduced from space-y-6 */}
                <div className="space-y-1"> {/* Reduced from space-y-2 */}
                  <label className="block text-sm font-medium text-gray-700">Start Location</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#121714] focus:ring-[#121714]"
                      placeholder="Enter start location"
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="px-4 py-2 bg-[#121714] text-white rounded-lg hover:bg-[#1c231f]"
                    >
                      Use Current Location
                    </button>
                  </div>
                </div>

                <div className="space-y-1"> {/* Reduced from space-y-2 */}
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Destination</label>
                    <button
                      type="button"
                      onClick={handleRoundTripToggle}
                      className={`text-sm ${isRoundTrip ? 'text-[#121714] font-medium' : 'text-gray-500'}`}
                    >
                      Round Trip
                    </button>
                  </div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#121714] focus:ring-[#121714]"
                    placeholder="Enter destination"
                  />
                </div>

                <div className="space-y-1"> {/* Reduced from space-y-2 */}
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <div className="flex gap-2">
                    {['Few Hours', 'Half Day', 'Full Day', 'Few Days'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setDuration(option.toLowerCase().replace(' ', '-'))}
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                          duration === option.toLowerCase().replace(' ', '-')
                            ? 'bg-[#121714] text-white'
                            : 'bg-transparent border-gray-300 hover:bg-white/20'
                        } transition-colors duration-200`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1"> {/* Reduced from space-y-2 */}
                  <label className="block text-sm font-medium text-gray-700">Activity Type</label>
                  <div className="flex gap-2">
                    {['Hiking', 'Cycling', 'Urban Exploration', 'Walk and Dine'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setActivityType(option.toLowerCase().replace(' ', '-'))}
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                          activityType === option.toLowerCase().replace(' ', '-')
                            ? 'bg-[#121714] text-white'
                            : 'bg-transparent border-gray-300 hover:bg-white/20'
                        } transition-colors duration-200`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1"> {/* Reduced from space-y-2 */}
                  <label className="block text-sm font-medium text-gray-700">When to start?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate(new Date());
                        setIsCustomDate(false);
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        !isCustomDate ? 'bg-[#121714] text-white' : 'bg-transparent border-gray-300 hover:bg-white/20'
                      } transition-colors duration-200`}
                    >
                      Let's go now!
                    </button>
                    {isCustomDate ? (
                      <input
                        type="datetime-local"
                        value={startDate.toISOString().slice(0, 16)}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        className="flex-1 bg-transparent rounded-lg border-gray-300 shadow-sm focus:border-[#121714] focus:ring-[#121714]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsCustomDate(true)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white/20 transition-colors duration-200"
                      >
                        Pick a date/time
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#121714] text-white rounded-lg hover:bg-[#1c231f] font-medium" /* Reduced padding */
                >
                  Plan Adventure
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </PlanContainer>
  );
};

export default Plan;