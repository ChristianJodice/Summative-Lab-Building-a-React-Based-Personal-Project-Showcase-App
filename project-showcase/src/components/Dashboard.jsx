import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import '../styles/global.css';

const Dashboard = () => {
  const { getProducts, getStoreInfo, loading, error } = useApi();
  const [products, setProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, storeData] = await Promise.all([
          getProducts(),
          getStoreInfo()
        ]);
        setProducts(productsData);
        setStoreInfo(storeData[0] || null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, [getProducts, getStoreInfo]);

  const featuredProducts = products.filter(product => product.featured).slice(0, 3);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => product.stock < 10).length;

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
        borderRadius: '12px',
        padding: '3rem 2rem',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Welcome to TechGear Pro Admin
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
          {storeInfo?.description || 'Premium technology accessories and gadgets for the modern professional'}
        </p>
        <div className="flex flex-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn" style={{ backgroundColor: 'white', color: 'var(--accent-color)' }}>
            Manage Products
          </Link>
          <Link to="/add-product" className="btn btn-secondary" style={{ backgroundColor: 'transparent', border: '2px solid white' }}>
            Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-3 mb-4">
        <div className="card text-center">
          <h3 style={{ fontSize: '2rem', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
            {totalProducts}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>Total Products</p>
        </div>
        <div className="card text-center">
          <h3 style={{ fontSize: '2rem', color: 'var(--success-color)', marginBottom: '0.5rem' }}>
            {featuredProducts.length}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>Featured Products</p>
        </div>
        <div className="card text-center">
          <h3 style={{ fontSize: '2rem', color: lowStockProducts > 0 ? 'var(--warning-color)' : 'var(--success-color)', marginBottom: '0.5rem' }}>
            {lowStockProducts}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>Low Stock Items</p>
        </div>
      </div>

      {/* Store Information */}
      {storeInfo && (
        <div className="card mb-4">
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Store Information</h2>
          <div className="grid grid-2">
            <div>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>{storeInfo.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{storeInfo.description}</p>
              <div style={{ color: 'var(--text-secondary)' }}>
                <p>📞 {storeInfo.phone_number}</p>
                <p>📧 {storeInfo.email}</p>
                <p>📍 {storeInfo.address}</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-color)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '3rem',
                color: 'white',
              }}>
                🏪
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="card">
        <div className="flex flex-between mb-3">
          <h2 style={{ color: 'var(--text-primary)' }}>Featured Products</h2>
          <Link to="/products" className="btn btn-secondary">
            View All Products
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-3">
            {featuredProducts.map(product => (
              <div key={product.id} className="card" style={{ padding: '1rem' }}>
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
                />
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {product.name}
                </h3>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {product.description}
                </p>
                <div className="flex flex-between">
                  <span style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold', 
                    color: 'var(--accent-color)' 
                  }}>
                    ${product.price}
                  </span>
                  <span style={{ 
                    color: product.stock < 10 ? 'var(--warning-color)' : 'var(--success-color)',
                    fontSize: '0.9rem',
                  }}>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            No featured products available. Add some products and mark them as featured!
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 