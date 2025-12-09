import React from 'react';
import { Check } from 'lucide-react';
import '../../assets/styles/components.css';

const MultiSelectFilter = ({
  options = [],
  selected = [],
  onChange,
  searchable = false,
  placeholder = "Select options...",
  maxHeight = '200px'
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const toggleOption = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <div className="multi-select-filter">
      {searchable && (
        <div className={`multi-select-search ${isSearchFocused ? 'focused' : ''}`}>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      )}
      <div className="multi-select-options" style={{ maxHeight }}>
        {filteredOptions.length === 0 ? (
          <div className="multi-select-empty">No options found</div>
        ) : (
          filteredOptions.map((option) => (
            <label
              key={option.value}
              className="multi-select-option"
              title={option.label}
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggleOption(option.value)}
                className="multi-select-checkbox"
              />
              <span className="multi-select-checkmark">
                {selected.includes(option.value) && <Check size={12} />}
              </span>
              <span className="multi-select-label">{option.label}</span>
              {option.count !== undefined && (
                <span className="multi-select-count">{option.count}</span>
              )}
            </label>
          ))
        )}
      </div>
      {selected.length > 0 && (
        <div className="multi-select-selected-count">
          {selected.length} selected
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;