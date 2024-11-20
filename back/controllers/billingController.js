const db = require('../config/db');

const BillingController = {
    addBilling: async (req, res) => {
        const { customerName, customerPhone, items, total, purchaseDate } = req.body;

        if (!/^[A-Za-z\s]+$/.test(customerName)) {
            return res.status(400).json({ error: 'Customer name must contain only letters.' });
        }
        if (!/^\d{10}$/.test(customerPhone)) {
            return res.status(400).json({ error: 'Phone number must be exactly 10 digits.' });
        }

        db.query(
            'INSERT INTO customers (name, phone) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)', 
            [customerName, customerPhone], 
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                const customerId = result.insertId;

                const currentDate = new Date();
                const purchaseDateTime = purchaseDate ? new Date(purchaseDate) : currentDate;

                db.query('INSERT INTO bills (customer_id, total, date, purchase_date) VALUES (?, ?, ?, ?)', 
                    [customerId, total, currentDate, purchaseDateTime], 
                    (err, billResult) => {
                        if (err) return res.status(500).json({ error: err.message });

                        const billId = billResult.insertId;

                        items.forEach(item => {
                            db.query('INSERT INTO billing_items (bill_id, item_name, quantity, price, gst) VALUES (?, ?, ?, ?, ?)', 
                                [billId, item.itemName, item.quantity, item.price, item.gst],
                                (err) => {
                                    if (err) console.error(err);
                                });
                        });

                        res.status(200).json({ message: 'Billing data added successfully!' });
                    });
            });
    },

    getAllCustomers: (req, res) => {
        const { date } = req.query; 

        let query = ` 
            SELECT customers.id AS customerId, customers.name AS customerName, customers.phone AS customerPhone,
                   bills.id AS billId, bills.total AS billTotal, bills.date AS billDate, bills.purchase_date AS purchaseDate,
                   billing_items.item_name AS itemName, billing_items.quantity, billing_items.price, billing_items.gst
            FROM customers
            LEFT JOIN bills ON customers.id = bills.customer_id
            LEFT JOIN billing_items ON bills.id = billing_items.bill_id
        `;

        const queryParams = [];

        if (date) {
            query += ` WHERE DATE(bills.purchase_date) = ?`;
            queryParams.push(date); 
        }

        query += ` ORDER BY customers.id, bills.id;`;

        db.query(query, queryParams, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    },

    getCustomersByDate: async (req, res) => {
        const { date } = req.query;

        try {
            let query = 'SELECT * FROM customers';
            let values = [];

            if (date) {
                query += ' WHERE DATE(purchaseDate) = ?';
                values.push(date);
            }

            const [results] = await db.execute(query, values);
            res.json(results);
        } catch (error) {
            console.error('Error fetching customers by date:', error);
            res.status(500).send('Error fetching data');
        }
    },

    getCustomerBillingHistory: (req, res) => {
        const customerId = req.params.customerId;
        const query = `
            SELECT customers.id AS customerId, customers.name AS customerName, customers.phone AS customerPhone,
                   bills.id AS billId, bills.total AS billTotal, bills.date AS billDate, bills.purchase_date AS purchaseDate,
                   billing_items.item_name AS itemName, billing_items.quantity, billing_items.price, billing_items.gst
            FROM customers
            LEFT JOIN bills ON customers.id = bills.customer_id
            LEFT JOIN billing_items ON bills.id = billing_items.bill_id
            WHERE customers.id = ?
            ORDER BY bills.id;
        `;

        db.query(query, [customerId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    },

    getAllBills: (req, res) => {
        const query = `
            SELECT bills.id AS billId, bills.total AS billTotal, bills.date AS billDate, bills.purchase_date AS purchaseDate,
                   customers.name AS customerName, customers.phone AS customerPhone,
                   billing_items.item_name AS itemName, billing_items.quantity, billing_items.price, billing_items.gst
            FROM bills
            LEFT JOIN customers ON bills.customer_id = customers.id
            LEFT JOIN billing_items ON bills.id = billing_items.bill_id
            ORDER BY bills.id;
        `;

        db.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    }
};

module.exports = BillingController;
