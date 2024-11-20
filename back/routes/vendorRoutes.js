

const express = require('express');
const router = express.Router();
const db = require('../config/db'); 


router.get('/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

router.post('/categories', (req, res) => {
    const { category } = req.body;
    if (!category) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    db.query('INSERT INTO categories (name) VALUES (?)', [category], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }
        res.status(201).json({ message: 'Category added successfully' });
    });
});


router.get('/vendors/:category', (req, res) => {
    const category = req.params.category;
    db.query('SELECT * FROM vendors2 WHERE category = ?', [category], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

router.post('/vendors', (req, res) => {
    const { name, phone_number, address, supplies, category } = req.body;
    if (!name || !phone_number || !address || !supplies || !category) {
        return res.status(400).json({ error: 'All vendor details are required' });
    }

    const query = 'INSERT INTO vendors2 (name, phone_number, address, supplies, category) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, phone_number, address, supplies, category], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }
        res.status(201).json({ message: 'Vendor added successfully' });
    });
});

router.post('/orders', (req, res) => {
    const { items, totalBill, vendorId } = req.body;

    if (!items || !totalBill || !vendorId) {
        return res.status(400).json({ error: 'Items, totalBill, and vendorId are required' });
    }

    const orderPromises = items.map(item => {
        const { itemName, ownerName, price, quantity, discount } = item;
        const total = (price * quantity) - ((discount / 100) * (price * quantity));
        
        const query = 'INSERT INTO orders (vendor_id, item_name, owner_name, price, quantity, discount, total) VALUES (?, ?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [vendorId, itemName, ownerName, price, quantity, discount, total], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    });

    Promise.all(orderPromises)
        .then(() => {
            res.status(201).json({ message: 'Order placed successfully' });
        })
        .catch((error) => {
            console.error('Error placing order:', error);
            res.status(500).send('Server error');
        });
});

router.get('/orders/:vendorId', (req, res) => {
    const { vendorId } = req.params;
    db.query('SELECT * FROM orders WHERE vendor_id = ?', [vendorId], (error, results) => {
        if (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Error fetching orders' });
        } else {
            res.json(results);
        }
    });
});


module.exports = router;
