import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, getUserName, logout, openLoginModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8" style={{ paddingRight: '2rem' }}>
        <header className="flex items-center justify-between" style={{ minHeight: '4.5rem' }}>
          <div className="flex items-center gap-3 text-[#121714]">
            <div style={{ width: '2.5rem', height: '2.5rem' }}>
              <img 
                src="/microadventures.svg" 
                alt="Microadventures Logo" 
                className="h-full w-full"
              />
            </div>
            <div 
              onClick={() => window.location.reload()} 
              className="text-[#121714] text-xl font-bold leading-tight tracking-[-0.015em] hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              Microadventures
            </div>
          </div>
          
          <div className="flex items-center" style={{ gap: '2rem' }}>
            <Link to="/about" className="text-[#121714] text-sm font-medium hover:text-[#FFD166] transition-colors px-3 py-2 rounded-md">
              About
            </Link>
            <Link to="/contact" className="text-[#121714] text-sm font-medium hover:text-[#FFD166] transition-colors px-3 py-2 rounded-md">
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/history" className="text-[#121714] text-sm font-medium hover:text-[#FFD166] transition-colors px-3 py-2 rounded-md">
                History
              </Link>
            )}
            {!isAuthenticated && (
              <button 
                onClick={openLoginModal}
                style={{ padding: '0.875rem 1.75rem', height: '3rem', borderRadius: '0.875rem' }}
                className="gradient-btn bg-gradient-to-r from-[#FFD166] to-[#F4A261] text-black font-bold hover:from-[#F4A261] hover:to-[#E76F51] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get Started
              </button>
            )}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem' }}
                  className="flex items-center gap-2 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-[#FFD166] hover:shadow-sm"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#FFD166] to-[#F4A261] rounded-full flex items-center justify-center">
                    <span className="text-black font-semibold text-sm">
                      {getUserName()?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[#121714] text-sm font-medium">
                    {getUserName()}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] overflow-hidden" style={{ marginTop: '0.75rem', width: '14rem' }}>
                    <div className="bg-gradient-to-r from-[#FFD166]/10 to-[#F4A261]/10 border-b border-gray-100" style={{ padding: '1rem 1.25rem' }}>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Signed in as</div>
                      <div className="text-sm font-semibold text-[#121714]">{getUserName()}</div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center gap-2"
                      style={{ padding: '0.875rem 1.25rem' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
      </div>
    </nav>
  );
};

export default Navbar;