import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, getUserName, logout, openLoginModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };
  
  return (
    <nav className="bg-gradient-to-r from-amber-50/80 to-yellow-50/80 backdrop-blur-sm border-b border-amber-200/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 px-1">
              <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="text-amber-900 font-semibold text-base hidden sm:block">MicroAdventures</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <Link 
                to="/plan" 
                className="text-amber-700 hover:text-amber-900 font-medium text-sm transition-colors duration-200 hover:underline decoration-amber-400 underline-offset-4"
              >
                Plan
              </Link>
            )}
            {isAuthenticated && (
              <Link 
                to="/history" 
                className="text-amber-700 hover:text-amber-900 font-medium text-sm transition-colors duration-200 hover:underline decoration-amber-400 underline-offset-4"
              >
                History
              </Link>
            )}
            <Link 
              to="/about" 
              className="text-amber-700 hover:text-amber-900 font-medium text-sm transition-colors duration-200 hover:underline decoration-amber-400 underline-offset-4"
            >
              About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={openLoginModal}
                  className="text-amber-700 hover:text-amber-900 font-medium text-sm transition-colors duration-200 px-1 py-1 hover:bg-amber-100/50 rounded-md"
                >
                  Sign In
                </button>
                <button
                  onClick={openLoginModal}
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-medium text-sm px-2 py-1.5 rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-1 py-1 hover:bg-amber-100/50 rounded-md transition-colors duration-200"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {getUserName()?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-amber-900 font-medium text-sm hidden sm:block">
                    {getUserName()}
                  </span>
                  <svg className="w-3 h-3 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-amber-100 z-50 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2 border-b border-amber-100">
                      <div className="text-xs text-amber-600 uppercase tracking-wider">Signed in as</div>
                      <div className="text-sm font-semibold text-amber-900">{getUserName()}</div>
                    </div>
                    <div className="md:hidden border-b border-gray-100">
                      <Link 
                        to="/plan" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                      >
                        Plan Adventure
                      </Link>
                      <Link 
                        to="/history" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                      >
                        History
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
