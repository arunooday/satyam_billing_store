
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9133@Uday',
    database: 'billing_system',
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

module.exports = db;
