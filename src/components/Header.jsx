import React, { useState } from 'react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        'INICIO', 'PAQUETES', 'TALLERES', 'ACT. SIN RESERVA', 'MEMBRESÍAS', 'TIENDA'
    ];

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
            letterSpacing: '1px'
        },
        nav: {
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            '@media (max-width: 768px)': {
                display: 'none'
            }
        },
        navItem: {
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            transition: 'color 0.3s ease'
        },
        mobileMenuButton: {
            display: 'none', // Hidden on desktop, logic needed for mobile
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
        }
    };

    // Simple inline media query logic for the sake of this example
    // Ideally would use a Hook or CSS Modules/Styled Components

    return (
        <header style={styles.header}>
            <div style={styles.logo}>Sister's Nook</div>
            <nav className="desktop-nav">
                <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none' }}>
                    {navItems.map((item) => (
                        <li key={item}>
                            <a href="#" style={styles.navItem}>{item}</a>
                        </li>
                    ))}
                </ul>
            </nav>
            {/* Mobile menu placeholder */}
        </header>
    );
};

export default Header;
