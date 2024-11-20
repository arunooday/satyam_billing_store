import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VendorManagement = () => {
    const navigate = useNavigate();


    useEffect(() => {
        const validateSession = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/session', { withCredentials: true });
                if (!response.data.isAuthenticated) {
                    navigate('/login');
                }
            } catch {
                navigate('/login');
            }
        };
        validateSession();
    }, [navigate]);

    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategory, setNewCategory] = useState("");
    const [vendorDetails, setVendorDetails] = useState({
        name: '',
        phone_number: '',
        address: '',
        supplies: '',
        category: ''
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([{ ownerName: '', itemName: '', price: '', quantity: 1, discount: 0 }]);
    const [totalBill, setTotalBill] = useState(0);
    const [orderFormVendorId, setOrderFormVendorId] = useState(null);
    const [selectedVendorId, setSelectedVendorId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/vendor-management/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) return;

        try {
            await axios.post('http://localhost:3000/api/vendor-management/categories', { category: newCategory });
            setNewCategory('');
            setSuccessMessage(`Category "${newCategory}" added successfully!`);
            fetchCategories();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleAddVendor = async (e) => {
        e.preventDefault();
        const { name, phone_number, address, supplies, category } = vendorDetails;
        if (!name || !phone_number || !address || !supplies || !category) return;

        try {
            await axios.post('http://localhost:3000/api/vendor-management/vendors', vendorDetails);
            setSuccessMessage(`Vendor "${name}" added successfully!`);
            setVendorDetails({ name: '', phone_number: '', address: '', supplies: '', category: '' });
            fetchVendorsByCategory(selectedCategory);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding vendor:', error);
        }
    };

    const fetchVendorsByCategory = async (category) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/vendor-management/vendors/${category}`);
            setVendors(response.data);
            setSelectedCategory(category);
            setShowDropdown(false);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    const handleOrder = (vendorId) => {
        setOrderFormVendorId(vendorId); 
        setOrders([]);
        setSelectedVendorId(vendorId);
    };

    const handleShowOrders = async (vendorId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/vendor-management/orders/${vendorId}`);
            setOrders(response.data);
            setSelectedVendorId(vendorId); 
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleAddItem = () => {
        setOrderItems([...orderItems, { ownerName: '', itemName: '', price: '', quantity: 1, discount: 0 }]);
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = [...orderItems];
        updatedItems[index][name] = value;
        setOrderItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const calculateTotal = (updatedItems) => {
        let total = 0;
        updatedItems.forEach(item => {
            const { price, quantity, discount } = item;
            total += (price * quantity) - ((discount / 100) * (price * quantity));
        });
        setTotalBill(total);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        const orderData = { items: orderItems, totalBill, vendorId: orderFormVendorId };
    
        try {
            await axios.post('http://localhost:3000/api/vendor-management/orders', orderData);
            setSuccessMessage('Order placed successfully!');
            setOrderItems([{ ownerName: '', itemName: '', price: '', quantity: 1, discount: 0 }]);
            setTotalBill(0);
            setTimeout(() => setSuccessMessage(''), 3000);
            setOrderFormVendorId(null); 
        } catch (error) {
            console.error('Error placing order:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div style={styles.container}>
        <h1 style={styles.header}>Vendor Management</h1>

        <form onSubmit={handleAddCategory} style={styles.form}>
            <input 
                type="text" 
                placeholder="New Category" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)}
                style={styles.input}
            />
            <button type="submit" style={styles.addButton}>Add Category</button>
        </form>

        {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

        <button onClick={() => setShowDropdown(!showDropdown)} style={styles.dropdownButton}>
            {showDropdown ? 'Hide Categories' : 'Show Categories'}
        </button>

        {showDropdown && (
            <select 
                onChange={(e) => {
                    const selectedCat = e.target.value;
                    setVendorDetails(prev => ({ ...prev, category: selectedCat }));
                    fetchVendorsByCategory(selectedCat);
                }} 
                style={styles.dropdown}
            >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
            </select>
        )}

        {selectedCategory && (
            <div style={styles.vendorList}>
                <h3 style={{ color: '#ffd700' }}>Vendors in "{selectedCategory}"</h3>
                <form onSubmit={handleAddVendor} style={styles.vendorForm}>
                    <input 
                        type="text" 
                        placeholder="Vendor Name" 
                        value={vendorDetails.name} 
                        onChange={(e) => setVendorDetails({ ...vendorDetails, name: e.target.value })} 
                        required
                        style={styles.input}
                    />
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        value={vendorDetails.phone_number} 
                        onChange={(e) => setVendorDetails({ ...vendorDetails, phone_number: e.target.value })} 
                        required
                        style={styles.input}
                    />
                    <input 
                        type="text" 
                        placeholder="Address" 
                        value={vendorDetails.address} 
                        onChange={(e) => setVendorDetails({ ...vendorDetails, address: e.target.value })} 
                        required
                        style={styles.input}
                    />
                    <input 
                        type="text" 
                        placeholder="Supplies" 
                        value={vendorDetails.supplies} 
                        onChange={(e) => setVendorDetails({ ...vendorDetails, supplies: e.target.value })} 
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.addButton}>Add Vendor</button>
                </form>

                {vendors.length > 0 && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Supplies</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((vendor) => (
                                <tr key={vendor.vendor_id}>
                                    <td>{vendor.vendor_id}</td>
                                    <td>{vendor.name}</td>
                                    <td>{vendor.phone_number}</td>
                                    <td>{vendor.address}</td>
                                    <td>{vendor.supplies}</td>
                                    <td>{vendor.category}</td> 
                                    <td>{vendor.status}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleOrder(vendor.vendor_id)} 
                                            style={styles.addButton}
                                        >
                                            Order
                                        </button>
                                        <button 
                                            onClick={() => handleShowOrders(vendor.vendor_id)} 
                                            style={styles.addButton}
                                        >
                                            Show Orders
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}

        {selectedVendorId && orders.length > 0 && (
            <div style={styles.ordersContainer}>
                <h3>Orders for Vendor {selectedVendorId}</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Order Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                <td>{order.item_name}</td>
                                <td>{order.quantity}</td>
                                <td>{order.total}</td>
                                <td>{order.order_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* Order Form (Only display if no orders are being shown) */}
        {selectedVendorId && orders.length === 0 && (
            <div style={styles.orderFormContainer}>
                <h3>Place Order for Vendor {selectedVendorId}</h3>
                <form onSubmit={handleSubmitOrder} style={styles.form}>
                    {orderItems.map((item, index) => (
                        <div key={index} style={styles.orderItem}>
                            <input 
                                type="text" 
                                name="ownerName"
                                placeholder="Owner Name"
                                value={item.ownerName}
                                onChange={(e) => handleItemChange(index, e)}
                                style={styles.input}
                            />
                            <input 
                                type="text" 
                                name="itemName"
                                placeholder="Item Name"
                                value={item.itemName}
                                onChange={(e) => handleItemChange(index, e)}
                                style={styles.input}
                            />
                            <input 
                                type="number" 
                                name="price"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, e)}
                                style={styles.input}
                            />
                            <input 
                                type="number" 
                                name="quantity"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, e)}
                                style={styles.input}
                            />
                            <input 
                                type="number" 
                                name="discount"
                                placeholder="Discount"
                                value={item.discount}
                                onChange={(e) => handleItemChange(index, e)}
                                style={styles.input}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem} style={styles.addButton}>
                        Add Item
                    </button>
                    <div style={styles.total}>
                        <span>Total Bill: ₹{totalBill.toFixed(2)}</span>
                    </div>
                    <button type="submit" style={styles.addButton}>Submit Order</button>
                </form>
            </div>
        )}
    </div>
);
};

const styles = {
container: { maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: 'linear-gradient(135deg, #00bcd4 0%, #3f51b5 100%)' },
header: { fontSize: '30px', textAlign: 'center', marginBottom: '20px' },
form: { display: 'flex', flexDirection: 'column', marginBottom: '20px' },
input: { padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' },
addButton: { padding: '10px 20px', marginBottom: '10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' },
dropdownButton: { padding: '10px', backgroundColor: '#ff9800', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' },
dropdown: { padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' },
vendorList: { marginTop: '20px' },
table: { width: '100%', borderCollapse: 'collapse' },
tableHeader: { backgroundColor: '#009688', color: '#fff', padding: '10px' },
tableData: { textAlign: 'center', padding: '10px' },
successMessage: { color: 'green', fontSize: '16px', textAlign: 'center' },
orderFormContainer: { marginTop: '20px', padding: '20px', backgroundColor: '#fff' },
orderItem: { display: 'flex', marginBottom: '10px' },
total: { marginTop: '10px', fontSize: '20px', fontWeight: 'bold' },
};

export default VendorManagement;
