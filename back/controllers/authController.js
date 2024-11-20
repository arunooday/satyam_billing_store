const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const validateUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

const AuthController = {
    register: async (req, res) => {
        const { username, password } = req.body;

        if (!validateUsername(username)) {
            return res.status(400).json({ error: 'Invalid username format.' });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Password does not meet requirements.' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.status(201).json({ message: 'User registered successfully!' });
            });
        } catch (err) {
            res.status(500).json({ error: 'Server error during registration' });
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (results.length === 0) return res.status(401).json({ error: 'User not found!' });

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials!' });

            req.session.user = { id: user.id, username: user.username };

            const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful!', token });
        });
    },

    logout: (req, res) => {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to logout' });
                }
                res.clearCookie('connect.sid', { path: '/' });
                return res.status(200).json({ message: 'Logout successful' });
            });
        } else {
            res.status(400).json({ error: 'No active session' });
        }
    },

    session: (req, res) => {
        if (req.session && req.session.user) {
            res.json({ isAuthenticated: true, user: req.session.user });
        } else {
            res.json({ isAuthenticated: false });
        }
    },
};

module.exports = AuthController;
