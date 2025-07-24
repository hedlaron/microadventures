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

  useEffect(() => {
    let active = true;
    if (inputValue.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/location?q=${encodeURIComponent(inputValue)}`)
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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

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
        className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition"
      />
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="absolute right-2 top-2"
        >
          <span>Loading...</span>
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="location-listbox"
          role="listbox"
          ref={listboxRef}
          className="absolute z-10 bg-white border w-full mt-1"
        >
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              role="option"
              aria-selected={inputValue === s.display_name}
              tabIndex={-1}
              onClick={() => handleSuggestionClick(s)}
              className="px-4 py-2 cursor-pointer hover:bg-orange-50"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
