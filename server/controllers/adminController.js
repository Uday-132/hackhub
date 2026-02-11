const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');

// @desc    Get users who registered for admin's events
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // 1. Find events created by this admin
    const events = await Event.find({ createdBy: req.user.id });
    const eventIds = events.map(event => event._id);

    // 2. Find registrations for these events
    const registrations = await Registration.find({ event: { $in: eventIds } }).populate('user', '-password');

    // 3. Extract unique users
    const uniqueUsersMap = new Map();
    registrations.forEach(reg => {
        if (reg.user) {
            uniqueUsersMap.set(reg.user._id.toString(), reg.user);
        }
    });

    const users = Array.from(uniqueUsersMap.values());
    // Sort by most recent registration or user creation? Let's keep user creation for consistency
    users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(users);
});

// @desc    Get admin stats (filtered by admin's events)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    // 1. Find events created by this admin
    const events = await Event.find({ createdBy: req.user.id });
    const eventIds = events.map(event => event._id);

    const totalEvents = events.length;

    // 2. Find registrations for these events
    const registrations = await Registration.find({ event: { $in: eventIds } }).populate('user', 'name email createdAt');

    const totalRegistrations = registrations.length;

    // 3. Extract unique users
    const uniqueUsersMap = new Map();
    registrations.forEach(reg => {
        if (reg.user) {
            uniqueUsersMap.set(reg.user._id.toString(), reg.user);
        }
    });

    const totalUsers = uniqueUsersMap.size;

    // 4. Get recent users from the unique set
    const users = Array.from(uniqueUsersMap.values());
    const recentUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

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
