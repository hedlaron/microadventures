import React, { useState, useRef } from "react";

// Simple OpenStreetMap Nominatim autocomplete
const NominatimURL =
  "https://nominatim.openstreetmap.org/search?format=json&q=";

const LocationAutocomplete = ({
  value,
  onChange,
  placeholder = "Enter location...",
  className = "",
  ...props
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleInputChange = async (e) => {
    const val = e.target.value;
    onChange(val);
    if (val.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(NominatimURL + encodeURIComponent(val));
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current.blur();
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        className={className}
        placeholder={placeholder}
        autoComplete="off"
        {...props}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 bg-white border border-orange-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-auto text-sm">
          {suggestions.map((s, idx) => (
            <li
              key={s.place_id}
              className="px-4 py-2 cursor-pointer hover:bg-orange-50"
              onClick={() => handleSuggestionClick(s)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
      {loading && (
        <div className="absolute right-3 top-3 w-4 h-4 animate-spin border-2 border-orange-400 border-t-transparent rounded-full"></div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
