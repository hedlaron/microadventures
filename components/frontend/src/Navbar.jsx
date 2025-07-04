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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e6f4ef]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4 text-[#0c1c17]">
            <div className="size-4">
              <img 
                src="/microadventures.svg" 
                alt="Microadventures Logo" 
                className="h-full w-full"
              />
            </div>
            <div 
              onClick={() => navigate('/')} 
              className="text-[#0c1c17] text-lg font-bold leading-tight tracking-[-0.015em] hover:text-[#46a080] transition-colors duration-200 cursor-pointer"
            >
              Microadventures
            </div>
          </div>
          
          <div className="flex items-center gap-9">
            <Link to="/about" className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#46a080] transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#46a080] transition-colors">
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/history" className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#46a080] transition-colors">
                History
              </Link>
            )}
            {!isAuthenticated && (
              <button 
                onClick={openLoginModal}
                className="flex items-center justify-center overflow-hidden rounded-xl h-10 bg-[#46a080] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-[#019863] transition-colors"
              >
                Get Started
              </button>
            )}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-[#e6f4ef] transition-colors duration-200 focus:outline-none px-2 py-1 rounded-lg"
                >
                  <div className="w-8 h-8 bg-[#46a080] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getUserName()?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[#0c1c17] text-sm font-medium">
                    {getUserName()}
                  </span>
                  <svg className="w-4 h-4 text-[#46a080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 bg-white rounded-xl border border-[#e6f4ef] z-[100] overflow-hidden mt-2 w-48">
                    <div className="bg-white border-b border-[#e6f4ef] p-3">
                      <div className="text-xs text-[#46a080] uppercase tracking-wider mb-1">Signed in as</div>
                      <div className="text-sm font-semibold text-[#0c1c17]">{getUserName()}</div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left text-sm text-[#0c1c17] hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center gap-2 p-3"
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