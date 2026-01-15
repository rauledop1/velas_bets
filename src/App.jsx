import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import WorkshopGrid from './components/WorkshopGrid';
import Footer from './components/Footer';
import Login from './components/Login';
import Store from './components/Store';
import WhatsAppButton from './components/WhatsAppButton';

// Reusing Store component logic for Workshops and Packages by passing different props
// Ideally we would rename Store to GenericGrid or similar, but for now we can alias imports or just reuse Store and pass "title" prop

const RecentItems = ({ products, workshops, packages }) => {
  // Combine all items, sort by createdAt (descending), take top 10

  // Helper to get time
  const getTime = (item) => item.createdAt ? new Date(item.createdAt).getTime() : 0;

  const allItems = [
    ...products.map(i => ({ ...i, type: 'Producto' })),
    ...workshops.map(i => ({ ...i, type: 'Taller' })),
    ...packages.map(i => ({ ...i, type: 'Paquete' }))
  ].sort((a, b) => getTime(b) - getTime(a)).slice(0, 10);

  const styles = {
    section: {
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column'
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    content: {
      padding: '1rem'
    },
    badge: {
      display: 'inline-block',
      padding: '0.2rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#fff'
    }
  };

  const getTypeColor = (type) => {
    if (type === 'Producto') return '#FCB57B';
    if (type === 'Taller') return '#D65A68';
    return '#B4CBA9';
  };

  return (
    <section style={styles.section}>
      <h2 style={{ textAlign: 'center', color: 'var(--color-text-header)' }}>Agregados Recientemente</h2>
      <div style={styles.grid}>
        {allItems.map((item, index) => (
          <div key={index} style={styles.card}>
            <img src={item.image} alt={item.title} style={styles.image} />
            <div style={styles.content}>
              <span style={{ ...styles.badge, backgroundColor: getTypeColor(item.type) }}>{item.type}</span>
              <h4 style={{ marginBottom: '0.5rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{item.description?.substring(0, 60)}...</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

function App() {
  const [user, setUser] = useState(false);

  // Hooks for state with localStorage
  const usePersistentState = (key, initialValue) => {
    const [state, setState] = useState(() => {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    });
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  };

  const [products, setProducts] = usePersistentState('tell_candles_products', []);
  const [workshops, setWorkshops] = usePersistentState('tell_candles_workshops', []);
  const [packages, setPackages] = usePersistentState('tell_candles_packages', []);

  const handleLogin = () => setUser(true);
  const handleLogout = () => setUser(false);

  // Generic Handlers
  const handleAdd = (setter) => (item) => setter(prev => [...prev, item]);
  const handleEdit = (setter) => (updatedItem) => setter(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  const handleDelete = (setter) => (id) => setter(prev => prev.filter(i => (i.id) !== id));

  return (
    <Router>
      <div className="app-container">
        <Header user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <RecentItems products={products} workshops={workshops} packages={packages} />
              <div style={{ textAlign: 'center', margin: '2rem' }}>
                <h3 style={{ color: '#999' }}>Explora nuestras secciones</h3>
              </div>
              <WorkshopGrid />
            </>
          } />

          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route path="/store" element={
            <Store
              title="Tienda Tell Candles"
              user={user}
              products={products}
              onAddProduct={handleAdd(setProducts)}
              onEditProduct={handleEdit(setProducts)}
              onDeleteProduct={handleDelete(setProducts)}
            />
          } />

          <Route path="/workshops" element={
            <Store
              title="Talleres Tell Candles"
              user={user}
              products={workshops}
              onAddProduct={handleAdd(setWorkshops)}
              onEditProduct={handleEdit(setWorkshops)}
              onDeleteProduct={handleDelete(setWorkshops)}
            />
          } />

          <Route path="/packages" element={
            <Store
              title="Paquetes Tell Candles"
              user={user}
              products={packages}
              onAddProduct={handleAdd(setPackages)}
              onEditProduct={handleEdit(setPackages)}
              onDeleteProduct={handleDelete(setPackages)}
            />
          } />

        </Routes>

        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
