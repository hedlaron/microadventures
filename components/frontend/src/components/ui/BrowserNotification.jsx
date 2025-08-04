import React, { useState, useEffect } from "react";

const BrowserNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the notification
    const isDismissed = localStorage.getItem("browser-notification-dismissed");

    if (isDismissed) {
      setDismissed(true);
      return;
    }

    // Detect if the browser is Chrome (simplified and more reliable)
    const isChrome = () => {
      const userAgent = navigator.userAgent;
      // Check for Chrome and exclude Edge, Opera, and other Chromium browsers
      return (
        userAgent.includes("Chrome") &&
        !userAgent.includes("Edg") &&
        !userAgent.includes("OPR") &&
        !userAgent.includes("Samsung")
      );
    };

    // Show notification if not Chrome and not dismissed
    if (!isChrome()) {
      setShowNotification(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowNotification(false);
    setDismissed(true);
    localStorage.setItem("browser-notification-dismissed", "true");
  };

  if (!showNotification || dismissed) {
    return null;
  }

  return (
    <div
      className="bg-white border-b border-gray-200 shadow-sm"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          <div className="flex items-center space-x-2.5">
            <div className="flex-shrink-0">
              <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900 leading-tight">
                Switch to Chrome for the best experience
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                Some features work better in Chrome.{" "}
                <a
                  href="https://www.google.com/chrome/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-600/30 underline-offset-1 hover:decoration-blue-700"
                >
                  Download Chrome
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleDismiss}
              className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserNotification;
