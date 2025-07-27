import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import '../styles/global.css';

const Products = () => {
  const { getProducts, updateProduct, deleteProduct, loading, error } = useApi();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    featuredOnly: false,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }, [getProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Search query filter
    if (filters.query) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.query.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Featured only filter
    if (filters.featuredOnly) {
      filtered = filtered.filter(product => product.featured);
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = useCallback(async (product) => {
    try {
      await updateProduct(product.id, {
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
        featured: product.featured,
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  }, [updateProduct, fetchProducts]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  }, [deleteProduct, fetchProducts]);

  const handleImageError = (productId) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error loading products: {error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="flex flex-between mb-4">
        <h1 style={{ color: 'var(--text-primary)' }}>Product Management</h1>
        <Link to="/add-product" className="btn">
          Add New Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Search & Filters</h2>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Search Products</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name or description..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-3">
          <div className="form-group">
            <label className="form-label">Min Price</label>
            <input
              type="number"
              className="form-input"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Max Price</label>
            <input
              type="number"
              className="form-input"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                checked={filters.featuredOnly}
                onChange={(e) => handleFilterChange('featuredOnly', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Featured Only
            </label>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-3">
        <p style={{ color: 'var(--text-secondary)' }}>
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-3">
          {filteredProducts.map(product => (
            <div key={product.id} className="card">
              {!imageErrors.has(product.id) ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                  }}
                  onError={() => handleImageError(product.id)}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                }}>
                  Image failed to load
                </div>
              )}
              
              {editingProduct?.id === product.id ? (
                <div>
                  <input
                    type="text"
                    className="form-input mb-2"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                  <textarea
                    className="form-input form-textarea mb-2"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                  />
                  <select
                    className="form-input mb-2"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, category: e.target.value } : null)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="grid grid-2 mb-2">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Price"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Stock"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stock: Number(e.target.value) } : null)}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-input mb-2"
                    placeholder="Image URL"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, image: e.target.value } : null)}
                  />
                  <label className="form-label">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured}
                      onChange={(e) => setEditingProduct(prev => prev ? { ...prev, featured: e.target.checked } : null)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Featured
                  </label>
                  <div className="flex" style={{ gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      className="btn"
                      onClick={() => handleSave(editingProduct)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {product.name}
                  </h3>
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {product.description}
                  </p>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ 
                      backgroundColor: 'var(--bg-tertiary)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}>
                      {product.category}
                    </span>
                    {product.featured && (
                      <span style={{ 
                        backgroundColor: 'var(--accent-color)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        marginLeft: '0.5rem',
                      }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex flex-between mb-2">
                    <span style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold', 
                      color: 'var(--accent-color)' 
                    }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <span style={{ 
                      color: product.stock < 10 ? 'var(--warning-color)' : 'var(--success-color)',
                      fontSize: '0.9rem',
                    }}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="flex" style={{ gap: '0.5rem' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <p style={{ color: 'var(--text-secondary)' }}>
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Products; 