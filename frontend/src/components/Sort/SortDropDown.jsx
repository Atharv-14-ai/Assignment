import React from 'react';
import { ChevronDown } from 'lucide-react';
import './Sort.css';

const SortDropdown = ({ value, onChange, options, className = '' }) => {
  const sortOptions = options || [
    { value: 'date_desc', label: 'Date (Newest)' },
    { value: 'date_asc', label: 'Date (Oldest)' },
    { value: 'customer_asc', label: 'Customer (A-Z)' },
    { value: 'customer_desc', label: 'Customer (Z-A)' },
    { value: 'quantity_desc', label: 'Quantity (High-Low)' },
    { value: 'quantity_asc', label: 'Quantity (Low-High)' },
    { value: 'amount_desc', label: 'Amount (High-Low)' },
    { value: 'amount_asc', label: 'Amount (Low-High)' }
  ];
  
  return (
    <div className={`sort-dropdown ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sort-select"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            Sort by: {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="sort-chevron" />
    </div>
  );
};

export default SortDropdown;