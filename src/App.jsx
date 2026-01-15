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

  // Hooks for state with localStorage
  const usePersistentState = (key, initialValue) => {
    const [state, setState] = useState(() => {
      try {
        const saved = localStorage.getItem(key);
        if (!saved) return initialValue;

        const parsed = JSON.parse(saved);
        // Ensure we don't get 'null' or mismatched types if we expect an array
        if (parsed === null || (Array.isArray(initialValue) && !Array.isArray(parsed))) {
          return initialValue;
        }
        // If array is valid but empty, return fallback data (if provided via initialValue param logic, but here we do it caller side)
        // Actually, let's keep it simple: return parsed.
        return parsed;
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return initialValue;
      }
    });

    useEffect(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
      }
    }, [key, state]);

    return [state, setState];
  };


  const [products, setProducts] = usePersistentState('tell_candles_products_v3', []);
  const [workshops, setWorkshops] = usePersistentState('tell_candles_workshops_v3', []);
  const [packages, setPackages] = usePersistentState('tell_candles_packages_v3', []);

  // Fetch Global Data (Simulating Database)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        if (response.ok) {
          const data = await response.json();
          // Only load if local storage is empty or to force sync?
          // For this use case "Global Sync", we want to ensure these items exist.
          // We will strategy: If products is empty, load data.
          // Better strategy: We can't easily merge without dupe checking.
          // Simplest: Check if we have 0 items. If 0, load from JSON.

          setProducts(prev => prev.length === 0 ? data.products : prev);
          setWorkshops(prev => prev.length === 0 ? data.workshops : prev);
          setPackages(prev => prev.length === 0 ? data.packages : prev);
        }
      } catch (e) {
        console.error("Error loading data.json", e);
      }
    };
    fetchData();
  }, []); // Run once on mount

  const handleLogin = () => setUser(true);
  const handleLogout = () => setUser(false);

  // EXPORT HANDLER
  const handleExport = () => {
    const exportData = {
      products,
      workshops,
      packages
    };

    // Copy as simple JSON for easy file replacement
    const exportString = JSON.stringify(exportData, null, 2);

    navigator.clipboard.writeText(exportString).then(() => {
      alert("¡Datos Copiados! Copia este texto y pégalo en el archivo 'public/data.json' en GitHub para actualizar la web globalmente.");
    }).catch(err => {
      console.error('Error al copiar: ', err);
      alert("Error al copiar los datos.");
    });
  };

  // Generic Handlers
  const handleAdd = (setter) => (item) => setter(prev => [item, ...prev]);
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

        <Footer user={user} onExport={handleExport} />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
