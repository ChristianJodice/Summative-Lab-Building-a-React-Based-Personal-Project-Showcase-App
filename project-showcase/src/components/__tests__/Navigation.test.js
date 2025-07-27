import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Navigation from '../Navigation';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Navigation Component', () => {
  test('renders navigation with all links', () => {
    renderWithProviders(<Navigation />);
    
    expect(screen.getByText('TechGear Pro Admin')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Add Product')).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    renderWithProviders(<Navigation />);
    
    const themeButton = screen.getByRole('button', { name: /dark|light/i });
    expect(themeButton).toBeInTheDocument();
  });

  test('theme toggle button shows correct initial state', () => {
    renderWithProviders(<Navigation />);
    
    const themeButton = screen.getByRole('button', { name: /dark|light/i });
    expect(themeButton).toHaveTextContent('Dark');
  });

  test('theme toggle button changes text when clicked', () => {
    renderWithProviders(<Navigation />);
    
    const themeButton = screen.getByRole('button', { name: /dark|light/i });
    fireEvent.click(themeButton);
    
    expect(themeButton).toHaveTextContent('Light');
  });

  test('navigation links have correct href attributes', () => {
    renderWithProviders(<Navigation />);
    
    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
    const productsLink = screen.getByRole('link', { name: 'Products' });
    const addProductLink = screen.getByRole('link', { name: 'Add Product' });
    
    expect(dashboardLink).toHaveAttribute('href', '/');
    expect(productsLink).toHaveAttribute('href', '/products');
    expect(addProductLink).toHaveAttribute('href', '/add-product');
  });
}); 