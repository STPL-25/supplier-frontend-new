import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook for making API requests using Axios
 * @param {string} url - The URL to fetch data from
 * @param {Object} options - Configuration options for the request
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {Object} options.headers - Request headers
 * @param {Object|null} options.data - Request body for POST/PUT requests
 * @param {Object} options.params - URL parameters
 * @param {boolean} options.withCredentials - Whether to include credentials
 * @param {boolean} options.autoFetch - Whether to fetch automatically on mount
 * @returns {Object} - { data, loading, error, refetch, cancel }
 */
const useFetch = (url, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    data = null,
    params = {},
    withCredentials = false,
    autoFetch = true,
  } = options;

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use to cancel ongoing requests
  const cancelTokenSource = axios.CancelToken.source();

  const fetchData = useCallback(async (overrideOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const requestConfig = {
        url,
        method,
        headers: { ...headers, ...overrideOptions.headers },
        params: { ...params, ...overrideOptions.params },
        data: overrideOptions.data !== undefined ? overrideOptions.data : data,
        withCredentials,
        cancelToken: cancelTokenSource.token,
      };

      const result = await axios(requestConfig);
      setResponse(result.data);
      return result.data;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
      } else {
        setError(err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, params, data, withCredentials]);

  // Cancel request on unmount
  useEffect(() => {
    return () => {
      cancelTokenSource.cancel('Component unmounted');
    };
  }, []);

  // Auto fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  const cancel = () => {
    cancelTokenSource.cancel('Request canceled by user');
  };

  return {
    data: response,
    loading,
    error,
    refetch: fetchData,
    cancel
  };
};

export default useFetch;