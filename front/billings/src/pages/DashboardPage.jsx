import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/dashboard3.jpg';

const Header = ({ onNavigate, onLogout }) => {
    const [hoveredButton, setHoveredButton] = useState(null);

    const handleMouseEnter = (button) => setHoveredButton(button);
    const handleMouseLeave = () => setHoveredButton(null);

    return (
        <header style={styles.header}>
            <h1 style={styles.logo}>SATYAM's Stores</h1>
            <nav style={styles.nav}>
                <div style={styles.navCenter}>
                    {['home', 'billing', 'search', 'vendor'].map((page) => (
                        <button
                            key={page}
                            style={{
                                ...styles.navButton,
                                ...(hoveredButton === page ? styles.navButtonHover : {}),
                            }}
                            onMouseEnter={() => handleMouseEnter(page)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => onNavigate(page)}
                        >
                            {page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')}
                        </button>
                    ))}
                </div>
                <button
                    style={{
                        ...styles.navButton,
                        ...styles.logoutButton,
                        ...(hoveredButton === 'logout' ? styles.navButtonHover : {}),
                    }}
                    onMouseEnter={() => handleMouseEnter('logout')}
                    onMouseLeave={handleMouseLeave}
                    onClick={onLogout}
                >
                    Logout
                </button>
            </nav>
        </header>
    );
};

const Footer = () => (
    <footer style={styles.footer}>
        <p style={styles.footerText}>
            © {new Date().getFullYear()} SATYAM's Stores. All rights reserved.
        </p>
    </footer>
);

const DashboardPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/session', { withCredentials: true });
                if (!response.data.isAuthenticated) {
                    navigate('/login');
                }
            } catch {
                navigate('/login');
            }
        };
        checkSession();
    }, [navigate]);

    const handleNavigation = (page) => {
        const routes = {
            home: '/',
            billing: '/billing',
            search: '/search',
            vendor: '/vendor-management',
        };
        navigate(routes[page] || '/');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true })
            .finally(() => {
                alert('Logged out successfully!');
                navigate('/login');
            });
    };

    return (
        <div
            style={{
                ...styles.container,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
            }}
        >
            <div style={styles.overlay}>
                <Header onNavigate={handleNavigation} onLogout={handleLogout} />
                <main style={styles.main}>
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Dashboard</h2>
                        <HomeContent />
                    </section>
                </main>
                <Footer />
            </div>
        </div>
    );
};

const HomeContent = () => (
    <div style={styles.content}>
        <h3 style={styles.contentTitle}>Welcome to SATYAM's Stores</h3>
    </div>
);

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        overflow: 'hidden',
    },
    overlay: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '10px 20px',
        color: 'white',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 10,
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    navCenter: {
        display: 'flex',
        gap: '15px',
        flexGrow: 1,
        justifyContent: 'center',
    },
    navButton: {
        padding: '10px 20px',
        fontSize: '14px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007acc',
        color: 'white',
        cursor: 'pointer',
        transition: 'transform 0.2s, background-color 0.3s',
    },
    logoutButton: {
        backgroundColor: '#d9534f',
        marginLeft: 'auto',
    },
    navButtonHover: {
        backgroundColor: '#009993',
        transform: 'scale(1.05)',
    },
    main: {
        marginTop: '80px',
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '40px 30px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
        width: '80%',
        maxWidth: '900px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
    },
    sectionTitle: {
        fontSize: '32px',
        marginBottom: '25px',
        color: '#e0e0e0',
    },
    content: {
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
    },
    contentTitle: {
        fontSize: '22px',
        color: '#f0f0f0',
    },
    footer: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        textAlign: 'center',
        padding: '10px 20px',
    },
    footerText: {
        fontSize: '14px',
    },
};

export default DashboardPage;
