import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BillingPage = () => {
    const [billingData, setBillingData] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [items, setItems] = useState([{ itemName: '', quantity: '', price: '', gst: '' }]);
    const [total, setTotal] = useState(0);
    const [allCustomers, setAllCustomers] = useState([]);
    const [showCustomers, setShowCustomers] = useState(false);
    const [grandTotal, setGrandTotal] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const navigate = useNavigate();


    useEffect(() => {

        axios.get('http://localhost:3000/api/auth/session', { withCredentials: true })
            .then(response => {
                if (!response.data.isAuthenticated) {
                    navigate('/login'); 
                } else {
                    generateCustomerId();
                    fetchBillingData();
                }
            })
            .catch(() => navigate('/login'));
    }, [navigate]);

    const generateCustomerId = () => {
        const id = `CUST-${Date.now()}`;
        setCustomerId(id);
    };

    const fetchBillingData = () => {
        axios.get('http://localhost:3000/api/billing/customers', { withCredentials: true })
            .then(response => setBillingData(response.data))
            .catch(err => console.error(err));
    };

    const validateCustomerName = (name) => /^[A-Za-z\s]+$/.test(name);
    const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        if (field === 'quantity' || field === 'price' || field === 'gst') {
            newItems[index][field] = parseFloat(value) || 0;
        } else {
            newItems[index][field] = value;
        }
        setItems(newItems);
        calculateTotal(newItems);
    };

    const calculateTotal = (itemsList) => {
        let totalAmount = 0;
        itemsList.forEach((item) => {
            const itemTotal = item.quantity * item.price;
            const itemGst = (item.gst / 100) * itemTotal;
            totalAmount += itemTotal + itemGst;
        });
        setTotal(totalAmount);
    };

    const addItem = () => {
        setItems([...items, { itemName: '', quantity: 1, price: 0, gst: 0 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCustomerName(customerName)) {
            alert('Customer Name should contain only letters.');
            return;
        }

        if (!validatePhoneNumber(customerPhone)) {
            alert('Phone Number should be exactly 10 digits.');
            return;
        }

        const billingData = { customerId, customerName, customerPhone, items, total };

        try {
            await axios.post('http://localhost:3000/api/billing/add', billingData);
            alert('Billing data submitted successfully!');

            setCustomerName('');
            setCustomerPhone('');
            setItems([{ itemName: '', quantity: '', price: '', gst: '' }]);
            setTotal(0);
            generateCustomerId();
            fetchAllCustomers();
        } catch (error) {
            alert('Error submitting billing data');
            console.error(error);
        }
    };

    const fetchAllCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/billing/customers', {
                params: { date: selectedDate }
            });
            setAllCustomers(response.data);
            setShowCustomers(true);
            calculateGrandTotal(response.data);
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    const calculateGrandTotal = (customers) => {
        let grandTotalAmount = 0;
        customers.forEach((customer) => {
            const customerTotal = customer.quantity * customer.price;
            const customerGst = (customer.gst / 100) * customerTotal;
            grandTotalAmount += customerTotal + customerGst;
        });
        setGrandTotal(grandTotalAmount);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const toggleCustomerList = () => {
        if (!showCustomers) {
            fetchAllCustomers();
        } else {
            setShowCustomers(false);
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-GB');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Billing System</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input type="text" placeholder="Customer ID" value={customerId} readOnly style={styles.input} />
                <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required style={styles.input} />
                <input type="text" placeholder="Customer Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required style={styles.input} />

                <h3 style={styles.itemTitle}>Items</h3>
                {items.map((item, index) => (
                    <div key={index} style={styles.itemContainer}>
                        <input type="text" placeholder="Item Name" value={item.itemName} onChange={(e) => handleItemChange(index, 'itemName', e.target.value)} required style={styles.input} />
                        <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} min="1" required style={styles.input} />
                        <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} required style={styles.input} />
                        <input type="number" placeholder="GST" value={item.gst} onChange={(e) => handleItemChange(index, 'gst', e.target.value)} required style={styles.input} />
                    </div>
                ))}
                <button type="button" onClick={addItem} style={styles.button}>Add Item</button>
                <h4 style={styles.total}>Total: ₹{total}</h4>
                <button type="submit" style={styles.button}>Submit</button>
            </form>

            <input 
                type="date" 
                value={selectedDate} 
                onChange={handleDateChange} 
                style={styles.input} 
                placeholder="Select Date"
            />
            <button onClick={toggleCustomerList} style={styles.button}>Show Customers by Date</button>

            {showCustomers && (
                <div>
                    <h3 style={styles.customerTitle}>Customers on {selectedDate ? formatDate(selectedDate) : 'Selected Date'}</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Customer Name</th>
                                <th style={styles.th}>Phone Number</th>
                                <th style={styles.th}>Item</th>
                                <th style={styles.th}>Quantity</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>GST</th>
                                <th style={styles.th}>Total</th>
                                <th style={styles.th}>Purchase Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allCustomers.map((customer, index) => (
                                <tr key={`${customer.billId}-${index}`} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                    <td style={styles.td}>{customer.customerName}</td>
                                    <td style={styles.td}>{customer.customerPhone}</td>
                                    <td style={styles.td}>{customer.itemName}</td>
                                    <td style={styles.td}>{customer.quantity}</td>
                                    <td style={styles.td}>{customer.price}</td>
                                    <td style={styles.td}>{customer.gst}</td>
                                    <td style={styles.td}>{(customer.quantity * customer.price).toFixed(2)}</td>
                                    <td style={styles.td}>{formatDate(customer.purchaseDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={styles.grandTotal}>
                        <h3>Grand Total: ₹{grandTotal}</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '20px' },
    title: { textAlign: 'center' },
    form: { marginBottom: '20px' },
    input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    button: { backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' },
    itemTitle: { marginTop: '20px' },
    itemContainer: { display: 'flex', flexDirection: 'column' },
    total: { fontWeight: 'bold', fontSize: '18px' },
    customerTitle: { marginTop: '20px', fontSize: '20px' },
    table: { width: '100%', marginTop: '10px', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '8px', backgroundColor: '#f2f2f2' },
    td: { textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' },
    evenRow: { backgroundColor: '#f9f9f9' },
    oddRow: { backgroundColor: '#fff' },
    grandTotal: { fontSize: '20px', marginTop: '20px' }
};

export default BillingPage;
