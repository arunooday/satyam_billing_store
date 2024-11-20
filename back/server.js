const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');
const customerRoutes = require('./routes/customerRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(bodyParser.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000, // 15 minutes
    },
}));

app.use('/api/auth', authRoutes);
app.use('/api', billingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vendor-management', vendorRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
