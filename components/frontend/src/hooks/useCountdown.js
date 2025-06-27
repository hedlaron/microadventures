import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for countdown timer
 * @param {number} initialSeconds - Initial seconds to count down from
 * @returns {Object} - { timeLeft, isExpired, formatTime, reset }
 */
export const useCountdown = (initialSeconds) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(initialSeconds <= 0);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setIsExpired(initialSeconds <= 0);
  }, [initialSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = useCallback((seconds) => {
    if (seconds <= 0) return "00:00:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const reset = useCallback((newSeconds) => {
    setTimeLeft(newSeconds);
    setIsExpired(newSeconds <= 0);
  }, []);

  return {
    timeLeft,
    isExpired,
    formatTime,
    reset
  };
};
