import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/global.css';

const Navigation = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div className="container">
        <div className="flex flex-between">
          <div className="flex flex-center">
            <Link 
              to="/" 
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--accent-color)',
                textDecoration: 'none',
                marginRight: '2rem',
              }}
            >
              TechGear Pro Admin
            </Link>
          </div>

          <div className="flex flex-center" style={{ gap: '1rem' }}>
            <Link
              to="/"
              style={{
                color: isActive('/') ? 'var(--accent-color)' : 'var(--text-primary)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                backgroundColor: isActive('/') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/products"
              style={{
                color: isActive('/products') ? 'var(--accent-color)' : 'var(--text-primary)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                backgroundColor: isActive('/products') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              Products
            </Link>
            <Link
              to="/add-product"
              style={{
                color: isActive('/add-product') ? 'var(--accent-color)' : 'var(--text-primary)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                backgroundColor: isActive('/add-product') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              Add Product
            </Link>

            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-tertiary)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {isDarkMode ? '☀️' : '🌙'}
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 