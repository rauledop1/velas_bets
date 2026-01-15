import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, image, title, description, price, discount, onDelete, onEdit, isAdmin }) => {
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
            position: 'relative',
            height: '100%',
            textDecoration: 'none',
            color: 'inherit'
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
            flexGrow: 1,
            whiteSpace: 'pre-line'
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
        buttonGroup: {
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem'
        },
        actionButton: {
            flex: 1,
            padding: '0.5rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            border: 'none',
            color: '#fff',
            zIndex: 2 // Ensure buttons are clickable above the Link
        },
        deleteButton: {
            backgroundColor: '#ff4d4d',
        },
        editButton: {
            backgroundColor: '#3498db',
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <Link to={`/product/${id}`} style={styles.card}>
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
                </div>
            </Link>

            {isAdmin && (
                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                    <div style={styles.buttonGroup}>
                        <button onClick={(e) => { e.preventDefault(); onEdit({ id, image, title, description, price, discount }); }} style={{ ...styles.actionButton, ...styles.editButton }}>Editar</button>
                        <button onClick={(e) => { e.preventDefault(); onDelete(); }} style={{ ...styles.actionButton, ...styles.deleteButton }}>Eliminar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Store = ({ title, user, products, onAddProduct, onEditProduct, onDeleteProduct }) => {
    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        price: '',
        discount: '0',
        image: null,
        options: '' // Comma separated string for UI
    });

    const [editingProduct, setEditingProduct] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newProduct.title || !newProduct.price || !newProduct.image) return;

        // Process options: split by comma, trim
        const optionsArray = newProduct.options
            ? newProduct.options.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const productPayload = {
            ...newProduct,
            id: Date.now(),
            options: optionsArray
        };

        onAddProduct(productPayload);
        setNewProduct({ title: '', description: '', price: '', discount: '0', image: null, options: '' });
        const fileInput = document.getElementById('product-image-input');
        if (fileInput) fileInput.value = '';
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        let optionsArray = [];
        if (typeof editingProduct.options === 'string') {
            optionsArray = editingProduct.options.split(',').map(s => s.trim()).filter(Boolean);
        } else if (Array.isArray(editingProduct.options)) {
            optionsArray = editingProduct.options; // Already array
        }

        const payload = { ...editingProduct, options: optionsArray };
        onEditProduct(payload);
        setEditingProduct(null);
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
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        closeButton: {
            float: 'right',
            cursor: 'pointer',
            fontSize: '1.5rem',
            background: 'none',
            border: 'none'
        }
    };

    // Generate discount options
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
                        {/* Add Form Inputs - Reusing logic for brevity in this replace block */}
                        <label style={styles.label}>Imagen del Producto</label>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                            Sube una imagen (será alojada en ImgBB automáticamente).
                        </div>
                        <input
                            id="product-image-input" // Added ID for clearing
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append('image', file);

                                try {
                                    const res = await fetch('/api/upload', {
                                        method: 'POST',
                                        body: formData
                                    });

                                    if (!res.ok) {
                                        const text = await res.text();
                                        console.error('Upload failed with:', text);
                                        throw new Error(`Server returned ${res.status}: ${text}`);
                                    }

                                    const data = await res.json();
                                    if (data.url) {
                                        setNewProduct(prev => ({ ...prev, image: data.url }));
                                    } else {
                                        alert('Error subiendo imagen (sin URL)');
                                    }
                                } catch (err) {
                                    console.error('Client Upload Error:', err);
                                    alert(`Error subiendo imagen: ${err.message}`);
                                }
                            }}
                            style={styles.input}
                            required={!newProduct.image}
                        />
                        {newProduct.image && (
                            <img
                                src={newProduct.image}
                                onError={(e) => e.target.style.display = 'none'}
                                onLoad={(e) => e.target.style.display = 'block'}
                                alt="Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginTop: '0.5rem' }}
                            />
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

                        <label style={styles.label}>Opciones del Producto (separadas por coma)</label>
                        <input
                            type="text"
                            placeholder="Ej: Vainilla, Chocolate, Fresa"
                            value={newProduct.options}
                            onChange={(e) => setNewProduct({ ...newProduct, options: e.target.value })}
                            style={styles.input}
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
                        onDelete={() => onDeleteProduct(product.id || index)}
                        onEdit={(prod) => {
                            // Transform options array back to string for editing
                            let optsString = '';
                            if (Array.isArray(prod.options)) {
                                optsString = prod.options.join(', ');
                            } else if (typeof prod.options === 'string' && prod.options.startsWith('[')) {
                                try {
                                    optsString = JSON.parse(prod.options).join(', ');
                                } catch { optsString = prod.options; }
                            }
                            setEditingProduct({ ...prod, options: optsString });
                        }}
                    />
                ))}
            </div>

            {/* Edit Modal */}
            {editingProduct && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <button style={styles.closeButton} onClick={() => setEditingProduct(null)}>&times;</button>
                        <h3 style={{ marginBottom: '1rem' }}>Editar Producto</h3>

                        <form style={styles.formGroup} onSubmit={handleEditSubmit}>
                            <label style={styles.label}>URL de Imagen</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={editingProduct.image || ''}
                                onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                style={styles.input}
                            />
                            {editingProduct.image && (
                                <img src={editingProduct.image} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginTop: '0.5rem' }} />
                            )}

                            <input
                                type="text"
                                placeholder="Nombre"
                                value={editingProduct.title}
                                onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                                style={styles.input}
                                required
                            />

                            <textarea
                                placeholder="Descripción"
                                value={editingProduct.description}
                                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                style={{ ...styles.input, minHeight: '100px' }}
                            />

                            <label style={styles.label}>Opciones (separadas por coma)</label>
                            <input
                                type="text"
                                placeholder="Ej: Vainilla, Chocolate"
                                value={editingProduct.options}
                                onChange={(e) => setEditingProduct({ ...editingProduct, options: e.target.value })}
                                style={styles.input}
                            />

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ ...styles.label, display: 'block', marginBottom: '0.5rem' }}>Precio ($)</label>
                                    <input
                                        type="number"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                        style={{ ...styles.input, width: '100%' }}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ ...styles.label, display: 'block', marginBottom: '0.5rem' }}>Descuento (%)</label>
                                    <select
                                        style={{ ...styles.select, width: '100%' }}
                                        value={editingProduct.discount}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value })}
                                    >
                                        <option value="0">Sin descuento</option>
                                        {discountOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}%</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button type="submit" style={styles.addButton}>Guardar Cambios</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Store;
