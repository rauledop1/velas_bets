import React from 'react';

const Hero = () => {
    const styles = {
        section: {
            textAlign: 'center',
            padding: '4rem 1rem 2rem',
            maxWidth: '800px',
            margin: '0 auto'
        },
        title: {
            fontSize: '3rem',
            color: 'var(--color-text-header)',
            marginBottom: '1.5rem',
        },
        subtitle: {
            fontSize: '1.1rem',
            marginBottom: '2rem',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.8'
        },
        inclusions: {
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '20px',
            margin: '2rem 0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        },
        inclusionList: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem'
        },
        inclusionItem: {
            backgroundColor: 'var(--color-bg)',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: 'bold'
        },
        heroImage: {
            width: '100%',
            maxWidth: '600px',
            borderRadius: '20px',
            marginTop: '2rem',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
    };

    return (
        <section style={styles.section}>
            <h1 style={styles.title}>✨ Talleres Hod Candles</h1>

            <p style={styles.subtitle}>
                ¡Bienvenidx a un mes lleno de creatividad, aromas deliciosos y momentos para ti!
                Te esperamos en nuestro estudio en CDMX con experiencias únicas de velas artesanales.
            </p>

            <div style={styles.inclusions}>
                <h3>Todos nuestros talleres incluyen:</h3>
                <div style={styles.inclusionList}>
                    <span style={styles.inclusionItem}>🕯 Todos los materiales</span>
                    <span style={styles.inclusionItem}>🍭 Snacks y bebidas</span>
                    <span style={styles.inclusionItem}>🎀 Préstamo de herramientas</span>
                    <span style={styles.inclusionItem}>🌸 Un espacio hermoso en Tell Candles</span>
                </div>
                <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                    📍 Ubicación: Plaza Palmas, Calle Héroes de Padierna #138, San Jerónimo Lídice, CDMX
                </p>
            </div>

            <img src="/assets/hero_candles_1768444909390.png" alt="Candle Workshop" style={styles.heroImage} />

        </section>
    );
};

export default Hero;
