
import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/homefinal.jpg';

const HomePage = () => {
    return (
        <div style={{ 
            ...styles.container, 
            backgroundImage: `url(${backgroundImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            height: '100vh',
            color: '#fff',
        }}>
            <div style={styles.overlay}>
                <h1 style={styles.heading}>Welcome to SATYAM's Store</h1>
                <p style={styles.paragraph}>Our platform offers a user-friendly interface for easy customer management, billing, and tracking all in one place.</p>
                <div style={styles.buttonContainer}>
                    <Link to="/register">
                        <button style={styles.button} onMouseOver={(e) => handleHover(e)} onMouseOut={(e) => handleHoverOut(e)}>Register</button>
                    </Link>
                    <Link to="/login">
                        <button style={styles.button} onMouseOver={(e) => handleHover(e)} onMouseOut={(e) => handleHoverOut(e)}>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const handleHover = (e) => {
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    e.target.style.color = '#333';
    e.target.style.transform = 'scale(1.1)';
};

const handleHoverOut = (e) => {
    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    e.target.style.color = 'white';
    e.target.style.transform = 'scale(1)';
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        padding: '60px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)', 
        backdropFilter: 'blur(5px)', 
        maxWidth: '700px',
        textAlign: 'center',
    },
    heading: {
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#f0f0f0',
        textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)', 
    },
    subheading: {
        fontSize: '22px',
        fontWeight: '300',
        color: '#d0d0d0',
        marginBottom: '40px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
    },
    button: {
        padding: '15px 40px',
        fontSize: '18px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s, transform 0.3s', 
        outline: 'none',
    },
};

export default HomePage;
