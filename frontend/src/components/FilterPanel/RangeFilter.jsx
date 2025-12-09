import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FilterPanel.css';

const RangeFilter = ({ 
  title, 
  minValue, 
  maxValue, 
  currentMin, 
  currentMax,
  onApply,
  onClear,
  isOpen,
  onToggle,
  className = ''
}) => {
  const [localMin, setLocalMin] = useState(currentMin || '');
  const [localMax, setLocalMax] = useState(currentMax || '');
  
  const handleApply = () => {
    onApply(localMin, localMax);
  };
  
  const handleClear = () => {
    setLocalMin('');
    setLocalMax('');
    onClear();
  };
  
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
          <div className="range-inputs">
            <div>
              <label className="range-label">Min</label>
              <input
                type="number"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                min={minValue}
                max={localMax || maxValue}
                className="range-input"
                placeholder={minValue?.toString()}
              />
            </div>
            <span className="range-separator">to</span>
            <div>
              <label className="range-label">Max</label>
              <input
                type="number"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                min={localMin || minValue}
                max={maxValue}
                className="range-input"
                placeholder={maxValue?.toString()}
              />
            </div>
          </div>
          
          <div className="range-actions">
            <button
              onClick={handleClear}
              className="filter-clear-btn"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="filter-apply-btn"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeFilter;