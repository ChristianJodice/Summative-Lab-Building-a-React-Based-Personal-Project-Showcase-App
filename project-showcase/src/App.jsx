import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import AddProduct from './components/AddProduct';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem 0' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/add-product" element={<AddProduct />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 