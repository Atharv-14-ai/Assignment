import { useState, useCallback, useRef, useEffect } from 'react';
import { getSales } from '../services/api';
import { formatBackendData } from '../utils/helpers';

const useSmartSearch = (initialParams = {}) => {
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState({});
  const abortControllerRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  const search = useCallback(async (searchTerm, otherParams = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    abortControllerRef.current = new AbortController();
    
    if (!searchTerm.trim()) {
      setData({
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1
      });
      return;
    }
    
    const cacheKey = `${searchTerm}-${JSON.stringify(otherParams)}`;
    if (cache[cacheKey]) {
      setData(cache[cacheKey]);
      return;
    }
    
    setLoading(true);
    
    const delay = searchTerm.length <= 2 ? 100 : 300;
    
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const params = {
          search: searchTerm.trim(),
          page: 1,
          limit: 10,
          ...otherParams
        };
        
        const result = await getSales(params, {
          signal: abortControllerRef.current.signal
        });
        
        const formattedItems = (result.data || []).map(item => formatBackendData(item));
        
        const newData = {
          items: formattedItems,
          totalItems: result.totalItems || 0,
          totalPages: result.totalPages || 0,
          currentPage: 1
        };
        
        setCache(prev => {
          const newCache = { ...prev, [cacheKey]: newData };
          const keys = Object.keys(newCache);
          if (keys.length > 10) {
            delete newCache[keys[0]];
          }
          return newCache;
        });
        
        setData(newData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
        }
      } finally {
        setLoading(false);
      }
    }, delay);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [cache]);
  
  return { data, loading, search };
};

export default useSmartSearch;