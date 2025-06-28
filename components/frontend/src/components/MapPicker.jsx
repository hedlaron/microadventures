import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';

const MapPicker = ({ isOpen, onClose, onLocationSelect, title = "Select Location" }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (isOpen && !map) {
      // Dynamically load Leaflet when the modal opens
      import('leaflet').then(L => {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Make sure the container is available and not already initialized
        if (mapRef.current && !mapRef.current._leaflet_id) {
          // Initialize map
          const mapInstance = L.map(mapRef.current, {
            center: [37.7749, -122.4194], // Default to San Francisco
            zoom: 13
          });

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstance);

          let marker = null;

          // Handle map clicks
          mapInstance.on('click', (e) => {
            const { lat, lng } = e.latlng;
            
            // Remove existing marker
            if (marker) {
              mapInstance.removeLayer(marker);
            }

            // Add new marker
            marker = L.marker([lat, lng]).addTo(mapInstance);
            
            // Reverse geocode to get address
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
              .then(response => response.json())
              .then(data => {
                const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                setSelectedLocation({
                  lat,
                  lng,
                  address
                });
              })
              .catch(() => {
                setSelectedLocation({
                  lat,
                  lng,
                  address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
                });
              });
          });

          // Try to get user's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                mapInstance.setView([latitude, longitude], 13);
              },
              (error) => {
                console.log('Geolocation error:', error);
              }
            );
          }

          setMap(mapInstance);
        }
      });
    }

    // Cleanup function
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
      // Reset selected location when closing
      if (!isOpen) {
        setSelectedLocation(null);
      }
    };
  }, [isOpen]); // Remove map from dependencies

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      setSelectedLocation(null); // Reset selection
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedLocation(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative min-h-0">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-xs">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={16} />
              <span>Click on the map to select a location</span>
            </div>
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-md">
              <div className="text-sm text-gray-700">
                <div className="font-medium">Selected Location:</div>
                <div className="text-xs mt-1 text-gray-600 break-words">{selectedLocation.address}</div>
                <div className="text-xs text-gray-500">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedLocation
                ? 'bg-[#46a080] text-white hover:bg-[#019863]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
