
const db = require('../config/db');

const Customer = {
    findByPhone: (phone, callback) => {
        db.query('SELECT * FROM customers WHERE phone = ?', [phone], callback);
    },
    createOrUpdate: (name, phone, callback) => {
        db.query('INSERT INTO customers (name, phone) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)', [name, phone], callback);
    },
};

module.exports = Customer;
