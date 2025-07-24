import React, { useState, useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";

const MapPicker = ({
  isOpen,
  onClose,
  onLocationSelect,
  title = "Select Location",
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Always cleanup map and state before (re)opening
    if (!isOpen) {
      if (map) {
        map.remove();
        setMap(null);
      }
      setSelectedLocation(null);
      // Remove any leftover map container content
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
      return;
    }

    // If opening, ensure container is clean
    if (mapRef.current && mapRef.current._leaflet_id) {
      // Remove old map instance if any
      mapRef.current._leaflet_id = null;
      mapRef.current.innerHTML = "";
    }

    // Dynamically load Leaflet when the modal opens
    import("leaflet").then((L) => {
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Make sure the container is available and not already initialized
      if (mapRef.current && !mapRef.current._leaflet_id) {
        // Initialize map
        const mapInstance = L.map(mapRef.current, {
          center: [37.7749, -122.4194], // Default to San Francisco
          zoom: 13,
        });

        // Add tile layer (CartoDB Voyager for modern, consistent style)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            attribution:
              "&copy; <a href='https://carto.com/attributions'>CARTO</a>",
          },
        ).addTo(mapInstance);

        let marker = null;

        // Handle map clicks
        mapInstance.on("click", (e) => {
          const { lat, lng } = e.latlng;

          // Remove existing marker
          if (marker) {
            mapInstance.removeLayer(marker);
          }

          // Add new marker
          marker = L.marker([lat, lng]).addTo(mapInstance);

          // Reverse geocode to get address
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          )
            .then((response) => response.json())
            .then((data) => {
              const address =
                data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
              setSelectedLocation({
                lat,
                lng,
                address,
              });
            })
            .catch(() => {
              setSelectedLocation({
                lat,
                lng,
                address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
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
              console.log("Geolocation error:", error);
            },
          );
        }

        setMap(mapInstance);
      }
    });

    // Cleanup function
    return () => {
      // Copy ref to variable for cleanup
      const ref = mapRef.current;
      if (map) {
        map.remove();
        setMap(null);
      }
      setSelectedLocation(null);
      if (ref) {
        ref.innerHTML = "";
      }
    };
  }, [isOpen, map]);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-[#e6f4ef] w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e6f4ef] flex-shrink-0">
          <h2 className="text-xl font-bold text-[#0c1c17] flex items-center gap-2 tracking-[-0.015em]">
            <span className="text-2xl">📍</span>
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#e6f4ef] rounded-xl transition-colors"
          >
            <X size={20} className="text-[#46a080]" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative min-h-0">
          <div ref={mapRef} className="w-full h-full rounded-b-xl" />

          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-[#e6f4ef] max-w-xs">
            <div className="flex items-center gap-2 text-sm text-[#0c1c17]">
              <MapPin size={16} className="text-[#46a080]" />
              <span className="font-medium">
                Click on the map to select a location
              </span>
            </div>
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-[#e6f4ef] max-w-md">
              <div className="text-sm text-[#0c1c17]">
                <div className="font-semibold text-[#0c1c17] mb-2 flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  Selected Location:
                </div>
                <div className="text-sm text-[#46a080] break-words mb-1">
                  {selectedLocation.address}
                </div>
                <div className="text-xs text-[#46a080] font-mono">
                  {selectedLocation.lat.toFixed(4)},{" "}
                  {selectedLocation.lng.toFixed(4)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e6f4ef] flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-3 text-[#0c1c17] bg-[#e6f4ef] rounded-xl hover:bg-[#cde9df] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className={`px-6 py-3 rounded-xl transition-colors duration-200 font-medium ${
              selectedLocation
                ? "bg-[#46a080] text-white hover:bg-[#019863]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
