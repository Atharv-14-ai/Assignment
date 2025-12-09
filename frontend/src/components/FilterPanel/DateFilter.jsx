import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import './FilterPanel.css';

const DateFilter = ({ 
  title = 'Date Range',
  currentStart = '',
  currentEnd = '',
  onApply,
  onClear,
  isOpen,
  onToggle,
  className = ''
}) => {
  const [localStart, setLocalStart] = useState(currentStart || '');
  const [localEnd, setLocalEnd] = useState(currentEnd || '');
  
  const handleApply = () => {
    onApply(localStart, localEnd);
  };
  
  const handleClear = () => {
    setLocalStart('');
    setLocalEnd('');
    onClear();
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className={`filter-section ${className}`}>
      <button 
        className="filter-header"
        onClick={onToggle}
      >
        <Calendar size={16} />
        <span>{title}</span>
        <span className={`filter-chevron ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="filter-content">
          <div className="date-inputs">
            <div>
              <label className="date-label">Start Date</label>
              <input
                type="date"
                value={localStart}
                onChange={(e) => setLocalStart(e.target.value)}
                max={localEnd || today}
                className="date-input"
                placeholder="Select start date"
              />
            </div>
            <div>
              <label className="date-label">End Date</label>
              <input
                type="date"
                value={localEnd}
                onChange={(e) => setLocalEnd(e.target.value)}
                min={localStart}
                max={today}
                className="date-input"
                placeholder="Select end date"
              />
            </div>
          </div>
          
          <div className="date-actions">
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

export default DateFilter;