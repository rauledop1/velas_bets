import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import WorkshopGrid from './components/WorkshopGrid';
import Footer from './components/Footer';
import Login from './components/Login';
import Store from './components/Store';

function App() {
  const [user, setUser] = useState(false);

  // Initial dummy products
  const initialProducts = [
    {
      id: 1,
      title: 'Kit de Velas Navideñas',
      description: 'Todo lo que necesitas para crear 3 velas aromáticas en casa.',
      price: '850',
      discount: '0',
      image: '/assets/hero_candles_1768444909390.png'
    },
    {
      id: 2,
      title: 'Vela Pumpkin Spice',
      description: 'Edición limitada de otoño con aroma a calabaza y canela.',
      price: '350',
      discount: '15',
      image: '/assets/workshop_christmas_latte_1768444923835.png'
    },
    {
      id: 3,
      title: 'Pack Regalo: Pino & Nieve',
      description: 'Dos velas en forma de pino con acabado nevado.',
      price: '600',
      discount: '0',
      image: '/assets/workshop_pine_tree_1768444938177.png'
    }
  ];

  // Initialize from localStorage or default
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('tell_candles_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('tell_candles_products', JSON.stringify(products));
  }, [products]);

  const handleLogin = () => {
    setUser(true);
  };

  const handleLogout = () => {
    setUser(false);
  };

  const handleAddProduct = (product) => {
    setProducts([...products, product]);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => (p.id || products.indexOf(p)) !== productId));
  };

  return (
    <Router>
      <div className="app-container">
        <Header user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <WorkshopGrid />
            </>
          } />

          <Route path="/login" element={
            <Login onLogin={handleLogin} />
          } />

          <Route path="/store" element={
            <Store
              user={user}
              products={products}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          } />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
