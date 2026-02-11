const express = require('express');
const router = express.Router();
const { getUsers, getAdminStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.get('/stats', protect, admin, getAdminStats);

module.exports = router;
