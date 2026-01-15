import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    // Initialize default options if any
                    // Server returns options as array of strings, or maybe object? 
                    // Let's assume options is an array of strings like ["Vainilla", "Chocolate"] for a simple select if it's "Scents"
                    // Wait, implementation plan said Admin adds "Options".
                    // Let's handle simple case: `options` column is JSONB array of variant names.
                } else {
                    console.error('Product not found');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
    if (!product) return <div style={{ padding: '2rem', textAlign: 'center' }}>Producto no encontrado</div>;

    const numericPrice = parseFloat(product.price);
    const numericDiscount = parseFloat(product.discount || 0);
    const hasDiscount = numericDiscount > 0;
    const discountedPrice = hasDiscount
        ? (numericPrice - (numericPrice * (numericDiscount / 100))).toFixed(2)
        : numericPrice;

    // Parse options from DB
    // Assuming options is an array of strings e.g. ["Vainilla", "Canela"]
    // Or maybe we want keyed options? For now let's treat the whole array as "Variante" choices.
    let productOptions = [];
    if (product.options && Array.isArray(product.options)) {
        productOptions = product.options;
    } else if (typeof product.options === 'string') {
        try {
            productOptions = JSON.parse(product.options);
        } catch {
            productOptions = [];
        }
    }

    const handleAddToCart = () => {
        // Validation: If options exist, must select one?
        // Let's say if options > 0 and we haven't selected, default to first? 
        // Or force user.
        let finalOptions = { ...selectedOptions };
        if (productOptions.length > 0 && !finalOptions.variant) {
            finalOptions.variant = productOptions[0]; // Default to first
        }

        addToCart(product, quantity, finalOptions);
        alert('Producto agregado al carrito');
        navigate('/cart'); // Or stay? Let's go to cart for feedback
    };

    const styles = {
        container: {
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem'
        },
        imageContainer: {
            flex: '1 1 400px',
        },
        image: {
            width: '100%',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        },
        infoContainer: {
            flex: '1 1 400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        },
        title: {
            fontSize: '2rem',
            marginBottom: '1rem',
            color: 'var(--color-text-header)'
        },
        price: {
            fontSize: '1.5rem',
            color: 'var(--color-accent)',
            fontWeight: 'bold',
            marginBottom: '1rem'
        },
        originalPrice: {
            textDecoration: 'line-through',
            color: '#999',
            fontSize: '1rem',
            marginRight: '1rem'
        },
        description: {
            lineHeight: '1.6',
            color: 'var(--color-text-main)',
            marginBottom: '2rem'
        },
        controls: {
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            alignItems: 'center'
        },
        select: {
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem'
        },
        button: {
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            padding: '0.8rem 2rem',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 10px rgba(214, 90, 104, 0.3)'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.imageContainer}>
                <img src={product.image} alt={product.title} style={styles.image} />
            </div>
            <div style={styles.infoContainer}>
                <h1 style={styles.title}>{product.title}</h1>

                <div style={{ marginBottom: '1rem' }}>
                    {hasDiscount && <span style={styles.originalPrice}>${numericPrice}</span>}
                    <span style={styles.price}>${discountedPrice}</span>
                </div>

                <p style={styles.description}>{product.description}</p>

                {productOptions.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Elige una opción:</label>
                        <select
                            style={styles.select}
                            value={selectedOptions.variant || ''}
                            onChange={(e) => setSelectedOptions({ ...selectedOptions, variant: e.target.value })}
                        >
                            <option value="" disabled>Seleccionar...</option>
                            {productOptions.map((opt, idx) => (
                                <option key={idx} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div style={styles.controls}>
                    <label style={{ fontWeight: 'bold' }}>Cantidad:</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        style={{ ...styles.select, width: '60px' }}
                    />
                </div>

                <button
                    style={styles.button}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onClick={handleAddToCart}
                >
                    Agregar al Carrito
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
