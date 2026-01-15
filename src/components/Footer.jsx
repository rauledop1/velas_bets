import React from 'react';

const Footer = ({ user, onExport }) => {
    const styles = {
        footer: {
            backgroundColor: 'var(--color-footer)',
            padding: '4rem 2rem',
            marginTop: '4rem',
            textAlign: 'center',
            color: '#fff'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '400px',
            margin: '0 auto 3rem'
        },
        input: {
            padding: '0.8rem 1.5rem',
            borderRadius: '50px',
            border: 'none',
            width: '100%',
            fontFamily: 'inherit'
        },
        button: {
            padding: '0.8rem 2.5rem',
            borderRadius: '50px',
            border: '2px solid #fff',
            backgroundColor: 'transparent',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        socials: {
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '2rem',
            fontWeight: 'bold',
            letterSpacing: '1px'
        },
        hours: {
            fontSize: '0.9rem',
            lineHeight: '1.8',
            opacity: 0.9
        }
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.form}>
                <h3>¡Gracias por suscribirte!</h3>
                <p>Recibe noticias de nuevos talleres y descuentos.</p>
                <input type="email" placeholder="Tu correo electrónico" style={styles.input} />
                <button style={styles.button}>UNIRSE</button>
            </div>

            <div style={styles.socials}>
                <a href="https://www.instagram.com/tellcandless/" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
            </div>

            <div style={styles.hours}>
                <h4>Horarios:</h4>
                <p>Lunes - Martes: Cerrado</p>
                <p>Miércoles - Jueves: 11:00 am - 7:00 pm</p>
                <p>Viernes: 11:00 am - 3:00 pm</p>
                <p>Sábado - Domingo: 11:00 am - 2:00 pm & 5:00 pm - 8:00 pm</p>
                <br />
                <p>Plaza Palmas. Calle Heroes de Padierna 138, San Jerónimo Lídice, CDMX</p>
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.8rem' }}>Copyright 2026 Tell Candles Clone</p>
            {user && (
                <button
                    onClick={onExport}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#333',
                        color: '#0f0',
                        border: '1px solid #0f0',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    ADMIN: COPIAR DATOS PARA PUBLICAR
                </button>
            )}
        </footer>
    );
};

export default Footer;
