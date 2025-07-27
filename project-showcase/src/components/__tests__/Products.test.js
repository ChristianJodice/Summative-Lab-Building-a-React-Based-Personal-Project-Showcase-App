import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Products from '../Products';

// Mock the useApi hook
const mockGetProducts = jest.fn();
const mockUpdateProduct = jest.fn();
const mockDeleteProduct = jest.fn();

jest.mock('../../hooks/useApi', () => ({
  useApi: () => ({
    getProducts: mockGetProducts,
    updateProduct: mockUpdateProduct,
    deleteProduct: mockDeleteProduct,
    loading: false,
    error: null,
  }),
}));

const mockProducts = [
  {
    id: 1,
    name: 'Test Product 1',
    description: 'Test Description 1',
    category: 'Audio',
    price: 99.99,
    stock: 10,
    image: 'https://example.com/image1.jpg',
    featured: true,
  },
  {
    id: 2,
    name: 'Test Product 2',
    description: 'Test Description 2',
    category: 'Wearables',
    price: 199.99,
    stock: 5,
    image: 'https://example.com/image2.jpg',
    featured: false,
  },
];

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Products Component', () => {
  beforeEach(() => {
    mockGetProducts.mockClear();
    mockUpdateProduct.mockClear();
    mockDeleteProduct.mockClear();
    mockGetProducts.mockResolvedValue(mockProducts);
  });

  test('renders products page title', () => {
    renderWithProviders(<Products />);
    
    expect(screen.getByText('Product Management')).toBeInTheDocument();
  });

  test('renders add new product button', () => {
    renderWithProviders(<Products />);
    
    const addButton = screen.getByText('Add New Product');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveAttribute('href', '/add-product');
  });

  test('renders search and filters section', () => {
    renderWithProviders(<Products />);
    
    expect(screen.getByText('Search & Filters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by name or description...')).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  test('renders filter inputs', () => {
    renderWithProviders(<Products />);
    
    expect(screen.getByLabelText('Min Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Price')).toBeInTheDocument();
    expect(screen.getByLabelText(/Featured Only/)).toBeInTheDocument();
  });

  test('search input filters products', () => {
    renderWithProviders(<Products />);
    
    const searchInput = screen.getByPlaceholderText('Search by name or description...');
    fireEvent.change(searchInput, { target: { value: 'Test Product 1' } });
    
    expect(searchInput).toHaveValue('Test Product 1');
  });

  test('category filter changes value', () => {
    renderWithProviders(<Products />);
    
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: 'Audio' } });
    expect(categorySelect).toHaveValue('Audio');
  });

  test('price range filters change values', () => {
    renderWithProviders(<Products />);
    
    const minPriceInput = screen.getByLabelText('Min Price');
    const maxPriceInput = screen.getByLabelText('Max Price');
    
    fireEvent.change(minPriceInput, { target: { value: '50' } });
    fireEvent.change(maxPriceInput, { target: { value: '150' } });
    
    expect(minPriceInput).toHaveValue(50);
    expect(maxPriceInput).toHaveValue(150);
  });

  test('featured only checkbox toggles', () => {
    renderWithProviders(<Products />);
    
    const featuredCheckbox = screen.getByLabelText(/Featured Only/);
    fireEvent.click(featuredCheckbox);
    
    expect(featuredCheckbox).toBeChecked();
  });

  test('shows results count', () => {
    renderWithProviders(<Products />);
    
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
  });
}); 