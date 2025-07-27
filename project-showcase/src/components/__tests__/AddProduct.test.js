import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import AddProduct from '../AddProduct';

// Mock the useApi hook
const mockCreateProduct = jest.fn();
const mockGetProducts = jest.fn();

jest.mock('../../hooks/useApi', () => ({
  useApi: () => ({
    createProduct: mockCreateProduct,
    getProducts: mockGetProducts,
    loading: false,
    error: null,
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

describe('AddProduct Component', () => {
  beforeEach(() => {
    mockCreateProduct.mockClear();
    mockGetProducts.mockClear();
    mockNavigate.mockClear();
    mockGetProducts.mockResolvedValue([
      { category: 'Audio' },
      { category: 'Wearables' },
    ]);
  });

  test('renders add product form', () => {
    renderWithProviders(<AddProduct />);
    
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByText('Product Information')).toBeInTheDocument();
    expect(screen.getByText('Product Preview')).toBeInTheDocument();
  });

  test('renders form fields', () => {
    renderWithProviders(<AddProduct />);
    
    expect(screen.getByLabelText(/Product Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stock/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image URL/)).toBeInTheDocument();
  });

  test('shows validation error for empty required fields', async () => {
    renderWithProviders(<AddProduct />);
    
    const submitButton = screen.getByText('Create Product');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Product name is required')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Product description is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(screen.getByText('Price must be greater than 0')).toBeInTheDocument();
    expect(screen.getByText('Image URL is required')).toBeInTheDocument();
  });

  test('validates price is greater than 0', async () => {
    renderWithProviders(<AddProduct />);
    
    const priceInput = screen.getByLabelText(/Price/);
    fireEvent.change(priceInput, { target: { value: '0' } });
    
    const submitButton = screen.getByText('Create Product');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Price must be greater than 0')).toBeInTheDocument();
    });
  });

  test('validates stock is not negative', async () => {
    renderWithProviders(<AddProduct />);
    
    const stockInput = screen.getByLabelText(/Stock/);
    fireEvent.change(stockInput, { target: { value: '-1' } });
    
    const submitButton = screen.getByText('Create Product');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Stock cannot be negative')).toBeInTheDocument();
    });
  });

  test('validates image URL format', async () => {
    renderWithProviders(<AddProduct />);
    
    const imageInput = screen.getByLabelText(/Image URL/);
    fireEvent.change(imageInput, { target: { value: 'invalid-url' } });
    
    const submitButton = screen.getByText('Create Product');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid image URL')).toBeInTheDocument();
    });
  });

  test('shows preview when form is filled', () => {
    renderWithProviders(<AddProduct />);
    
    const nameInput = screen.getByLabelText(/Product Name/);
    const descriptionInput = screen.getByLabelText(/Description/);
    const priceInput = screen.getByLabelText(/Price/);
    
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(priceInput, { target: { value: '99.99' } });
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  test('cancel button navigates back', () => {
    renderWithProviders(<AddProduct />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });
}); 