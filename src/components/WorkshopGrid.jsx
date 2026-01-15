import React from 'react';

const WorkshopCard = ({ title, image }) => {
    const styles = {
        card: {
            overflow: 'hidden',
            borderRadius: '16px',
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            backgroundColor: '#fff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            maxWidth: '350px',
            margin: '0 auto'
        },
        image: {
            width: '100%',
            height: '350px',
            objectFit: 'cover',
            display: 'block'
        },
        titleBar: {
            backgroundColor: 'var(--color-accent)',
            padding: '1rem',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff',
            fontSize: '1.1rem',
            letterSpacing: '0.5px'
        }
    };

    return (
        <div style={styles.card} className="workshop-card">
            <img src={image} alt={title} style={styles.image} />
            <div style={styles.titleBar}>
                {title}
            </div>
        </div>
    );
};

const WorkshopGrid = () => {
    const workshops = [
        {
            title: 'Christmas Candle Latte',
            image: '/assets/workshop_christmas_latte_1768444923835.png'
        },
        {
            title: 'Pinos Navideños en Vela',
            image: '/assets/workshop_pine_tree_1768444938177.png'
        },
        // Reusing images for demo purposes to fill the grid
        {
            title: 'Velas Mágicas con Agua',
            image: '/assets/hero_candles_1768444909390.png'
        },
        {
            title: 'Portavelas de Arcilla',
            image: '/assets/workshop_christmas_latte_1768444923835.png' // Reusing
        }
    ];

    const gridStyles = {
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    return (
        <section style={gridStyles}>
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-text-header)' }}>¡Selecciona tu Taller Favorito!</h2>
            </div>
            {workshops.map((workshop, index) => (
                <WorkshopCard key={index} {...workshop} />
            ))}
        </section>
    );
};

export default WorkshopGrid;
