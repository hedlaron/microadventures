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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ebefed] px-10 py-3">
          <div className="flex items-center gap-4 text-[#121714]">
            <div className="size-4">
              <img 
                src="/microadventures.svg" 
                alt="Microadventures Logo" 
                className="h-full w-full"
              />
            </div>
            <Link to="/" className="text-[#121714] text-lg font-bold leading-tight tracking-[-0.015em]">
              Microadventures
            </Link>
          </div>
          
          <div className="flex items-center gap-8">
            <Link to="/about" className="text-[#121714] text-sm font-medium hover:text-gray-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-[#121714] text-sm font-medium hover:text-gray-600 transition-colors">
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/history" className="text-[#121714] text-sm font-medium hover:text-gray-600 transition-colors">
                History
              </Link>
            )}
            {!isAuthenticated && (
              <button 
                onClick={openLoginModal}
                className="px-4 py-1 bg-[#FFD166] text-black rounded-lg hover:bg-[#F4A261] font-medium transition-colors"
              >
                Login
              </button>
            )}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <svg className="w-5 h-5 text-[#121714]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#121714] text-sm font-medium">
                    {getUserName()}
                  </span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-[100]">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      Signed in as <br/>
                      <span className="font-medium">{getUserName()}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
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