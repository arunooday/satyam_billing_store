const express = require('express');
const router = express.Router();
const BillingController = require('../controllers/billingController');
const checkAuth = require('../middleware/authMiddleware');  // Import middleware

router.post('/billing/add', BillingController.addBilling);
router.get('/billing/customers', BillingController.getAllCustomers);

module.exports = router;
