import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 500000000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

export const getSales = async (params = {}, options = {}) => {
  try {
    const cacheKey = JSON.stringify(params);
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] != null && params[key] !== undefined) {
        if (Array.isArray(params[key]) && params[key].length > 0) {
          cleanParams[key] = params[key].join(',');
        } else if (!Array.isArray(params[key])) {
          cleanParams[key] = params[key];
        }
      }
    });
    
    const response = await API.get('/sales', {
      params: cleanParams,
      ...options
    });
    
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    if (cache.size > 50) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getFilters = async () => {
  try {
    const cacheKey = 'filters';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const response = await API.get('/sales/filters');
    
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    console.error('API: Error fetching filters:', error);
    return {
      regions: ['North', 'South', 'East', 'West', 'Central'],
      genders: ['Male', 'Female'],
      categories: ['Electronics', 'Beauty', 'Fashion', 'Home'],
      paymentMethods: ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking'],
      tags: ['organic', 'smart', 'wireless', 'portable']
    };
  }
};

export const clearCache = () => {
  cache.clear();
};

export default {
  getSales,
  getFilters,
  clearCache
};