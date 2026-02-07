const express = require('express');
const router = express.Router();
const {
    registerForEvent,
    getRegistrations,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRegistrations).post(protect, registerForEvent);

module.exports = router;
