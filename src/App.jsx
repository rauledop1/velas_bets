import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import db from './firebase';
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
  // Combine all items, sort by timestamp (descending) assuming we add a timestamp field, or fallback to simple insert order
  // Since firestore IDs are random strings, we can't sort by ID. usage of a 'createdAt' field is recommended.
  // For this implementation, we will assume clientside sorting or just display as receive if timestamp missing.
  // Let's rely on array order for now or a simple random shuffle if needed, but 'created' timestamp is best practice.

  // Helper to try parsing 'createdAt' if it exists, else 0
  const getTime = (item) => item.createdAt ? item.createdAt : 0;

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

  const [products, setProducts] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [packages, setPackages] = useState([]);

  // Generic Firestore Hook
  const useCollection = (collectionName, setter) => {
    useEffect(() => {
      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setter(items);
      }, (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
      });

      return () => unsubscribe();
    }, [collectionName, setter]);
  };

  // Bind collections
  useCollection('products', setProducts);
  useCollection('workshops', setWorkshops);
  useCollection('packages', setPackages);


  const handleLogin = () => setUser(true);
  const handleLogout = () => setUser(false);

  // Generic Handlers for Firestore
  const handleAdd = (collectionName) => async (item) => {
    try {
      // Add timestamp for sorting
      const itemWithTimestamp = { ...item, createdAt: Date.now() };
      // We don't need to manually set ID, Firestore does it, but our UI might rely on it temporarily.
      // Actually, addDoc returns a ref with the ID. 
      // The onSnapshot listener will update the local state automatically with the new data from server.
      await addDoc(collection(db, collectionName), itemWithTimestamp);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error al guardar en la nube. Revisa tu conexión.");
    }
  };

  const handleDelete = (collectionName) => async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
      console.error("Error deleting document: ", e);
      alert("Error al eliminar. Intenta de nuevo.");
    }
  };

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
              onAddProduct={handleAdd('products')}
              onDeleteProduct={handleDelete('products')}
            />
          } />

          <Route path="/workshops" element={
            <Store
              title="Talleres Tell Candles"
              user={user}
              products={workshops}
              onAddProduct={handleAdd('workshops')}
              onDeleteProduct={handleDelete('workshops')}
            />
          } />

          <Route path="/packages" element={
            <Store
              title="Paquetes Tell Candles"
              user={user}
              products={packages}
              onAddProduct={handleAdd('packages')}
              onDeleteProduct={handleDelete('packages')}
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
