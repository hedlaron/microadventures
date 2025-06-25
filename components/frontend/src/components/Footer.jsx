import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-white border-t border-[#ebefed]">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col gap-4 items-center justify-center py-8 text-sm text-gray-500">
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gray-700 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-gray-700 transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-gray-700 transition-colors">
              Contact
            </Link>
          </div>
          <div>
            © {currentYear} Microadventures. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;