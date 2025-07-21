import React from "react";
import { useError } from "../../contexts/ErrorContext";

function ErrorMessage() {
  const { error, hideError } = useError();

  if (!error) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center animate-fade-in">
      {/* Error message content */}
      <div className="relative bg-gradient-to-br from-red-500 to-orange-600 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out scale-100 hover:scale-105 border-2 border-red-400">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-white opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Oops!</h2>
          <p className="text-lg font-medium opacity-90 mb-6">{error}</p>
          <button
            onClick={hideError}
            className="bg-white text-red-600 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out hover:bg-red-100 hover:text-red-700 transform hover:scale-110 shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
