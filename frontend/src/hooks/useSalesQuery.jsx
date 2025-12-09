import { useState, useCallback, useEffect } from 'react';
import { getSales, getFilters } from '../services/api';
import { formatBackendData } from '../utils/helpers';
import useDebouncedValue from './useDebouncedValue';

const useSalesQuery = (initialParams = {}) => {
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    totalRevenue: 0,
    avgTransaction: 0,
    uniqueCustomers: 0
  });
  
  const [filtersMeta, setFiltersMeta] = useState({
    regions: [],
    genders: [],
    categories: [],
    paymentMethods: [],
    tags: []
  });
  
  const [params, setParams] = useState({
    search: '',
    regions: [],
    gender: [],
    categories: [],
    tags: [],
    paymentMethods: [],
    ageMin: '',
    ageMax: '',
    dateStart: '',
    dateEnd: '',
    sort: 'date_desc',
    page: 1,
    limit: 10,
    ...initialParams
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const debouncedSearch = useDebouncedValue(params.search, 500);
  
  useEffect(() => {
    const loadFiltersMeta = async () => {
      try {
        const result = await getFilters();
        setFiltersMeta(result);
      } catch (err) {
        console.error('Error loading filters:', err);
        setFiltersMeta({
          regions: ['North', 'South', 'East', 'West', 'Central'],
          genders: ['Male', 'Female'],
          categories: ['Electronics', 'Beauty', 'Fashion', 'Home'],
          paymentMethods: ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking'],
          tags: ['organic', 'smart', 'wireless', 'portable']
        });
      }
    };
    loadFiltersMeta();
  }, []);
  
  const loadSalesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiParams = {
        page: params.page,
        limit: params.limit,
        sort: params.sort,
      };
      
      if (debouncedSearch && debouncedSearch.trim() !== '') {
        apiParams.search = debouncedSearch.trim();
      }
      
      if (params.regions.length > 0) {
        apiParams.regions = params.regions;
      }
      if (params.gender.length > 0) {
        apiParams.gender = params.gender;
      }
      if (params.categories.length > 0) {
        apiParams.categories = params.categories;
      }
      if (params.paymentMethods.length > 0) {
        apiParams.paymentMethods = params.paymentMethods;
      }
      if (params.tags.length > 0) {
        apiParams.tags = params.tags;
      }
      if (params.ageMin) {
        apiParams.ageMin = params.ageMin;
      }
      if (params.ageMax) {
        apiParams.ageMax = params.ageMax;
      }
      if (params.dateStart) {
        apiParams.dateStart = params.dateStart;
      }
      if (params.dateEnd) {
        apiParams.dateEnd = params.dateEnd;
      }
      
      const result = await getSales(apiParams);
      
      const formattedItems = (result.data || result.items || []).map(item => formatBackendData(item));
      
      const totalRevenue = formattedItems.reduce((sum, item) => 
        sum + parseFloat(item['Final Amount'] || 0), 0
      );
      
      const avgTransaction = formattedItems.length > 0 
        ? totalRevenue / formattedItems.length 
        : 0;
      
      const uniqueCustomers = new Set(
        formattedItems.map(item => item['Customer ID']).filter(Boolean)
      ).size;
      
      setData({
        items: formattedItems,
        totalItems: result.totalItems || result.total || 0,
        totalPages: result.totalPages || Math.ceil((result.totalItems || result.total || 0) / params.limit) || 0,
        currentPage: result.currentPage || params.page,
        totalRevenue,
        avgTransaction,
        uniqueCustomers
      });
      
    } catch (err) {
      console.error('Error loading sales:', err);
      setError(err.message || 'Failed to load sales data');
      
      setData({
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: params.page,
        totalRevenue: 0,
        avgTransaction: 0,
        uniqueCustomers: 0
      });
    } finally {
      setLoading(false);
    }
  }, [params, debouncedSearch]);
  
  const updateParams = useCallback((newParams, options = { resetPage: false }) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
      page: options.resetPage ? 1 : (newParams.page !== undefined ? newParams.page : prev.page)
    }));
  }, []);
  
  const resetAllFilters = useCallback(() => {
    setParams({
      search: '',
      regions: [],
      gender: [],
      categories: [],
      tags: [],
      paymentMethods: [],
      ageMin: '',
      ageMax: '',
      dateStart: '',
      dateEnd: '',
      sort: 'date_desc',
      page: 1,
      limit: 10
    });
  }, []);
  
  useEffect(() => {
    loadSalesData();
  }, [loadSalesData]);
  
  return {
    data,
    filtersMeta,
    params,
    loading,
    error,
    updateParams,
    resetAllFilters,
    loadSalesData
  };
};

export default useSalesQuery;