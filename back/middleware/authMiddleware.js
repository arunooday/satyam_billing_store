

const checkAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next(); 
    } else {
        res.status(401).json({ error: 'Unauthorized access. Please login first.' });
    }
};

module.exports = checkAuth;
