import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Dashboard from '../Dashboard';

// Mock the useApi hook
jest.mock('../../hooks/useApi', () => ({
  useApi: () => ({
    getProducts: jest.fn(),
    getStoreInfo: jest.fn(),
    loading: false,
    error: null,
  }),
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Welcome to TechGear Pro Admin')).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Manage Products')).toBeInTheDocument();
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
  });

  test('renders stats cards', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    expect(screen.getByText('Low Stock Items')).toBeInTheDocument();
  });

  test('renders store information section', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Store Information')).toBeInTheDocument();
  });

  test('renders featured products section', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    expect(screen.getByText('View All Products')).toBeInTheDocument();
  });
}); 