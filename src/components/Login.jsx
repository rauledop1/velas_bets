import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'betsaida' && password === 'bets1212') {
            onLogin();
            navigate('/store'); // Redirect to store after login
        } else {
            setError('Credenciales incorrectas');
        }
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '2rem'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            width: '100%',
            maxWidth: '400px'
        },
        input: {
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            fontFamily: 'inherit'
        },
        button: {
            padding: '1rem',
            borderRadius: '50px',
            border: 'none',
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '1rem',
            transition: 'opacity 0.3s'
        },
        error: {
            color: '#D65A68',
            fontSize: '0.9rem',
            textAlign: 'center'
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-text-header)' }}>Iniciar Sesión</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Entrar</button>
            </form>
        </div>
    );
};

export default Login;
