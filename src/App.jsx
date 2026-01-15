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
  const getTime = (item) => item.createdAt ? new Date(item.createdAt).getTime() : 0;

  const allItems = [
    ...products.map(i => ({ ...i, type: 'Producto' })),
    ...workshops.map(i => ({ ...i, type: 'Taller' })),
    ...packages.map(i => ({ ...i, type: 'Paquete' }))
  ].sort((a, b) => getTime(b) - getTime(a)).slice(0, 10);

  const getTypeColor = (type) => {
    if (type === 'Producto') return '#FCB57B';
    if (type === 'Taller') return '#D65A68';
    return '#B4CBA9';
  };

  return (
    <section className="section container">
      <h2 style={{ textAlign: 'center', color: 'var(--color-text-header)' }}>Agregados Recientemente</h2>
      <div className="products-grid">
        {allItems.map((item, index) => {
          const numericPrice = parseFloat(item.price);
          const numericDiscount = parseFloat(item.discount || 0);
          const hasDiscount = numericDiscount > 0;
          const discountedPrice = hasDiscount
            ? (numericPrice - (numericPrice * (numericDiscount / 100))).toFixed(2)
            : numericPrice;

          return (
            <div key={index} className="card">
              <img src={item.image} alt={item.title} className="card-image" />
              <div className="card-content">
                <span className="card-badge" style={{ backgroundColor: getTypeColor(item.type) }}>{item.type}</span>
                <h4 className="card-title">{item.title}</h4>
                <p className="card-description">{item.description?.substring(0, 60)}...</p>

                <div className="price-container">
                  {hasDiscount && (
                    <>
                      <span className="original-price">${numericPrice}</span>
                      <span className="discount-label">-{numericDiscount}%</span>
                    </>
                  )}
                  <span className="final-price">${discountedPrice}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Error Boundary to catch runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Algo salió mal un error ha ocurrido.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Borrar Datos y Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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

  // Optimistic updates for Edit/Delete (since Backend endpoint for PUT/DELETE is not yet in index.js)
  // TODO: Add PUT/DELETE to server/index.js
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
    </Router>
  );
}

export default App;
