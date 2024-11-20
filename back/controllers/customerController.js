
const db = require('../config/db'); 

const CustomerController = {
    searchCustomer: async (req, res) => {
        const { phone } = req.query;

        db.query('SELECT * FROM customers WHERE phone = ?', [phone], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: 'Customer not found!' });

            const customer = results[0];
            db.query('SELECT * FROM bills WHERE customer_id = ?', [customer.id], (err, bills) => {
                if (err) return res.status(500).json({ error: err.message });

                res.status(200).json({
                    id: customer.id,
                    name: customer.name,
                    phone: customer.phone,
                    billingHistory: bills
                });
            });
        });
    }
};

module.exports = CustomerController;
