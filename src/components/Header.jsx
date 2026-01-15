import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { label: 'INICIO', path: '/' },
        { label: 'PAQUETES', path: '/packages' },
        { label: 'TALLERES', path: '/workshops' },
        { label: 'TIENDA', path: '/store' }
    ];

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const styles = {
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: 'transparent',
            position: 'relative',
            zIndex: 100
        },
        logo: {
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-header)',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textDecoration: 'none'
        },
        nav: {
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            alignItems: 'center'
        },
        navItem: {
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'color 0.3s ease'
        },
        authButton: {
            padding: '0.5rem 1rem',
            backgroundColor: user ? '#D65A68' : 'transparent',
            border: user ? 'none' : '1px solid var(--color-text-main)',
            borderRadius: '20px',
            color: user ? '#fff' : 'var(--color-text-main)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            marginLeft: '1rem'
        }
    };

    return (
        <header style={styles.header}>
            <Link to="/" style={styles.logo}>
                <img src="/assets/logo.png" alt="Tell Candles" style={{ height: '40px', verticalAlign: 'middle', marginRight: '10px' }} />
                Tell Candles
            </Link>
            <nav>
                <ul style={styles.nav}>
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link to={item.path} style={styles.navItem}>{item.label}</Link>
                        </li>
                    ))}
                    <li>
                        {user ? (
                            <button onClick={handleLogout} style={styles.authButton}>Salir</button>
                        ) : (
                            <Link to="/login" style={styles.authButton}>Ingresar</Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
