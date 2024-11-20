import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [blockedUntil, setBlockedUntil] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (blockedUntil) {
            const interval = setInterval(() => {
                const timeRemaining = Math.max(0, new Date(blockedUntil) - new Date());
                setTimeLeft(timeRemaining);

                if (timeRemaining <= 0) {
                    setBlockedUntil(null);
                    setTimeLeft(null);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [blockedUntil]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            alert('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.status === 403 && error.response.data.blockedUntil) {
                setBlockedUntil(error.response.data.blockedUntil);
                alert(error.response.data.error);
            } else {
                alert('Error logging in');
                console.error(error);
            }
        }
    };

    const formatTimeLeft = () => {
        if (!timeLeft) return '';
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.heading}>Login</h2>
                {blockedUntil && timeLeft > 0 ? (
                    <p style={styles.timer}>Please try again in {formatTimeLeft()}</p>
                ) : (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Login</button>
                    </form>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        padding: '20px',
        color: 'white',
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '12px',
        padding: '40px 30px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px',
        backdropFilter: 'blur(8px)',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        color: '#333',
    },
    button: {
        padding: '12px',
        marginTop: '15px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        transition: '0.3s',
    },
    timer: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
    },
};

export default LoginPage;
