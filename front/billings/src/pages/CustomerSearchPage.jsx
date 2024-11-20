
import React, { useState } from 'react';
import axios from 'axios';
// import backgroundImage from '../assets/Homepageimg.jpg';

const CustomerSearchPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [customerData, setCustomerData] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/customers/search?phone=${phoneNumber}`);
            setCustomerData(response.data);
        } catch (error) {
            alert('Error fetching customer data');
            console.error(error);
        }
    };

    return (
        <div style={{
            ...styles.container,
            // backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white', 
        }}>
            <h2 style={styles.title}>Search Customer</h2>
            <div style={styles.form}>
                <input
                    type="text"
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleSearch} style={styles.searchButton}>Search</button>
            </div>

            {customerData && (
                <div style={styles.customerDetails}>
                    <h3>Customer Details</h3>
                    <p>ID: {customerData.id}</p>
                    <p>Name: {customerData.name}</p>
                    <p>Phone: {customerData.phone}</p>
                    <h4>Billing History</h4>
                    <ul>
                        {customerData.billingHistory.map(bill => (
                            <li key={bill.id}>
                                Bill ID: {bill.id}, Total: ${bill.total}, Date: {new Date(bill.date).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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
    title: {
        marginBottom: '20px',
        backgroundColor: '#4CAF50',
    },
    form: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '200px',
    },
    searchButton: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    customerDetails: {
        marginTop: '20px',
        backgroundColor: 'rgba(250, 250, 250, 0.9)', 
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
        color: 'black', 
    },
};

export default CustomerSearchPage;
