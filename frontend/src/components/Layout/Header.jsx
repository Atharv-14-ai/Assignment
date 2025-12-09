import React, { useCallback } from 'react';
import SearchInput from '../Search/SearchInput';
import { RefreshCw, Download, Settings, HelpCircle } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ 
  searchValue, 
  onSearchChange, 
  onSearchSubmit,
  onRefresh, 
  onExport, 
  loading, 
  exporting, 
  dataLength 
}) => {
  const handleSearch = useCallback((value) => {
    onSearchChange?.(value);
    onSearchSubmit?.(value);
  }, [onSearchChange, onSearchSubmit]);

  return (
    <header className="header">
      <div className="header-search">
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearchSubmit}
          placeholder="Search customers, products, transaction IDs..."
          delay={200} // Reduced from 400ms
          minLength={1}
        />
      </div>
      
      <div className="header-actions">
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="header-action-btn"
          title="Refresh"
        >
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
        </button>
        
        <button 
          onClick={onExport}
          disabled={exporting || dataLength === 0}
          className="header-action-btn"
          title="Export"
        >
          <Download size={18} />
        </button>
        
        <button className="header-action-btn" title="Settings">
          <Settings size={18} />
        </button>
        
        <button className="header-action-btn" title="Help">
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;