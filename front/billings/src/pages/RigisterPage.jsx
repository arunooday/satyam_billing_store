import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', { username, password });
            alert(response.data.message || 'User registered successfully!');
            navigate('/login');
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Error registering user';
            alert(errorMsg);
            console.error('Error:', error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.header}>Register</h2>
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
                    <button type="submit" style={styles.button}>Register</button>
                </form>
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
        background: 'linear-gradient(135deg, #a8e6cf 0%, #ff8b94 100%);',
        padding: '20px',
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '12px',
        padding: '40px 30px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    header: {
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
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        outline: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    button: {
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
};

export default RegisterPage;
