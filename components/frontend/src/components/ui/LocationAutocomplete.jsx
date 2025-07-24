import React, { useState, useEffect, useRef } from "react";

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Enter location...",
}) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const listboxRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Track if the input was changed by user
  const userChangedRef = useRef(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    userChangedRef.current = true;
  };

  useEffect(() => {
    let active = true;
    // Only trigger suggestions if user has typed (not just value set by geolocation)
    if (!userChangedRef.current) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }
    if (inputValue.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setSuggestions(data);
          setShowSuggestions(true);
        }
      })
      .catch(() => {
        if (active) setSuggestions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [inputValue]);

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.display_name);
    onChange(suggestion.display_name);
    setShowSuggestions(false);
  };

  // Hide suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (listboxRef.current && !listboxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={showSuggestions ? "location-listbox" : undefined}
        aria-expanded={showSuggestions}
        role="textbox"
        className="block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:ring-opacity-60 transition text-gray-800 bg-white placeholder-gray-400"
      />
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="absolute right-3 top-2 text-orange-500 animate-pulse"
        >
          <span>Loading...</span>
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="location-listbox"
          role="listbox"
          ref={listboxRef}
          className="absolute z-20 bg-white border border-orange-200 w-full mt-1 rounded-lg shadow-lg overflow-hidden"
        >
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              role="option"
              aria-selected={inputValue === s.display_name}
              tabIndex={-1}
              onClick={() => handleSuggestionClick(s)}
              className="px-4 py-2 cursor-pointer hover:bg-orange-100 focus:bg-orange-200 text-gray-900 transition-colors border-b last:border-b-0 border-orange-50"
            >
              <span className="block truncate font-medium">
                {s.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
