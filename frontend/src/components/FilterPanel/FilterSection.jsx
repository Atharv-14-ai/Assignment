import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './FilterPanel.css';

const FilterSection = ({ 
  title, 
  options, 
  selectedValues = [], 
  onSelect, 
  onClear,
  isOpen,
  onToggle,
  type = 'checkbox',
  className = ''
}) => {
  return (
    <div className={`filter-section ${className}`}>
      <button 
        className="filter-header"
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown size={16} className={`filter-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="filter-content">
          {type === 'checkbox' && options?.map(option => (
            <label key={option} className="filter-option">
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelect([...selectedValues, option]);
                  } else {
                    onSelect(selectedValues.filter(v => v !== option));
                  }
                }}
              />
              <span className="filter-option-label">{option}</span>
              {selectedValues.includes(option) && <Check size={12} />}
            </label>
          ))}
          
          {type === 'radio' && options?.map(option => (
            <label key={option} className="filter-option">
              <input
                type="radio"
                checked={selectedValues.includes(option)}
                onChange={() => onSelect([option])}
              />
              <span className="filter-option-label">{option}</span>
            </label>
          ))}
          
          {selectedValues.length > 0 && (
            <button
              onClick={onClear}
              className="filter-clear-btn"
            >
              Clear Selection
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSection;