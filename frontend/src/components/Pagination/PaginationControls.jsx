import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const PaginationControls = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 25, 50, 100],
  className = ''
}) => {
  if (totalPages <= 1) return null;
  
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        end = maxVisible;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisible + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (start > 1) {
        pages.unshift('...');
        pages.unshift(1);
      }
      
      if (end < totalPages) {
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  return (
    <div className={`pagination ${className}`}>
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {totalItems}
      </div>
      
      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="pagination-btn"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="page-numbers">
          {renderPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`page-number ${page === currentPage ? 'active' : ''} ${typeof page !== 'number' ? 'disabled' : ''}`}
              disabled={typeof page !== 'number'}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="pagination-btn"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="page-size-selector">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="page-size-select"
        >
          {pageSizes.map(size => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaginationControls;