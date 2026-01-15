import React, { useState } from 'react';

// Sub-component for individual product card
const ProductCard = ({ image, title, description, price, discount, onDelete, isAdmin }) => {
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount || 0);
    const hasDiscount = numericDiscount > 0;

    const discountedPrice = hasDiscount
        ? (numericPrice - (numericPrice * (numericDiscount / 100))).toFixed(2)
        : numericPrice;

    const styles = {
        card: {
            backgroundColor: '#fff',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
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
        priceContainer: {
            marginTop: 'auto'
        },
        originalPrice: {
            textDecoration: 'line-through',
            color: '#999',
            fontSize: '0.9rem'
        },
        finalPrice: {
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'var(--color-accent)',
        },
        discountLabel: {
            fontSize: '0.8rem',
            color: 'var(--color-text-header)',
            fontWeight: 'bold',
            marginLeft: '0.5rem'
        },
        badge: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#D65A68',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            zIndex: 10
        },
        deleteButton: {
            backgroundColor: '#ff4d4d',
            color: '#fff',
            border: 'none',
            padding: '0.5rem',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '1rem',
            fontWeight: 'bold',
            width: '100%'
        }
    };

    return (
        <div style={styles.card}>
            {hasDiscount && (
                <div style={styles.badge}>-{numericDiscount}% SALE</div>
            )}
            <img src={image} alt={title} style={styles.image} />
            <div style={styles.content}>
                <h3 style={styles.title}>{title}</h3>
                <p style={styles.description}>{description}</p>

                <div style={styles.priceContainer}>
                    {hasDiscount ? (
                        <div>
                            <span style={styles.originalPrice}>${numericPrice}</span>
                            <span style={styles.finalPrice}> ${discountedPrice}</span>
                            <span style={styles.discountLabel}>Precio Rebajado</span>
                        </div>
                    ) : (
                        <div style={styles.finalPrice}>${numericPrice}</div>
                    )}
                </div>

                {isAdmin && (
                    <button onClick={onDelete} style={styles.deleteButton}>Eliminar Producto</button>
                )}
            </div>
        </div>
    );
};

const Store = ({ title, user, products, onAddProduct, onDeleteProduct }) => {
    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        price: '',
        discount: '0',
        image: null
    });

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setNewProduct({ ...newProduct, image: imageUrl });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newProduct.title || !newProduct.price || !newProduct.image) return;

        // Create a unique ID for deletion tracking, simple timestamp for now (or randomness)
        const productWithId = { ...newProduct, id: Date.now() };

        onAddProduct(productWithId);
        setNewProduct({ title: '', description: '', price: '', discount: '0', image: null });
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
        select: {
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontFamily: 'inherit',
            backgroundColor: '#fff'
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
        },
        label: {
            fontSize: '0.9rem',
            marginBottom: '-0.5rem',
            fontWeight: 'bold',
            color: 'var(--color-text-main)'
        }
    };

    // Generate discount options 5% - 55%
    const discountOptions = [];
    for (let i = 5; i <= 55; i += 5) {
        discountOptions.push(i);
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>{title || "Tienda Tell Candles"}</h1>

            {user && (
                <div style={styles.adminPanel}>
                    <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>✨ Panel de Administración: Agregar Producto</h3>
                    <form style={styles.formGroup} onSubmit={handleSubmit}>
                        <label style={styles.label}>Imagen del Producto</label>
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

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ ...styles.label, display: 'block', marginBottom: '0.5rem' }}>Precio ($)</label>
                                <input
                                    type="number"
                                    placeholder="Precio"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    style={{ ...styles.input, width: '100%' }}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ ...styles.label, display: 'block', marginBottom: '0.5rem' }}>Descuento (%)</label>
                                <select
                                    style={{ ...styles.select, width: '100%' }}
                                    value={newProduct.discount}
                                    onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                                >
                                    <option value="0">Sin descuento</option>
                                    {discountOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}%</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" style={styles.addButton}>Agregar Producto</button>
                    </form>
                </div>
            )}

            <div style={styles.grid}>
                {products.map((product, index) => (
                    <ProductCard
                        key={product.id || index}
                        {...product}
                        isAdmin={user}
                        onDelete={() => onDeleteProduct(product.id || index)} // Fallback to index if no ID (for initial dummy data)
                    />
                ))}
            </div>
        </div>
    );
};

export default Store;
