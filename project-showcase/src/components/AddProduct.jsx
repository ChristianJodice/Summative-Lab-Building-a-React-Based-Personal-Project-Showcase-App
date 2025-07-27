import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import '../styles/global.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { createProduct, getProducts, loading, error } = useApi();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
    featured: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [imageError, setImageError] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const products = await getProducts();
      const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [getProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Product description is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    if (!formData.image.trim()) {
      errors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      errors.image = 'Please enter a valid image URL';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Reset image error when image URL changes
    if (field === 'image' && imageError) {
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createProduct(formData);
      setSuccessMessage('Product created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        stock: 0,
        image: '',
        featured: false,
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="container">
      <div className="flex flex-between mb-4">
        <h1 style={{ color: 'var(--text-primary)' }}>Add New Product</h1>
        <button onClick={handleCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      {successMessage && (
        <div className="success mb-4">{successMessage}</div>
      )}

      {error && (
        <div className="error mb-4">Error: {error}</div>
      )}

      <div className="grid grid-2">
        {/* Form */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Product Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className={`form-input ${validationErrors.name ? 'error' : ''}`}
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {validationErrors.name && (
                <p style={{ color: 'var(--error-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className={`form-input form-textarea ${validationErrors.description ? 'error' : ''}`}
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
              {validationErrors.description && (
                <p style={{ color: 'var(--error-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className={`form-input ${validationErrors.category ? 'error' : ''}`}
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="new">+ Add New Category</option>
              </select>
              {validationErrors.category && (
                <p style={{ color: 'var(--error-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {validationErrors.category}
                </p>
              )}
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${validationErrors.price ? 'error' : ''}`}
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                />
                {validationErrors.price && (
                  <p style={{ color: 'var(--error-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {validationErrors.price}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Stock *</label>
                <input
                  type="number"
                  min="0"
                  className={`form-input ${validationErrors.stock ? 'error' : ''}`}
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                />
                {validationErrors.stock && (
                  <p style={{ color: 'var(--error-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {validationErrors.stock}
                  </p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL *</label>
              <input
                type="url"
                className={`form-input ${validationErrors.image ? 'error' : ''}`}
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
              />
              {validationErrors.image && (
                <p style={{ color: 'var(--error-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {validationErrors.image}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Mark as Featured Product
              </label>
            </div>

            <div className="flex" style={{ gap: '1rem', marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Product Preview</h2>
          
          {formData.name ? (
            <div>
              {formData.image && !imageError && (
                <img
                  src={formData.image}
                  alt={formData.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                  }}
                  onError={() => setImageError(true)}
                />
              )}
              
              {formData.image && imageError && (
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
              
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {formData.name}
              </h3>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem',
                marginBottom: '1rem',
              }}>
                {formData.description || 'No description provided'}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                {formData.category && (
                  <span style={{ 
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginRight: '0.5rem',
                  }}>
                    {formData.category}
                  </span>
                )}
                {formData.featured && (
                  <span style={{ 
                    backgroundColor: 'var(--accent-color)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}>
                    Featured
                  </span>
                )}
              </div>
              
              <div className="flex flex-between">
                <span style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  color: 'var(--accent-color)' 
                }}>
                  ${formData.price.toFixed(2)}
                </span>
                <span style={{ 
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                }}>
                  Stock: {formData.stock}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: 'var(--text-secondary)',
              padding: '2rem',
            }}>
              <p>Fill out the form to see a preview of your product</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct; 