import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import './SearchInput.css';

const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  delay = 300,
  className = "",
  minLength = 1
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    onChange?.(newValue);
    
    if (!newValue.trim()) {
      setIsSearching(false);
      onSearch?.(newValue);
      return;
    }
    
    const optimizedDelay = newValue.length <= 2 ? 100 : delay;
    
    if (newValue.length >= minLength) {
      setIsSearching(true);
      timerRef.current = setTimeout(() => {
        onSearch?.(newValue.trim());
        setIsSearching(false);
      }, optimizedDelay);
    } else {
      setIsSearching(false);
    }
  }, [onChange, onSearch, delay, minLength]);

  const handleImmediateSearch = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (localValue.trim()) {
      onSearch?.(localValue.trim());
      setIsSearching(false);
    } else {
      onSearch?.('');
      setIsSearching(false);
    }
  }, [localValue, onSearch]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange?.('');
    setIsSearching(false);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    onSearch?.('');
    inputRef.current?.focus();
  }, [onChange, onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleImmediateSearch();
    } else if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleImmediateSearch, handleClear]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className={`search-input-container ${className}`}>
      <div className="search-input-wrapper">
        <div className="search-icon">
          {isSearching ? (
            <Loader2 size={18} className="search-loader" />
          ) : (
            <Search size={18} />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          aria-label="Search"
        />
        
        {localValue && (
          <button
            onClick={handleClear}
            className="search-clear-btn"
            aria-label="Clear search"
            type="button"
          >
            <X size={16} />
          </button>
        )}
        
        {localValue.length >= minLength && (
          <button
            onClick={handleImmediateSearch}
            className="search-action-btn"
            aria-label="Search"
            type="button"
          >
            Search
          </button>
        )}
      </div>
      
      {!localValue && (
        <div className="search-tips">
          <small>Try searching by customer name, product, or transaction ID</small>
        </div>
      )}
      
      {isSearching && (
        <div className="search-status">
          <small>Searching...</small>
        </div>
      )}
    </div>
  );
};

export default SearchInput;