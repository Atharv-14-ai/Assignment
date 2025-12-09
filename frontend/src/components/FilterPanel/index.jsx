import React from 'react';
import { Filter, X } from 'lucide-react';
import FilterSection from './FilterSection';
import MultiSelectFilter from './MultiSelectFilter';
import RangeFilter from './RangeFilter';
import Button from '../UI/Button';
import '../../assets/styles/components.css';

const FilterPanel = ({ filtersMeta, params, updateParams, onClose, isMobile }) => {
  const getSelectedCount = (field) => {
    const value = params[field];
    return Array.isArray(value) ? value.length : value ? 1 : 0;
  };

  const clearAllFilters = () => {
    updateParams({
      regions: [],
      gender: [],
      categories: [],
      tags: [],
      paymentMethods: [],
      ageMin: '',
      ageMax: '',
      dateStart: '',
      dateEnd: ''
    }, { resetPage: true });
  };

  const totalActiveFilters = 
    getSelectedCount('regions') +
    getSelectedCount('gender') +
    getSelectedCount('categories') +
    getSelectedCount('tags') +
    getSelectedCount('paymentMethods') +
    (params.ageMin || params.ageMax ? 1 : 0) +
    (params.dateStart || params.dateEnd ? 1 : 0);

  return (
    <div className={`filter-panel ${isMobile ? 'mobile' : ''}`}>
      <div className="filter-panel-header">
        <div className="filter-header-title">
          <Filter size={18} />
          <span>Filters</span>
          {totalActiveFilters > 0 && (
            <span className="filter-active-badge">{totalActiveFilters}</span>
          )}
        </div>
        {onClose && (
          <button className="filter-close" onClick={onClose} aria-label="Close filters">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="filter-panel-body">
        {/* Region Filter */}
        <FilterSection 
          title="Region" 
          badgeCount={getSelectedCount('regions')}
        >
          <MultiSelectFilter
            options={filtersMeta?.regions?.map(r => ({ value: r, label: r })) || []}
            selected={params.regions || []}
            onChange={(values) => updateParams({ regions: values }, { resetPage: true })}
            searchable
            placeholder="Search regions..."
          />
        </FilterSection>

        {/* Gender Filter */}
        <FilterSection 
          title="Gender" 
          badgeCount={getSelectedCount('gender')}
        >
          <div className="gender-filters">
            {filtersMeta?.genders?.map(gender => (
              <label key={gender} className="gender-option">
                <input
                  type="checkbox"
                  checked={(params.gender || []).includes(gender)}
                  onChange={(e) => {
                    const newGender = e.target.checked
                      ? [...(params.gender || []), gender]
                      : (params.gender || []).filter(g => g !== gender);
                    updateParams({ gender: newGender }, { resetPage: true });
                  }}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Age Range Filter */}
        <FilterSection 
          title="Age Range" 
          badgeCount={params.ageMin || params.ageMax ? 1 : 0}
        >
          <RangeFilter
            min={18}
            max={100}
            value={{ min: params.ageMin || '', max: params.ageMax || '' }}
            onChange={({ min, max }) => updateParams({ ageMin: min, ageMax: max }, { resetPage: true })}
            unit=" years"
          />
        </FilterSection>

        {/* Category Filter */}
        <FilterSection 
          title="Category" 
          badgeCount={getSelectedCount('categories')}
        >
          <MultiSelectFilter
            options={filtersMeta?.categories?.map(c => ({ value: c, label: c })) || []}
            selected={params.categories || []}
            onChange={(values) => updateParams({ categories: values }, { resetPage: true })}
            searchable
            placeholder="Search categories..."
          />
        </FilterSection>

        {/* Tags Filter */}
        <FilterSection 
          title="Tags" 
          badgeCount={getSelectedCount('tags')}
        >
          <MultiSelectFilter
            options={filtersMeta?.tags?.map(t => ({ value: t, label: t })) || []}
            selected={params.tags || []}
            onChange={(values) => updateParams({ tags: values }, { resetPage: true })}
            searchable
            placeholder="Search tags..."
            maxHeight="150px"
          />
        </FilterSection>

        {/* Payment Method Filter */}
        <FilterSection 
          title="Payment Method" 
          badgeCount={getSelectedCount('paymentMethods')}
        >
          <MultiSelectFilter
            options={filtersMeta?.paymentMethods?.map(p => ({ value: p, label: p })) || []}
            selected={params.paymentMethods || []}
            onChange={(values) => updateParams({ paymentMethods: values }, { resetPage: true })}
          />
        </FilterSection>

        {/* Date Range Filter */}
        <FilterSection 
          title="Date Range" 
          badgeCount={params.dateStart || params.dateEnd ? 1 : 0}
        >
          <div className="date-range-filters">
            <div className="date-input-group">
              <label>From</label>
              <input
                type="date"
                value={params.dateStart || ''}
                onChange={(e) => updateParams({ dateStart: e.target.value }, { resetPage: true })}
                max={params.dateEnd || undefined}
              />
            </div>
            <div className="date-input-group">
              <label>To</label>
              <input
                type="date"
                value={params.dateEnd || ''}
                onChange={(e) => updateParams({ dateEnd: e.target.value }, { resetPage: true })}
                min={params.dateStart || undefined}
              />
            </div>
          </div>
        </FilterSection>
      </div>

      <div className="filter-panel-footer">
        <Button 
          variant="ghost" 
          onClick={clearAllFilters}
          disabled={totalActiveFilters === 0}
          fullWidth
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;