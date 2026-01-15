import React, { useState } from 'react';

// Sub-component for individual product card
const ProductCard = ({ image, title, description, price }) => {
    const styles = {
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
            height: '250px',
            objectFit: 'cover'
        },
        content: {
            padding: '1rem',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
        },
        title: {
            color: 'var(--color-text-header)',
            marginBottom: '0.5rem',
            fontSize: '1.2rem'
        },
        description: {
            fontSize: '0.9rem',
            color: 'var(--color-text-main)',
            marginBottom: '1rem',
            flexGrow: 1
        },
        price: {
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'var(--color-accent)',
            marginTop: 'auto'
        }
    };

    return (
        <div style={styles.card}>
            <img src={image} alt={title} style={styles.image} />
            <div style={styles.content}>
                <h3 style={styles.title}>{title}</h3>
                <p style={styles.description}>{description}</p>
                <div style={styles.price}>${price}</div>
            </div>
        </div>
    );
};

const Store = ({ user, products, onAddProduct }) => {
    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        price: '',
        image: null
    });

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Create a local URL for preview
            const imageUrl = URL.createObjectURL(file);
            setNewProduct({ ...newProduct, image: imageUrl });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newProduct.title || !newProduct.price || !newProduct.image) return;

        onAddProduct(newProduct);
        // Reset form
        setNewProduct({ title: '', description: '', price: '', image: null });
        // Note: We need to clear the file input manually if we want to be perfect, but keeping it simple for now
        document.getElementById('product-image-input').value = '';
    };

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem'
        },
        header: {
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'var(--color-text-header)'
        },
        adminPanel: {
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '20px',
            marginBottom: '3rem',
            border: '2px dashed var(--color-accent)'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '600px',
            margin: '0 auto'
        },
        input: {
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontFamily: 'inherit'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
        },
        addButton: {
            padding: '1rem',
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            fontWeight: 'bold',
            cursor: 'pointer'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Tienda Sister's Nook</h1>

            {user && (
                <div style={styles.adminPanel}>
                    <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>✨ Panel de Administración: Agregar Producto</h3>
                    <form style={styles.formGroup} onSubmit={handleSubmit}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="product-image-input"
                            style={styles.input}
                            required
                        />
                        {newProduct.image && (
                            <img src={newProduct.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
                        )}
                        <input
                            type="text"
                            placeholder="Nombre del Producto"
                            value={newProduct.title}
                            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                            style={styles.input}
                            required
                        />
                        <textarea
                            placeholder="Descripción"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            style={{ ...styles.input, minHeight: '100px' }}
                        />
                        <input
                            type="number"
                            placeholder="Precio"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            style={styles.input}
                            required
                        />
                        <button type="submit" style={styles.addButton}>Agregar Producto</button>
                    </form>
                </div>
            )}

            <div style={styles.grid}>
                {products.map((product, index) => (
                    <ProductCard key={index} {...product} />
                ))}
            </div>
        </div>
    );
};

export default Store;
