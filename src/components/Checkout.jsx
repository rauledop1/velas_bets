import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'transfer' // Default
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (cart.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>No hay items en el carrito para comprar.</div>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderPayload = {
            contactInfo: formData,
            items: cart,
            total: getCartTotal()
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            if (res.ok) {
                const order = await res.json();
                alert(`¡Pedido #${order.id} recibido con éxito! Te hemos enviado un correo.`);
                clearCart();
                navigate('/');
            } else {
                alert('Error al procesar el pedido. Intenta nuevamente.');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        container: {
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem'
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--color-text-header)'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        },
        input: {
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem'
        },
        label: {
            fontWeight: 'bold',
            marginBottom: '-0.5rem',
            color: 'var(--color-text-main)'
        },
        sectionTitle: {
            marginTop: '1rem',
            color: 'var(--color-text-header)',
            borderBottom: '2px solid #eee',
            paddingBottom: '0.5rem'
        },
        summary: {
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem'
        },
        button: {
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '1rem'
        },
        radioGroup: {
            display: 'flex',
            gap: '1rem',
            margin: '0.5rem 0'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Finalizar Compra</h1>

            <form style={styles.form} onSubmit={handleSubmit}>
                <h3 style={styles.sectionTitle}>Datos de Contacto</h3>

                <label style={styles.label}>Nombre Completo</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Ej. Juan Pérez"
                />

                <label style={styles.label}>Correo Electrónico</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="tucorreo@ejemplo.com"
                />

                <label style={styles.label}>Teléfono</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="+56 9 1234 5678"
                />

                <h3 style={styles.sectionTitle}>Dirección de Envío</h3>
                <label style={styles.label}>Ciudad</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                <label style={styles.label}>Dirección (Calle, Número, Depto)</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                <h3 style={styles.sectionTitle}>Método de Pago</h3>
                <div style={styles.radioGroup}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="transfer"
                            checked={formData.paymentMethod === 'transfer'}
                            onChange={handleChange}
                        />
                        Transferencia
                    </label>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={handleChange}
                        />
                        Tarjeta (Simulado)
                    </label>
                </div>

                <div style={styles.summary}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total a Pagar:</span>
                        <span style={{ color: 'var(--color-accent)' }}>${getCartTotal().toFixed(2)}</span>
                    </div>
                </div>

                <button type="submit" style={styles.button} disabled={isSubmitting}>
                    {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
