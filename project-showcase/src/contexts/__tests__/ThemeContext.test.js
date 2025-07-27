import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Test component to use the theme context
const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-status">
        {isDarkMode ? 'dark' : 'light'}
      </span>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('provides default dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  test('toggles theme when button is clicked', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    const themeStatus = screen.getByTestId('theme-status');

    // Initial state should be dark
    expect(themeStatus).toHaveTextContent('dark');

    // Click to toggle to light
    fireEvent.click(toggleButton);
    expect(themeStatus).toHaveTextContent('light');

    // Click to toggle back to dark
    fireEvent.click(toggleButton);
    expect(themeStatus).toHaveTextContent('dark');
  });

  test('persists theme preference in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');

    // Toggle to light theme
    fireEvent.click(toggleButton);

    // Check localStorage
    expect(localStorage.getItem('isDarkMode')).toBe('false');
  });

  test('loads theme preference from localStorage', () => {
    // Set light theme in localStorage
    localStorage.setItem('isDarkMode', 'false');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  test('sets data-theme attribute on document', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initial dark theme
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    const toggleButton = screen.getByTestId('toggle-theme');
    fireEvent.click(toggleButton);

    // Light theme
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
}); 