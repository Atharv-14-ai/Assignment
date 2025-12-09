import React, { useState, useCallback, useEffect, useRef } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import SalesTable from '../components/SalesTable';
import PaginationControls from '../components/Pagination/PaginationControls';
import SortDropdown from '../components/Sort/SortDropdown';
import EmptyState from '../components/UI/EmptyState';
import FilterSection from '../components/FilterPanel/FilterSection';
import RangeFilter from '../components/FilterPanel/RangeFilter';
import DateFilter from '../components/FilterPanel/DateFilter';
import { formatCurrency } from '../utils/helpers';
import useSalesQuery from '../hooks/useSalesQuery';
import { Sliders, X, Check } from 'lucide-react';
import './Home.css';

const Home = () => {
  const {
    data,
    filtersMeta,
    params,
    loading,
    error,
    updateParams,
    resetAllFilters,
    loadSalesData
  } = useSalesQuery();
  
  const [searchTerm, setSearchTerm] = useState(params.search || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const searchDebounceRef = useRef(null);
  const dropdownRefs = {
    region: useRef(null),
    gender: useRef(null),
    age: useRef(null),
    category: useRef(null),
    payment: useRef(null),
    date: useRef(null),
    tags: useRef(null)
  };
  
  const [visibleColumns, setVisibleColumns] = useState({
    'Transaction ID': true,
    'Date': true,
    'Customer ID': true,
    'Customer Name': true,
    'Phone Number': true,
    'Gender': true,
    'Age': true,
    'Customer Region': true,
    'Customer Type': true,
    'Product ID': true,
    'Product Name': true,
    'Brand': true,
    'Product Category': true,
    'Tags': true,
    'Quantity': true,
    'Price per Unit': true,
    'Discount Percentage': true,
    'Total Amount': true,
    'Final Amount': true,
    'Payment Method': true,
    'Order Status': true,
    'Delivery Type': true,
    'Store ID': true,
    'Store Location': true,
    'Salesperson ID': true,
    'Employee Name': true
  });
  
  const getSortConfig = useCallback((sortValue) => {
    if (!sortValue) return { key: 'date', direction: 'desc' };
    
    const [field, order] = sortValue.split('_');
    let keyMap = {
      'date': 'Date',
      'customer': 'Customer Name',
      'quantity': 'Quantity',
      'amount': 'Final Amount',
    };
    
    return {
      key: keyMap[field] || 'Date',
      direction: order === 'desc' ? 'desc' : 'asc',
    };
  }, []);
  
  const sortConfig = getSortConfig(params.sort);
  
  useEffect(() => {
    setDateFilter({
      start: params.dateStart || '',
      end: params.dateEnd || ''
    });
  }, [params.dateStart, params.dateEnd]);
  
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    if (!value.trim()) {
      updateParams({ search: '', page: 1 });
      return;
    }
    
    const delay = value.length <= 2 ? 100 : 200;
    
    searchDebounceRef.current = setTimeout(() => {
      updateParams({ search: value.trim(), page: 1 });
    }, delay);
  }, [updateParams]);
  
  const handleSearchSubmit = useCallback((value) => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    updateParams({ search: value.trim(), page: 1 });
  }, [updateParams]);
  
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    const active = [];
    if (params.search) active.push({ type: 'search', label: `Search: "${params.search}"` });
    if (params.regions && params.regions.length > 0) active.push({ type: 'regions', label: `Regions: ${params.regions.join(', ')}` });
    if (params.gender && params.gender.length > 0) active.push({ type: 'gender', label: `Gender: ${params.gender.join(', ')}` });
    if (params.categories && params.categories.length > 0) active.push({ type: 'categories', label: `Categories: ${params.categories.join(', ')}` });
    if (params.tags && params.tags.length > 0) active.push({ type: 'tags', label: `Tags: ${params.tags.length} selected` });
    if (params.ageMin || params.ageMax) active.push({ type: 'age', label: `Age: ${params.ageMin || '0'}-${params.ageMax || '∞'}` });
    if (params.dateStart || params.dateEnd) active.push({ 
      type: 'date', 
      label: `Date: ${params.dateStart || 'Any'} to ${params.dateEnd || 'Any'}`
    });
    if (params.paymentMethods && params.paymentMethods.length > 0) active.push({ type: 'payment', label: `Payment: ${params.paymentMethods.length} selected` });
    setActiveFilters(active);
  }, [params]);
  
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  
  const handleSort = useCallback((key) => {
    const currentSort = params.sort;
    let newSortValue;
    let direction;
    
    switch (key) {
      case 'Date':
        direction = currentSort === 'date_desc' ? 'asc' : 'desc';
        newSortValue = direction === 'desc' ? 'date_desc' : 'date_asc';
        break;
      case 'Customer Name':
        direction = currentSort === 'customer_asc' ? 'desc' : 'asc';
        newSortValue = direction === 'asc' ? 'customer_asc' : 'customer_desc';
        break;
      case 'Quantity':
        direction = currentSort === 'quantity_desc' ? 'asc' : 'desc';
        newSortValue = direction === 'desc' ? 'quantity_desc' : 'quantity_asc';
        break;
      case 'Final Amount':
        direction = currentSort === 'amount_desc' ? 'asc' : 'desc';
        newSortValue = direction === 'desc' ? 'amount_desc' : 'amount_asc';
        break;
      default:
        newSortValue = 'date_desc';
    }
    
    updateParams({ sort: newSortValue });
  }, [params.sort, updateParams]);
  
  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const headers = [
        'Transaction ID', 'Date', 'Customer Name', 'Phone Number', 'Gender', 'Age',
        'Customer Region', 'Customer Type', 'Product Name', 'Brand', 'Product Category',
        'Quantity', 'Price per Unit', 'Discount Percentage', 'Total Amount', 'Final Amount',
        'Payment Method', 'Order Status', 'Delivery Type', 'Store Location', 'Employee Name'
      ];
      
      const csvContent = [
        headers.join(','),
        ...data.items.map(item => [
          item['Transaction ID'] || '',
          item['Date'] || '',
          `"${(item['Customer Name'] || '').replace(/"/g, '""')}"`,
          item['Phone Number'] || '',
          item['Gender'] || '',
          item['Age'] || '',
          item['Customer Region'] || '',
          item['Customer Type'] || '',
          `"${(item['Product Name'] || '').replace(/"/g, '""')}"`,
          item['Brand'] || '',
          item['Product Category'] || '',
          item['Quantity'] || 0,
          item['Price per Unit'] || 0,
          item['Discount Percentage'] || 0,
          item['Total Amount'] || 0,
          item['Final Amount'] || 0,
          item['Payment Method'] || '',
          item['Order Status'] || '',
          item['Delivery Type'] || '',
          item['Store Location'] || '',
          item['Employee Name'] || ''
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sales-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Export completed successfully!');
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  }, [data.items]);
  
  const handleRefresh = useCallback(() => {
    loadSalesData();
  }, [loadSalesData]);
  
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (params.search) count++;
    if (params.regions && params.regions.length > 0) count++;
    if (params.gender && params.gender.length > 0) count++;
    if (params.categories && params.categories.length > 0) count++;
    if (params.tags && params.tags.length > 0) count++;
    if (params.paymentMethods && params.paymentMethods.length > 0) count++;
    if (params.ageMin || params.ageMax) count++;
    if (params.dateStart || params.dateEnd) count++;
    return count;
  }, [params]);
  
  const removeFilter = useCallback((type) => {
    switch (type) {
      case 'search':
        updateParams({ search: '' }, { resetPage: true });
        setSearchTerm('');
        break;
      case 'regions':
        updateParams({ regions: [] }, { resetPage: true });
        break;
      case 'gender':
        updateParams({ gender: [] }, { resetPage: true });
        break;
      case 'categories':
        updateParams({ categories: [] }, { resetPage: true });
        break;
      case 'tags':
        updateParams({ tags: [] }, { resetPage: true });
        break;
      case 'age':
        updateParams({ ageMin: '', ageMax: '' }, { resetPage: true });
        break;
      case 'date':
        updateParams({ dateStart: '', dateEnd: '' }, { resetPage: true });
        setDateFilter({ start: '', end: '' });
        break;
      case 'payment':
        updateParams({ paymentMethods: [] }, { resetPage: true });
        break;
    }
  }, [updateParams]);
  
  const handleResetAllFilters = useCallback(() => {
    resetAllFilters();
    setSearchTerm('');
    setDateFilter({ start: '', end: '' });
  }, [resetAllFilters]);
  
  if (error && data.items.length === 0) {
    return (
      <div className="error-state">
        <h2>Unable to Load Data</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={handleRefresh} className="btn-primary">
            Retry
          </button>
          <button onClick={handleResetAllFilters} className="btn-secondary">
            Reset Filters
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <MainLayout
      title="Sales Management System Dashboard"
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      onSearchSubmit={handleSearchSubmit}
      onRefresh={handleRefresh}
      onExport={handleExport}
      loading={loading}
      exporting={exporting}
      dataLength={data.items.length}
    >
      <div className="filter-row">
        <div className="filter-dropdown" ref={dropdownRefs.region}>
          <FilterSection
            title="Customer Region"
            options={filtersMeta.regions || []}
            selectedValues={params.regions}
            onSelect={(values) => updateParams({ regions: values }, { resetPage: true })}
            onClear={() => updateParams({ regions: [] }, { resetPage: true })}
            isOpen={openDropdown === 'region'}
            onToggle={() => toggleDropdown('region')}
            type="checkbox"
          />
        </div>
        
        <div className="filter-dropdown" ref={dropdownRefs.gender}>
          <FilterSection
            title="Gender"
            options={filtersMeta.genders || []}
            selectedValues={params.gender}
            onSelect={(values) => updateParams({ gender: values }, { resetPage: true })}
            onClear={() => updateParams({ gender: [] }, { resetPage: true })}
            isOpen={openDropdown === 'gender'}
            onToggle={() => toggleDropdown('gender')}
            type="checkbox"
          />
        </div>
        
        <div className="filter-dropdown" ref={dropdownRefs.age}>
          <RangeFilter
            title="Age Range"
            minValue={0}
            maxValue={120}
            currentMin={params.ageMin}
            currentMax={params.ageMax}
            onApply={(min, max) => updateParams({ ageMin: min, ageMax: max }, { resetPage: true })}
            onClear={() => updateParams({ ageMin: '', ageMax: '' }, { resetPage: true })}
            isOpen={openDropdown === 'age'}
            onToggle={() => toggleDropdown('age')}
          />
        </div>
        
        <div className="filter-dropdown" ref={dropdownRefs.category}>
          <FilterSection
            title="Product Category"
            options={filtersMeta.categories || []}
            selectedValues={params.categories}
            onSelect={(values) => updateParams({ categories: values }, { resetPage: true })}
            onClear={() => updateParams({ categories: [] }, { resetPage: true })}
            isOpen={openDropdown === 'category'}
            onToggle={() => toggleDropdown('category')}
            type="checkbox"
          />
        </div>
        
        <div className="filter-dropdown" ref={dropdownRefs.tags}>
          <FilterSection
            title="Tags"
            options={filtersMeta.tags || []}
            selectedValues={params.tags}
            onSelect={(values) => updateParams({ tags: values }, { resetPage: true })}
            onClear={() => updateParams({ tags: [] }, { resetPage: true })}
            isOpen={openDropdown === 'tags'}
            onToggle={() => toggleDropdown('tags')}
            type="checkbox"
          />
        </div>
        
        <div className="filter-dropdown" ref={dropdownRefs.payment}>
          <FilterSection
            title="Payment Method"
            options={filtersMeta.paymentMethods || []}
            selectedValues={params.paymentMethods}
            onSelect={(values) => updateParams({ paymentMethods: values }, { resetPage: true })}
            onClear={() => updateParams({ paymentMethods: [] }, { resetPage: true })}
            isOpen={openDropdown === 'payment'}
            onToggle={() => toggleDropdown('payment')}
            type="checkbox"
          />
        </div>
        
        <div className="filter-dropdown" ref={dropdownRefs.date}>
          <DateFilter
            title="Date"
            currentStart={dateFilter.start}
            currentEnd={dateFilter.end}
            onApply={(start, end) => {
              updateParams({ 
                dateStart: start, 
                dateEnd: end 
              }, { resetPage: true });
              setOpenDropdown(null);
            }}
            onClear={() => {
              setDateFilter({ start: '', end: '' });
              updateParams({ dateStart: '', dateEnd: '' }, { resetPage: true });
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'date'}
            onToggle={() => toggleDropdown('date')}
          />
        </div>
        
        <SortDropdown
          value={params.sort}
          onChange={(value) => updateParams({ sort: value }, { resetPage: true })}
        />
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-label">Total units sold</div>
          <div className="stat-value">{data.totalUnitsSold || 10}</div> 
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Amount</div>
          <div className="stat-value">{formatCurrency(data.totalRevenue)}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Discount</div>
          <div className="stat-value">{formatCurrency(data.totalDiscount || 15000)}</div>
        </div>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="active-filters">
          <div className="active-filters-header">
            <span>Active Filters:</span>
            <button onClick={handleResetAllFilters} className="clear-all-btn">
              Clear All
            </button>
          </div>
          <div className="filter-chips">
            {activeFilters.map((filter, index) => (
              <span key={index} className="filter-chip">
                {filter.label}
                <button 
                  onClick={() => removeFilter(filter.type)}
                  className="filter-remove-btn"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      
      {!loading && data.items.length === 0 ? (
        <EmptyState
          title="No Transactions Found"
          message={getActiveFilterCount() > 0
            ? 'No transactions match your current filters. Try adjusting your search criteria.'
            : 'No sales data available for the selected criteria.'}
          actionText={getActiveFilterCount() > 0 ? "Clear All Filters" : undefined}
          onAction={getActiveFilterCount() > 0 ? handleResetAllFilters : undefined}
        />
      ) : (
        <div className="table-container">
          <SalesTable
            data={data.items}
            visibleColumns={visibleColumns}
            loading={loading}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          
          <PaginationControls
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            totalItems={data.totalItems}
            pageSize={params.limit}
            onPageChange={(page) => updateParams({ page })}
            onPageSizeChange={(size) => updateParams({ limit: size, page: 1 })}
          />
        </div>
      )}
      
      {mobileFiltersOpen && (
        <div className="mobile-filters-modal">
          <div className="mobile-filters-content">
            <div className="mobile-filters-header">
              <h3>Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mobile-filters-close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mobile-filters-body">
              <div className="mobile-filter-section">
                <h4>Region</h4>
                <div className="mobile-filter-chips">
                  {filtersMeta.regions?.map(region => (
                    <button
                      key={region}
                      className={`mobile-filter-chip ${params.regions?.includes(region) ? 'active' : ''}`}
                      onClick={() => {
                        const currentRegions = params.regions || [];
                        const newRegions = currentRegions.includes(region)
                          ? currentRegions.filter(r => r !== region)
                          : [...currentRegions, region];
                        updateParams({ regions: newRegions }, { resetPage: true });
                      }}
                    >
                      {region}
                      {params.regions?.includes(region) && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mobile-filter-section">
                <h4>Category</h4>
                <div className="mobile-filter-chips">
                  {filtersMeta.categories?.map(category => (
                    <button
                      key={category}
                      className={`mobile-filter-chip ${params.categories?.includes(category) ? 'active' : ''}`}
                      onClick={() => {
                        const currentCategories = params.categories || [];
                        const newCategories = currentCategories.includes(category)
                          ? currentCategories.filter(c => c !== category)
                          : [...currentCategories, category];
                        updateParams({ categories: newCategories }, { resetPage: true });
                      }}
                    >
                      {category}
                      {params.categories?.includes(category) && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mobile-filter-section">
                <h4>Tags</h4>
                <div className="mobile-filter-chips">
                  {filtersMeta.tags?.map(tag => (
                    <button
                      key={tag}
                      className={`mobile-filter-chip ${params.tags?.includes(tag) ? 'active' : ''}`}
                      onClick={() => {
                        const currentTags = params.tags || [];
                        const newTags = currentTags.includes(tag)
                          ? currentTags.filter(t => t !== tag)
                          : [...currentTags, tag];
                        updateParams({ tags: newTags }, { resetPage: true });
                      }}
                    >
                      {tag}
                      {params.tags?.includes(tag) && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mobile-filter-section">
                <h4>Gender</h4>
                <div className="mobile-filter-chips">
                  {filtersMeta.genders?.map(gender => (
                    <button
                      key={gender}
                      className={`mobile-filter-chip ${params.gender?.includes(gender) ? 'active' : ''}`}
                      onClick={() => {
                        const currentGender = params.gender || [];
                        const newGender = currentGender.includes(gender)
                          ? currentGender.filter(g => g !== gender)
                          : [...currentGender, gender];
                        updateParams({ gender: newGender }, { resetPage: true });
                      }}
                    >
                      {gender}
                      {params.gender?.includes(gender) && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mobile-filter-section">
                <h4>Payment Method</h4>
                <div className="mobile-filter-chips">
                  {filtersMeta.paymentMethods?.map(method => (
                    <button
                      key={method}
                      className={`mobile-filter-chip ${params.paymentMethods?.includes(method) ? 'active' : ''}`}
                      onClick={() => {
                        const currentMethods = params.paymentMethods || [];
                        const newMethods = currentMethods.includes(method)
                          ? currentMethods.filter(m => m !== method)
                          : [...currentMethods, method];
                        updateParams({ paymentMethods: newMethods }, { resetPage: true });
                      }}
                    >
                      {method}
                      {params.paymentMethods?.includes(method) && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mobile-filter-section">
                <h4>Age Range</h4>
                <div className="mobile-range-inputs">
                  <input
                    type="number"
                    placeholder="Min Age"
                    value={params.ageMin}
                    onChange={(e) => updateParams({ ageMin: e.target.value }, { resetPage: true })}
                    className="mobile-range-input"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max Age"
                    value={params.ageMax}
                    onChange={(e) => updateParams({ ageMax: e.target.value }, { resetPage: true })}
                    className="mobile-range-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="mobile-filters-footer">
              <button
                onClick={handleResetAllFilters}
                className="mobile-filter-btn secondary"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mobile-filter-btn primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Home;