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

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <header className="header">
            <Link to="/" className="logo" onClick={closeMenu}>
                <img src="/assets/logo.png" alt="Tell Candles" style={{ height: '40px', marginRight: '10px' }} />
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
                    <li>
                        {user ? (
                            <button onClick={() => { handleLogout(); closeMenu(); }} className="auth-button btn-logout">Salir</button>
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
