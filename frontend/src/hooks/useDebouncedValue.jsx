import { useState, useEffect, useRef } from 'react';

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);
  const latestValueRef = useRef(value);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // If value is empty, update immediately
    if (value === '') {
      setDebouncedValue(value);
      return;
    }

    // For short queries, delay less
    const adjustedDelay = value.length <= 2 ? 300 : delay;
    
    timerRef.current = setTimeout(() => {
      if (latestValueRef.current === value) {
        setDebouncedValue(value);
      }
    }, adjustedDelay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;