import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const styles = {
        container: {
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2rem',
            minHeight: '60vh'
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--color-text-header)'
        },
        emptyCart: {
            textAlign: 'center',
            padding: '4rem',
            fontSize: '1.2rem',
            color: '#666'
        },
        cartGrid: {
            display: 'grid',
            gap: '1.5rem'
        },
        item: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            gap: '1rem',
            flexWrap: 'wrap'
        },
        image: {
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '8px'
        },
        details: {
            flex: 1,
            minWidth: '200px'
        },
        title: {
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: 'var(--color-text-header)'
        },
        option: {
            fontSize: '0.9rem',
            color: '#666'
        },
        controls: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        },
        quantityInput: {
            width: '50px',
            padding: '0.3rem',
            borderRadius: '5px',
            border: '1px solid #ddd',
            textAlign: 'center'
        },
        price: {
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'var(--color-accent)',
            marginLeft: 'auto'
        },
        removeButton: {
            background: 'none',
            border: 'none',
            color: '#ff4d4d',
            cursor: 'pointer',
            fontSize: '1.2rem',
            marginLeft: '1rem'
        },
        summary: {
            marginTop: '3rem',
            padding: '2rem',
            backgroundColor: '#fff',
            borderRadius: '15px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        },
        totalRow: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '300px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '2rem'
        },
        checkoutButton: {
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            padding: '1rem 3rem',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 10px rgba(214, 90, 104, 0.3)'
        }
    };

    if (cart.length === 0) {
        return (
            <div style={styles.container}>
                <h1 style={styles.header}>Tu Carrito</h1>
                <div style={styles.emptyCart}>
                    <p>Tu carrito está vacío 😔</p>
                    <Link to="/store" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                        Ir a la Tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Tu Carrito ({cart.length} items)</h1>

            <div style={styles.cartGrid}>
                {cart.map((item, index) => {
                    const price = parseFloat(item.price);
                    const discount = parseFloat(item.discount || 0);
                    const finalPrice = discount > 0 ? price - (price * (discount / 100)) : price;

                    return (
                        <div key={index} style={styles.item}>
                            <img src={item.image} alt={item.title} style={styles.image} />

                            <div style={styles.details}>
                                <div style={styles.title}>{item.title}</div>
                                {item.selectedOptions && item.selectedOptions.variant && (
                                    <div style={styles.option}>Opción: {item.selectedOptions.variant}</div>
                                )}
                            </div>

                            <div style={styles.controls}>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, item.selectedOptions, parseInt(e.target.value))}
                                    style={styles.quantityInput}
                                />
                                <span style={styles.price}>${(finalPrice * item.quantity).toFixed(2)}</span>
                                <button
                                    onClick={() => removeFromCart(item.id, item.selectedOptions)}
                                    style={styles.removeButton}
                                    title="Eliminar"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={styles.summary}>
                <div style={styles.totalRow}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--color-accent)' }}>${getCartTotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={clearCart}
                        style={{ ...styles.checkoutButton, backgroundColor: '#ccc', fontSize: '0.9rem' }}
                    >
                        Limpiar Carrito
                    </button>
                    <Link to="/checkout" style={{ textDecoration: 'none' }}>
                        <button style={styles.checkoutButton}>
                            Procesar Pedido
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
