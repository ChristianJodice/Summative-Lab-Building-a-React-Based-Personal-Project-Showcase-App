import { renderHook, act } from '@testing-library/react';
import { useApi } from '../useApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('useApi Hook', () => {
  beforeEach(() => {
    (fetch).mockClear();
  });

  test('returns API functions', () => {
    const { result } = renderHook(() => useApi());

    expect(result.current.getProducts).toBeDefined();
    expect(result.current.getProduct).toBeDefined();
    expect(result.current.getStoreInfo).toBeDefined();
    expect(result.current.createProduct).toBeDefined();
    expect(result.current.updateProduct).toBeDefined();
    expect(result.current.deleteProduct).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('getProducts makes correct API call', async () => {
    const mockProducts = [{ id: 1, name: 'Test Product' }];
    (fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const { result } = renderHook(() => useApi());

    let products;
    await act(async () => {
      products = await result.current.getProducts();
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products', {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(products).toEqual(mockProducts);
  });

  test('createProduct makes correct API call', async () => {
    const mockProduct = {
      name: 'New Product',
      description: 'Test description',
      category: 'Audio',
      price: 99.99,
      stock: 10,
      image: 'https://example.com/image.jpg',
      featured: false,
    };
    const createdProduct = { id: 1, ...mockProduct };
    (fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => createdProduct,
    });

    const { result } = renderHook(() => useApi());

    let product;
    await act(async () => {
      product = await result.current.createProduct(mockProduct);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockProduct),
    });
    expect(product).toEqual(createdProduct);
  });

  test('updateProduct makes correct API call', async () => {
    const updates = { price: 149.99 };
    const updatedProduct = { id: 1, name: 'Test Product', price: 149.99 };
    (fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProduct,
    });

    const { result } = renderHook(() => useApi());

    let product;
    await act(async () => {
      product = await result.current.updateProduct(1, updates);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    expect(product).toEqual(updatedProduct);
  });

  test('deleteProduct makes correct API call', async () => {
    (fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => {},
    });

    const { result } = renderHook(() => useApi());

    await act(async () => {
      await result.current.deleteProduct(1);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products/1', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  test('handles API errors correctly', async () => {
    (fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useApi());

    await act(async () => {
      try {
        await result.current.getProducts();
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.error).toBe('Network error');
  });

  test('handles HTTP error responses', async () => {
    (fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useApi());

    await act(async () => {
      try {
        await result.current.getProducts();
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.error).toBe('HTTP error! status: 404');
  });

  test('sets loading state during API calls', async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch).mockReturnValueOnce(promise);

    const { result } = renderHook(() => useApi());

    act(() => {
      result.current.getProducts();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise({ ok: true, json: async () => [] });
    });

    expect(result.current.loading).toBe(false);
  });
}); 