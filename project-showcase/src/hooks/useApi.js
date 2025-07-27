import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3001';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // GET requests
  const getProducts = useCallback(async () => {
    return handleRequest('/products');
  }, [handleRequest]);

  const getProduct = useCallback(async (id) => {
    return handleRequest(`/products/${id}`);
  }, [handleRequest]);

  const getStoreInfo = useCallback(async () => {
    return handleRequest('/store_info');
  }, [handleRequest]);

  // POST request
  const createProduct = useCallback(async (productData) => {
    return handleRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }, [handleRequest]);

  // PATCH request
  const updateProduct = useCallback(async (id, updates) => {
    return handleRequest(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }, [handleRequest]);

  // DELETE request
  const deleteProduct = useCallback(async (id) => {
    return handleRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  }, [handleRequest]);

  return {
    loading,
    error,
    getProducts,
    getProduct,
    getStoreInfo,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}; 