import React, { useState, useEffect } from 'react';

const About = ({ onClose }) => {
  const [backendVersion, setBackendVersion] = useState('Loading...');
  const [frontendVersion, setFrontendVersion] = useState(process.env.REACT_APP_VERSION || 'latest');

  useEffect(() => {
    const fetchBackendVersion = async () => {
      try {
        const response = await fetch('/api/version');
        const data = await response.json();
        setBackendVersion(data.version || 'Unknown');
      } catch (error) {
        console.error('Failed to fetch backend version: ', error);
        setBackendVersion('Error fetching version');
      }
    };

    fetchBackendVersion();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">About Us</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Frontend Version</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Image Version:</span>
              <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {frontendVersion}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Backend Version</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Image Version:</span>
              <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {backendVersion}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600">
              Plan short, exciting trips from a few hours to a few days, tailored to your location, time, and weather.
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;