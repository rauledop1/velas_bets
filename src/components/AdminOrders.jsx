import React, { useState, useEffect } from 'react';

const AdminOrders = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Todos');

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Optimistic update
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
                alert(`Estado actualizado a: ${newStatus}`);
            } else {
                alert('Error al actualizar estado');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión');
        }
    };

    if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Acceso Denegado. Debes ser administrador.</div>;
    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando pedidos...</div>;

    const filteredOrders = filter === 'Todos' ? orders : orders.filter(o => o.status === filter);

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem'
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--color-text-header)'
        },
        filterBar: {
            marginBottom: '2rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
        },
        filterBtn: (isActive) => ({
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: isActive ? 'var(--color-accent)' : '#eee',
            color: isActive ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 'bold'
        }),
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            borderRadius: '10px',
            overflow: 'hidden'
        },
        th: {
            backgroundColor: '#FFFAF0',
            padding: '1rem',
            textAlign: 'left',
            color: 'var(--color-text-header)'
        },
        td: {
            padding: '1rem',
            borderBottom: '1px solid #eee'
        },
        statusSelect: {
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ddd'
        }
    };

    const statusOptions = ['Recibido', 'En Preparación', 'Enviado', 'Finalizado'];

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Gestión de Pedidos</h1>

            <div style={styles.filterBar}>
                {['Todos', ...statusOptions].map(s => (
                    <button
                        key={s}
                        style={styles.filterBtn(filter === s)}
                        onClick={() => setFilter(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Fecha</th>
                            <th style={styles.th}>Cliente</th>
                            <th style={styles.th}>Items</th>
                            <th style={styles.th}>Total</th>
                            <th style={styles.th}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => {
                            const contact = typeof order.contact_info === 'string' ? JSON.parse(order.contact_info) : order.contact_info;
                            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                            const date = new Date(order.created_at).toLocaleDateString();

                            return (
                                <tr key={order.id}>
                                    <td style={styles.td}>#{order.id}</td>
                                    <td style={styles.td}>{date}</td>
                                    <td style={styles.td}>
                                        <strong>{contact.name}</strong><br />
                                        <small>{contact.email}</small><br />
                                        <small>{contact.phone}</small>
                                    </td>
                                    <td style={styles.td}>
                                        <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                                            {items.map((i, idx) => (
                                                <li key={idx}>
                                                    {i.quantity}x {i.title}
                                                    {i.selectedOptions?.variant && ` (${i.selectedOptions.variant})`}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td style={styles.td}>${parseFloat(order.total).toFixed(2)}</td>
                                    <td style={styles.td}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={styles.statusSelect}
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default AdminOrders;
