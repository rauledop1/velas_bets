import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import WorkshopGrid from './components/WorkshopGrid';
import Footer from './components/Footer';
import Login from './components/Login';
import Store from './components/Store';
import WhatsAppButton from './components/WhatsAppButton';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminOrders from './components/AdminOrders';
import { CartProvider } from './context/CartContext';


// ... (RecentItems and ErrorBoundary components remain unchanged)

function App() {
  const [user, setUser] = useState(false);
  const [products, setProducts] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [packages, setPackages] = useState([]);

  // Fetch Global Data from PostgreSQL
  const fetchData = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        // Categorize items
        setProducts(data.filter(i => i.type === 'Producto'));
        setWorkshops(data.filter(i => i.type === 'Taller'));
        setPackages(data.filter(i => i.type === 'Paquete'));
      }
    } catch (e) {
      console.error("Error loading products:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogin = () => setUser(true);
  const handleLogout = () => setUser(false);

  // Generic Handlers to sync with Backend
  const handleAdd = (setter, type) => async (item) => {
    try {
      const payload = { ...item, type };
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // Refresh all data to get the new ID and consistent state
        fetchData();
      } else {
        alert('Error al guardar en base de datos');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    }
  };

  // Optimistic updates for Edit (still local only for now)
  // TODO: Add PUT to server/index.js for Edits
  const handleEdit = (setter) => (updatedItem) => setter(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));

  const handleDelete = (setter) => async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Refresh all data
        fetchData();
      } else {
        alert('Error al eliminar producto');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    }
  };

  return (
    <Router>
      <CartProvider>
        <div className="app-container">
          <Header user={user} onLogout={handleLogout} />

          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <RecentItems products={products} workshops={workshops} packages={packages} />
              </>
            } />

            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/product/:id" element={<ProductDetail />} />

            <Route path="/admin/orders" element={<AdminOrders user={user} />} />

            <Route path="/store" element={
              <Store
                title="Tienda Tell Candles"
                user={user}
                products={products}
                onAddProduct={handleAdd(setProducts, 'Producto')}
                onEditProduct={handleEdit(setProducts)}
                onDeleteProduct={handleDelete(setProducts)}
              />
            } />

            <Route path="/workshops" element={
              <Store
                title="Talleres Tell Candles"
                user={user}
                products={workshops}
                onAddProduct={handleAdd(setWorkshops, 'Taller')}
                onEditProduct={handleEdit(setWorkshops)}
                onDeleteProduct={handleDelete(setWorkshops)}
              />
            } />

            <Route path="/packages" element={
              <Store
                title="Paquetes Tell Candles"
                user={user}
                products={packages}
                onAddProduct={handleAdd(setPackages, 'Paquete')}
                onEditProduct={handleEdit(setPackages)}
                onDeleteProduct={handleDelete(setPackages)}
              />
            } />

          </Routes>

          <Footer user={user} />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
