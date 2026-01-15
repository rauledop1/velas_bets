import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import WorkshopGrid from './components/WorkshopGrid';
import Footer from './components/Footer';
import Login from './components/Login';
import Store from './components/Store';

function App() {
  const [user, setUser] = useState(false);

  // Initial dummy products with IDs and Discounts
  const [products, setProducts] = useState([
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
  ]);

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
