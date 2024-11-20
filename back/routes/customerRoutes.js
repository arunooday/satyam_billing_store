
const express = require('express');
const CustomerController = require('../controllers/customerController'); 

const router = express.Router();

router.get('/search', CustomerController.searchCustomer);

module.exports = router;
