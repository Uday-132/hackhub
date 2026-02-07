const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
});

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    // Get recent 5 users
    const recentUsers = await User.find({}).select('name email createdAt').sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
        totalUsers,
        totalEvents,
        totalRegistrations,
        recentUsers
    });
});

module.exports = {
    getUsers,
    getAdminStats,
};
