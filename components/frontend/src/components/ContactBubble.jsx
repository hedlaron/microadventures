import React, { useState } from 'react';

const ContactBubble = () => {
  const [showBubble, setShowBubble] = useState(true);

  if (!showBubble) return null;

  return (
    <div className="fixed bottom-20 right-6 z-40 animate-bounce-once">
      <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 text-white px-6 py-4 rounded-3xl shadow-2xl max-w-sm transition-all duration-300 hover:brightness-110 animate-fade-in border border-green-300">
        <button
          onClick={() => setShowBubble(false)}
          className="absolute -top-3 -right-3 bg-white hover:bg-gray-100 text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center text-lg transition-all duration-200 hover:brightness-90 shadow-lg font-bold"
        >
          ×
        </button>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <span className="text-3xl animate-wave-constant inline-block">👋</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-relaxed text-white">
                Love what you see? Let's build something amazing together!
              </p>
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <a
              href="https://linkedin.com/in/hedlaron"
              target="_blank"
              rel="noopener noreferrer"                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 shadow-lg hover:shadow-xl"
                >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBubble;
