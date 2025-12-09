import React, { useRef, useEffect, useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import './styles/SalesTable.css';

const SalesTable = ({ 
  data, 
  visibleColumns, 
  loading,
  sortConfig,
  onSort 
}) => {
  const tableRef = useRef(null);
  const [columnWidths, setColumnWidths] = useState({});
  
  useEffect(() => {
    if (!data.length || loading) return;
    
    const calculateWidths = () => {
      const tempWidths = {};
      
      const columnConfig = {
        'Transaction ID': { min: 120, max: 180, default: 140 },
        'Date': { min: 90, max: 120, default: 100 },
        'Customer ID': { min: 100, max: 150, default: 120 },
        'Customer Name': { min: 120, max: 200, default: 150 },
        'Phone Number': { min: 100, max: 150, default: 120 },
        'Gender': { min: 70, max: 90, default: 80 },
        'Age': { min: 60, max: 80, default: 70 },
        'Customer Region': { min: 100, max: 180, default: 140 },
        'Customer Type': { min: 80, max: 120, default: 100 },
        'Product ID': { min: 100, max: 150, default: 120 },
        'Product Name': { min: 120, max: 220, default: 180 },
        'Brand': { min: 90, max: 150, default: 120 },
        'Product Category': { min: 100, max: 160, default: 130 },
        'Quantity': { min: 60, max: 90, default: 80 },
        'Price per Unit': { min: 90, max: 140, default: 110 },
        'Discount Percentage': { min: 80, max: 120, default: 100 },
        'Total Amount': { min: 90, max: 140, default: 110 },
        'Final Amount': { min: 90, max: 140, default: 110 },
        'Payment Method': { min: 90, max: 160, default: 130 },
        'Order Status': { min: 80, max: 120, default: 100 },
        'Delivery Type': { min: 80, max: 120, default: 100 },
        'Store ID': { min: 90, max: 140, default: 110 },
        'Store Location': { min: 100, max: 180, default: 150 },
        'Salesperson ID': { min: 90, max: 140, default: 110 },
        'Employee Name': { min: 120, max: 200, default: 160 }
      };
      
      const sampleSize = Math.min(data.length, 50);
      
      Object.keys(columnConfig).forEach(colKey => {
        if (!visibleColumns[colKey]) return;
        
        let maxContentLength = 0;
        
        const headerLength = getTextWidth(colKey, '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto');
        
        for (let i = 0; i < sampleSize; i++) {
          const value = data[i][colKey];
          if (value != null) {
            const cellContent = renderCellForWidthCalc(data[i], colKey);
            const cellLength = getTextWidth(cellContent, '400 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto');
            maxContentLength = Math.max(maxContentLength, cellLength);
          }
        }
        
        const totalWidth = Math.max(headerLength, maxContentLength) + 40;
        
        const config = columnConfig[colKey];
        tempWidths[colKey] = Math.min(
          config.max,
          Math.max(config.min, totalWidth)
        );
      });
      
      setColumnWidths(tempWidths);
    };
    
    const getTextWidth = (text, font) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = font;
      return context.measureText(text).width;
    };
    
    const renderCellForWidthCalc = (item, column) => {
      const value = item[column];
      if (value == null) return '';
      
      switch (column) {
        case 'Gender':
        case 'Age':
        case 'Product Category':
        case 'Quantity':
          return value.toString();
        case 'Price per Unit':
        case 'Total Amount':
        case 'Final Amount':
          return formatCurrency(value);
        case 'Discount Percentage':
          return `${value}%`;
        case 'Order Status':
          return value;
        default:
          return value.toString();
      }
    };
    
    calculateWidths();
  }, [data, visibleColumns, loading]);
  
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner" />
        <p>Loading sales data...</p>
      </div>
    );
  }
  
  if (!data.length) {
    return (
      <div className="table-empty">
        <p>No data available</p>
      </div>
    );
  }
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  
  const renderCellContent = (item, column) => {
    const value = item[column];
    
    switch (column) {
      case 'Gender':
        return (
          <span 
            className={`gender-badge gender-${value?.toLowerCase()}`}
            title={value}
          >
            {value}
          </span>
        );
        
      case 'Age':
        return <span className="age-value">{value}</span>;
        
      case 'Product Category':
        return (
          <span className="category-badge" title={value}>
            {value}
          </span>
        );
        
      case 'Quantity':
        return (
          <span className="quantity-badge">
            {value?.toString().padStart(2, '0')}
          </span>
        );
        
      case 'Price per Unit':
        return <span className="price-value">{formatCurrency(value)}</span>;
        
      case 'Discount Percentage':
        return (
          <span className="discount-badge">
            {value}%
          </span>
        );
        
      case 'Total Amount':
        return <span className="amount-value">{formatCurrency(value)}</span>;
        
      case 'Final Amount':
        return (
          <span className="final-amount-badge">
            {formatCurrency(value)}
          </span>
        );
        
      case 'Order Status':
        return (
          <span 
            className={`status-badge status-${value?.toLowerCase()}`}
            title={value}
          >
            {value}
          </span>
        );
        
      default:
        return (
          <span className="cell-content" title={value}>
            {value}
          </span>
        );
    }
  };
  
  const columnHeaders = [
    { key: 'Transaction ID', label: 'Transaction ID', sticky: true },
    { key: 'Date', label: 'Date' },
    { key: 'Customer ID', label: 'Customer ID' },
    { key: 'Customer Name', label: 'Customer Name' },
    { key: 'Phone Number', label: 'Phone Number' },
    { key: 'Gender', label: 'Gender' },
    { key: 'Age', label: 'Age', align: 'center' },
    { key: 'Customer Region', label: 'Customer Region' },
    { key: 'Customer Type', label: 'Customer Type' },
    { key: 'Product ID', label: 'Product ID' },
    { key: 'Product Name', label: 'Product Name' },
    { key: 'Brand', label: 'Brand' },
    { key: 'Product Category', label: 'Product Category' },
    { key: 'Quantity', label: 'Quantity', align: 'center' },
    { key: 'Price per Unit', label: 'Price per Unit', align: 'center' },
    { key: 'Discount Percentage', label: 'Discount %', align: 'center' },
    { key: 'Total Amount', label: 'Total Amount', align: 'center' },
    { key: 'Final Amount', label: 'Final Amount', align: 'center' },
    { key: 'Payment Method', label: 'Payment Method' },
    { key: 'Order Status', label: 'Order Status' },
    { key: 'Delivery Type', label: 'Delivery Type' },
    { key: 'Store ID', label: 'Store ID' },
    { key: 'Store Location', label: 'Store Location' },
    { key: 'Salesperson ID', label: 'Salesperson ID' },
    { key: 'Employee Name', label: 'Employee Name' }
  ];
  
  return (
    <div className="sales-table-container">
      <div className="table-wrapper">
        <table className="sales-table" ref={tableRef}>
          <thead>
            <tr>
              {columnHeaders.map((col) => {
                if (!visibleColumns[col.key]) return null;
                const width = columnWidths[col.key] || 'auto';
                
                return (
                  <th
                    key={col.key}
                    style={{ 
                      width: `${width}px`,
                      minWidth: `${width}px`,
                      textAlign: col.align || 'left',
                      position: col.sticky ? 'sticky' : 'static',
                      left: col.sticky ? 0 : 'auto'
                    }}
                    className={`table-header ${col.sticky ? 'sticky-column' : ''}`}
                  >
                    <button
                      className="sortable-header"
                      onClick={() => onSort(col.key)}
                    >
                      <span className="header-content" title={col.label}>
                        {col.label}
                      </span>
                      {getSortIcon(col.key) && (
                        <span className="sort-icon">{getSortIcon(col.key)}</span>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                {columnHeaders.map((col) => {
                  if (!visibleColumns[col.key]) return null;
                  const width = columnWidths[col.key] || 'auto';
                  
                  return (
                    <td
                      key={col.key}
                      style={{ 
                        width: `${width}px`,
                        minWidth: `${width}px`,
                        textAlign: col.align || 'left',
                        position: col.sticky ? 'sticky' : 'static',
                        left: col.sticky ? 0 : 'auto'
                      }}
                      className={`table-cell ${col.sticky ? 'sticky-column' : ''}`}
                    >
                      {renderCellContent(item, col.key)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;