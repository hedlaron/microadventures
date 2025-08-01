import { Menu } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  primaryButtonRounded as _PRIMARY_BUTTON_ROUNDED,
  brandGradient as _BRAND_GRADIENT,
  linkHover as _LINK_HOVER,
  focusRing as _FOCUS_RING,
} from "../../utils/colors";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Mobile Hamburger Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-orange-200">
            <h2 className="text-xl font-bold text-[#0c1c17]">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl text-orange-500 font-bold"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent("open-about-modal"));
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-xs shadow-sm transition-colors duration-200 animate-pulse-soft focus:outline-none"
              style={{ animationDuration: "2.2s" }}
              aria-label="Learn more about this project"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16v-4m0-4h.01"
                />
              </svg>
              About this project
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent("open-contact-modal"));
              }}
              className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#F4A261] transition-colors bg-transparent border-none p-0 m-0"
              style={{ background: "none" }}
              aria-label="Contact"
            >
              Contact
            </button>
            {isAuthenticated && (
              <Link
                to="/plan"
                className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#F4A261] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Plan
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/history"
                className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#F4A261] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                History
              </Link>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#F4A261] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D84B40] transition-all duration-300 shadow-lg hover:shadow-xl hover:brightness-110 border-0 rounded-xl focus:ring-4 focus:ring-orange-300/25 min-w-[120px]"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Get Started
              </button>
            )}
            {/* Logout button for mobile menu */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate("/");
                }}
                className="flex items-center gap-2 text-[#0c1c17] text-sm font-medium bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg px-4 py-2 mt-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>
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
              onClick={() => navigate("/")}
              className="text-[#0c1c17] text-lg font-bold leading-tight tracking-[-0.015em] hover:text-[#F4A261] transition-colors duration-200 cursor-pointer"
            >
              Microadventures
            </div>
          </div>
          {/* Hamburger for mobile, nav links for desktop */}
          <div className="flex items-center gap-9">
            <button
              className="sm:hidden p-2 rounded-xl text-[#F4A261] hover:bg-orange-100 focus:outline-none"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
            <div className="hidden sm:flex items-center gap-9">
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-about-modal"))
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-xs shadow-sm transition-colors duration-200 animate-pulse-soft focus:outline-none"
                style={{ animationDuration: "2.2s" }}
                aria-label="Learn more about this project"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0-4h.01"
                  />
                </svg>
                About this project
              </button>
              {/* Soft pulse animation for About button */}
              <style>{`
        @keyframes pulse-soft {
          0%, 100% { box-shadow: 0 0 0 0 rgba(244,162,97,0.18); }
          50% { box-shadow: 0 0 0 6px rgba(244,162,97,0.32); }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2.2s cubic-bezier(0.4,0,0.6,1) infinite;
        }
      `}</style>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-contact-modal"))
                }
                className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#F4A261] transition-colors bg-transparent border-none p-0 m-0"
                style={{ background: "none" }}
                aria-label="Contact"
              >
                Contact
              </button>
              {isAuthenticated && (
                <Link
                  to="/plan"
                  className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#F4A261] transition-colors"
                >
                  Plan
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/history"
                  className="text-[#0c1c17] text-sm font-medium leading-normal hover:text-[#F4A261] transition-colors"
                >
                  History
                </Link>
              )}
              {!isAuthenticated && (
                <button
                  onClick={openLoginModal}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#F4A261] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D84B40] transition-all duration-300 shadow-lg hover:shadow-xl hover:brightness-110 border-0 rounded-xl focus:ring-4 focus:ring-orange-300/25 min-w-[120px]"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Get Started
                </button>
              )}
              {isAuthenticated && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-orange-50 transition-colors duration-200 focus:outline-none px-2 py-1 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F4A261] to-[#E76F51] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {getUserName()?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[#0c1c17] text-sm font-medium">
                      {getUserName()}
                    </span>
                    <svg
                      className="w-4 h-4 text-[#F4A261]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 bg-white rounded-xl border border-orange-200/50 z-[100] overflow-hidden mt-2 w-48">
                      <div className="bg-white border-b border-orange-200/50 p-3">
                        <div className="text-xs text-[#F4A261] uppercase tracking-wider mb-1">
                          Signed in as
                        </div>
                        <div className="text-sm font-semibold text-[#0c1c17]">
                          {getUserName()}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                          navigate("/");
                        }}
                        className="w-full text-left text-sm text-[#0c1c17] hover:bg-orange-50 hover:text-[#F4A261] transition-colors duration-200 flex items-center gap-2 p-3"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </nav>
  );
};

export default Navbar;
