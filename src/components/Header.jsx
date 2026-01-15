import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

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

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <header className="header">
            <Link to="/" className="logo" onClick={closeMenu}>
                Tell Candles
            </Link>

            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                <span className="hamburger-line" style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
                <span className="hamburger-line" style={{ opacity: isOpen ? 0 : 1 }}></span>
                <span className="hamburger-line" style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
            </button>

            <nav>
                <ul className={`nav ${isOpen ? 'open' : ''}`}>
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link to={item.path} className="nav-item" onClick={closeMenu}>{item.label}</Link>
                        </li>
                    ))}

                    {/* Cart Icon Mobile/Desktop */}
                    <li style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/cart" className="nav-item" onClick={closeMenu} style={{ position: 'relative', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                            🛒
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-10px',
                                    backgroundColor: '#f62e2e',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '2px 6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold'
                                }}>{cartCount}</span>
                            )}
                        </Link>
                    </li>

                    <li>
                        {user ? (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Link to="/admin/orders" className="nav-item" onClick={closeMenu} style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Pedidos</Link>
                                <button onClick={() => { handleLogout(); closeMenu(); }} className="auth-button btn-logout">Salir</button>
                            </div>
                        ) : (
                            <Link to="/login" className="auth-button btn-login" onClick={closeMenu}>Ingresar</Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
