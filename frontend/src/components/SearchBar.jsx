import React from 'react';
import { Search, X } from 'lucide-react';
import './styles/SearchBar.css';

const SearchBar = ({ value, onChange, placeholder, onClear }) => {
  return (
    <div className="search-bar">
      <div className="search-icon">
        <Search size={18} />
      </div>
      <input
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="search-clear-btn"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;